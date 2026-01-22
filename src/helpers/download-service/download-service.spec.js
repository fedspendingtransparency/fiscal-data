import { ReplaySubject } from 'rxjs';
import { take, filter, shareReplay } from 'rxjs/operators';
import '@rxreact/jest-helpers';
import localStorageHelper from '../local-storage-helper/local-storage-helper';
import WebsocketService from '../websocket-service/websocket-service';
import globalConstants from '../constants';
import { exportsForUnitTests, removeFromCompleted } from './download-service';
import { setGlobalFetchResponse } from '../../utils/mock-utils';

const mockConnectWebsocketNext = jest.fn();
let mockWebsocket = new ReplaySubject(1);
mockWebsocket.next({ status: 'processed' });

jest.mock('../websocket-service/websocket-service', () => ({
  connectWebsocket: jest.fn().mockImplementation(key => {
    return {
      key: key,
      socket: mockWebsocket,
    };
  }),
}));
jest.mock('../local-storage-helper/local-storage-helper', () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
}));

jest.useFakeTimers();

const queuedKey = `${globalConstants.config.downloadService.localStorageKeys.queued}`;
const inProgressKey = `${globalConstants.config.downloadService.localStorageKeys.inProgress}`;
const completedKey = `${globalConstants.config.downloadService.localStorageKeys.completed}`;

describe('Dataset Download Service', () => {
  let sub, downloadService;

  const watchSignal = o$ => {
    // Share so the signal records all values emitted.
    const hot$ = o$.pipe(shareReplay());

    // Subscribe to the signal so it starts emitting.
    sub = hot$.subscribe();

    // Return the hot signal for testing.
    return hot$;
  };

  beforeAll(() => {
    return import('./download-service').then(module => {
      downloadService = module.default;
      jest.resetModules();
    });
  });

  beforeEach(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
    WebsocketService.connectWebsocket.mockClear();
    localStorageHelper.set.mockClear();
    localStorageHelper.get.mockClear();

    mockWebsocket = new ReplaySubject(1).pipe(
      filter(msg => {
        return !msg.hasOwnProperty('apis');
      })
    );
    mockConnectWebsocketNext.mockClear();
  });

  afterEach(() => {
    if (sub) sub.unsubscribe();
    jest.restoreAllMocks();
  });

  it('initiates connection and requests data', async () => {
    await downloadService.initiateDownload('123-45678', ['123'], { from: '2005-10-03', to: '2021-02-17' }, 'zip');
    await expect(WebsocketService.connectWebsocket).toHaveBeenCalled();

    jest.runAllTimers();
  });

  it('dataset shows in progress', async () => {
    const mockDataRequested = {
      apis: ['123'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
    };
    const requestId = downloadService.initiateDownload('123-45678', mockDataRequested.apis, mockDataRequested.dateRange, mockDataRequested.fileTypes);
    mockWebsocket.next({ status: 'started', status_path: 'test/status/path/hash/statusfile' });

    const hot$ = watchSignal(downloadService.datasetInProgress(requestId));
    await expect(hot$).toEmitValue(true);
  });

  it('download status updates', async () => {
    const mockDataRequested = {
      apis: ['123'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
    };

    const requestId = downloadService.initiateDownload('123-45678', mockDataRequested.apis, mockDataRequested.dateRange, mockDataRequested.fileTypes);
    mockWebsocket.next({ status: 'started', status_path: 'test/status/path/hash/statusfile' });

    const hot$ = watchSignal(downloadService.downloadStatus(requestId));

    await expect(hot$).toEmit();
    expect(downloadService.datasetIdsInProgress()).toStrictEqual(['123-45678']);
    expect(downloadService.isDatasetInProgress('123-45678')).toBe(true);
    expect(downloadService.isDatasetInProgress('123-45672020')).toBe(false);

    jest.runAllTimers();
  });

  it('datasetId is added to messages', async () => {
    const mockDataRequested = {
      apiIds: ['123'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
    };

    const statusPath = '/status/path/path2/hash/file';

    const requestId = downloadService.initiateDownload(
      '123-45670',
      mockDataRequested.apiIds,
      mockDataRequested.dateRange,
      mockDataRequested.fileTypes
    );

    const expectedEmit = {
      datasetId: '123-45670',
      requestId: requestId,
      status: 'started',
      progress: { current: 0, total: 30, pct: 0, apis: {} },
      dl_check_page_path: 'http://localhost/downloads/hash',
      final_file_name: 'undefined',
      status_path: statusPath,
      requested: mockDataRequested,
      filename: 'undefined',
      downloadUrl: 'undefined',
      statusPath: 'http://localhost/downloads/hash',
      dateRange: mockDataRequested.dateRange,
      selectedFileType: mockDataRequested.fileTypes,
      prepStarted: true,
    };

    mockWebsocket.next({ status: 'started', status_path: statusPath });

    const hot$ = watchSignal(downloadService.downloadStatus(requestId).pipe(take(1)));

    await expect(hot$).toEmitValue(expectedEmit);
    jest.runAllTimers();
  });

  it('started messages save to local storage', async () => {
    const statusPath = '/status/path/path2/hash/file';
    const filePath = '/file/path/path2/hash/file';
    const mockDataRequested = {
      apiIds: ['123'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
    };

    const requestId = downloadService.initiateDownload(
      '123-456711',
      mockDataRequested.apiIds,
      mockDataRequested.dateRange,
      mockDataRequested.fileTypes
    );

    const expectedEmit = {
      datasetId: '123-456711',
      requestId: requestId,
      status: 'started',
      progress: { current: 0, total: 30, pct: 0, apis: {} },
      dl_check_page_path: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/hash`,
      status_path: statusPath,
      final_file_name: filePath,
      requested: mockDataRequested,
      filename: 'file',
      downloadUrl: filePath,
      statusPath: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/hash`,
      dateRange: mockDataRequested.dateRange,
      selectedFileType: mockDataRequested.fileTypes,
      requestTime: undefined,
      prepStarted: true,
    };

    mockWebsocket.next({ status: 'started', status_path: statusPath, file_path: filePath });

    const hot$ = watchSignal(downloadService.downloadStatus(requestId).pipe());
    await expect(hot$).toEmitValue(expectedEmit);

    mockWebsocket.next({
      status: 'started',
      status_path: statusPath,
      file_path: filePath,
    });
    await expect(hot$).toEmitValue(expectedEmit);
    const expectedObject = {};
    expectedObject[requestId] = expectedEmit;

    expect(localStorageHelper.set.mock.calls[0][0]).toBe(inProgressKey);
    expect(localStorageHelper.set.mock.calls[0][1]).toStrictEqual(expectedObject);

    jest.runAllTimers();
  });

  it('can remove completed downloads from local storage', () => {
    const nowTS = new Date().getTime();
    const mockCompletedLocalStorage = {
      'MY-DATASET-XX': [{ requestId: `mockRequest_A::${nowTS}` }, { requestId: `mockRequest_B::${nowTS}` }],
      'MY-DATASET-YY': [{ requestId: `mockRequest_C::${nowTS}` }],
    };
    localStorageHelper.get = jest
      .fn()
      .mockImplementationOnce(() => {
        return mockCompletedLocalStorage;
      })
      .mockImplementationOnce(() => {
        return mockCompletedLocalStorage;
      });
    const withoutB = {
      'MY-DATASET-XX': [{ requestId: `mockRequest_A::${nowTS}` }],
      'MY-DATASET-YY': [{ requestId: `mockRequest_C::${nowTS}` }],
    };
    const withoutC = {
      'MY-DATASET-XX': [{ requestId: `mockRequest_A::${nowTS}` }, { requestId: `mockRequest_B::${nowTS}` }],
    };
    removeFromCompleted(`mockRequest_B::${nowTS}`);
    expect(localStorageHelper.set).toHaveBeenLastCalledWith(completedKey, withoutB);

    removeFromCompleted(`mockRequest_C::${nowTS}`);
    expect(localStorageHelper.set).toHaveBeenLastCalledWith(completedKey, withoutC);
  });

  // it('can purge old downloads from local storage', () => {
  //   const nowTS = new Date().getTime();
  //   const aDayAgoTS = nowTS - 1000 * 60 * 60 * 24;
  //   const mockCompletedLocalStorage = {
  //     'MY-DATASET-XX': [{ requestId: `mockRequest_A::${nowTS}` }, { requestId: `mockRequest_B::${aDayAgoTS}` }],
  //     'MY-DATASET-YY': [{ requestId: `mockRequest_C::${aDayAgoTS}` }],
  //   };
  //   localStorageHelper.get = jest
  //     .fn()
  //     .mockImplementationOnce(() => {
  //       return mockCompletedLocalStorage;
  //     })
  //     .mockImplementationOnce(() => {
  //       return mockCompletedLocalStorage;
  //     });
  //   const withoutB = {
  //     'MY-DATASET-XX': [{ requestId: `mockRequest_A::${nowTS}` }],
  //   };
  //   downloadService.purgeOldRequests();
  //
  //   expect(localStorageHelper.set).toHaveBeenLastCalledWith(completedKey, withoutB);
  // });

  it('cancelled requests remove from local storage', async () => {
    const datasetId = '123-456711';
    const statusPath = '/status/path/path2/hash/file';
    const filePath = '/file/path/path2/hash/file';
    const mockDataRequested = {
      apiIds: ['123'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
      requestTime: 1234567890,
    };

    const requestId = downloadService.initiateDownload(
      datasetId,
      mockDataRequested.apiIds,
      mockDataRequested.dateRange,
      mockDataRequested.fileTypes,
      mockDataRequested.requestTime
    );

    const expectedEmit = {
      datasetId: '123-456711',
      requestId: requestId,
      status: 'started',
      progress: { current: 0, total: 30, pct: 0, apis: {} },
      dl_check_page_path: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/hash`,
      status_path: statusPath,
      final_file_name: filePath,
      requested: {
        apiIds: mockDataRequested.apiIds,
        dateRange: mockDataRequested.dateRange,
        fileTypes: mockDataRequested.fileTypes,
      },
      filename: 'file',
      downloadUrl: filePath,
      statusPath: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/hash`,
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      selectedFileType: mockDataRequested.fileTypes,
      prepStarted: true,
      requestTime: undefined,
    };

    mockWebsocket.next({ status: 'started', status_path: statusPath, file_path: filePath });

    const hot$ = watchSignal(downloadService.downloadStatus(requestId).pipe());
    await expect(hot$).toEmitValue(expectedEmit);

    mockWebsocket.next({
      status: 'started',
      status_path: statusPath,
      file_path: filePath,
    });
    await expect(hot$).toEmitValue(expectedEmit);

    expect(localStorageHelper.set.mock.calls[0][0]).toBe('in-progress-downloads');
    const expected = {};
    expected[requestId] = expectedEmit;
    expect(localStorageHelper.set.mock.calls[0][1]).toStrictEqual(expected);

    localStorageHelper.get = jest.fn().mockImplementation(datasetId => {
      return expected;
    });

    downloadService.cancelDownload(requestId);

    expect(localStorageHelper.set.mock.calls[2][0]).toBe(queuedKey);
    expect(localStorageHelper.set.mock.calls[2][1]).toStrictEqual({});
    expect(localStorageHelper.set.mock.calls[3][0]).toBe(completedKey);
    expect(localStorageHelper.set.mock.calls[3][1]).toStrictEqual({});
    jest.runAllTimers();
  });

  it('completed messages save to local storage', async () => {
    const statusPath = '/status/path/path2/hash/file';
    const filePath = '/file/path/path2/hash/file';
    const mockDataRequested = {
      apiIds: ['123'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
    };

    const requestId = downloadService.initiateDownload(
      '123-456712',
      mockDataRequested.apiIds,
      mockDataRequested.dateRange,
      mockDataRequested.fileTypes
    );

    const expectedEmit = {
      datasetId: '123-456712',
      requestId: requestId,
      status: 'completed',
      progress: { current: 0, total: 30, pct: 0, apis: {} },
      dl_check_page_path: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/hash`,
      final_file_name: filePath,
      status_path: statusPath,
      requested: mockDataRequested,
      filename: filePath.substring(filePath.lastIndexOf('/') + 1),
      downloadUrl: filePath,
      statusPath: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/hash`,
      dateRange: mockDataRequested.dateRange,
      selectedFileType: mockDataRequested.fileTypes,
      prepStarted: true,
      requestTime: undefined,
    };

    mockWebsocket.next({
      status: 'started',
      status_path: statusPath,
      file_path: filePath,
    });

    const hot$ = watchSignal(downloadService.downloadStatus(requestId).pipe());
    //await expect(hot$).toEmitValue({ datasetId: '123-45678', status: 'processed' });

    const completeMsg = {
      datasetId: '123-456712',
      status: 'completed',
      status_path: statusPath,
      file_path: filePath,
      filesize_kb: '123',
    };

    mockWebsocket.next(completeMsg);
    await expect(hot$).toEmit();
    expect(localStorageHelper.get.mock.calls[0][0]).toBe(inProgressKey);
    expect(localStorageHelper.set.mock.calls[1][0]).toBe(completedKey);
    const completedStoredMsg = { '123-456712': [expectedEmit] };

    expect(localStorageHelper.set.mock.calls[1][1]).toStrictEqual(completedStoredMsg);

    jest.runAllTimers();
  });

  it('websocket disconnected when completed message received', async () => {
    const statusPath = '/status/path/path2/hash/file';
    const filePath = '/file/path/path2/hash/file';
    const mockDataRequested = {
      apiIds: ['123'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
    };

    const requestId = downloadService.initiateDownload(
      '123-456712',
      mockDataRequested.apiIds,
      mockDataRequested.dateRange,
      mockDataRequested.fileTypes
    );

    mockWebsocket.next({
      status: 'started',
      status_path: statusPath,
      file_path: filePath,
    });

    const hot$ = watchSignal(downloadService.downloadStatus(requestId).pipe());

    const completeMsg = {
      datasetId: '123-456712',
      status: 'completed',
      status_path: statusPath,
      file_path: filePath,
      filesize_kb: '123',
    };
    let completed = false;

    mockWebsocket.subscribe({
      next: () => {},
      error: err => {},
      complete: () => {
        completed = true;
      },
    });

    mockWebsocket.next(completeMsg);
    await expect(hot$).toEmit();
    jest.runAllTimers();
    expect(completed).toBe(true);
  });

  it('websocket disconnects when error message received', async () => {
    const statusPath = 'this/isalongpath/string';
    const filePath = 'this/isanotherlongpath/string';

    const requestId = downloadService.initiateDownload('123-45678', ['123'], { from: '2005-10-03', to: '2021-02-17' }, 'zip');

    mockWebsocket.next({
      status: 'started',
      status_path: statusPath,
      file_path: filePath,
    });

    watchSignal(downloadService.downloadStatus(requestId).pipe());
    const errorMsg = {
      status: 'failed',
      status_path: statusPath,
      file_path: filePath,
      filesize_kb: '123',
      error: { code: 1234, message: 'error message' },
    };
    let completed = false;

    mockWebsocket.subscribe({
      next: () => {},
      error: err => {},
      complete: () => {
        completed = true;
      },
    });
    mockWebsocket.next(errorMsg);
    expect(completed).toBe(true);
    // rxjs throws error messages when an error is passed to the websocket
    expect(() => jest.runAllTimers()).toThrowError();
  });

  it('error message creates console error', async () => {
    const statusPath = 'this/isalongpath/string';
    const filePath = 'this/isanotherlongpath/string';

    const requestId = downloadService.initiateDownload('123-45678', ['123'], { from: '2005-10-03', to: '2021-02-17' }, 'zip');

    mockWebsocket.next({
      status: 'started',
      status_path: statusPath,
      file_path: filePath,
    });

    watchSignal(downloadService.downloadStatus(requestId).pipe(take(1)));
    const errorMsg = {
      status: 'failed',
      status_path: statusPath,
      file_path: filePath,
      filesize_kb: '123',
      error: { code: 1234, message: 'error message' },
    };

    mockWebsocket.next(errorMsg);

    // NOTE: Can't see errors in observables in the tests, just yet.
    expect(console.error).toHaveBeenCalled();
  });

  // describe('download updates via polling', () => {
  //   let localStorageHelper;
  //   const mockDataRequested = {
  //     apiIds: ['123'],
  //     dateRange: { from: '2005-10-03', to: '2021-02-17' },
  //     fileTypes: 'zip',
  //   };
  //
  //   const completedMsg = {
  //     status: 'completed',
  //     status_path: 'this/isalongpath/string',
  //     file_path: 'this/isanotherlongpath/string',
  //     filesize_kb: '123',
  //   };
  //   const testDatasetId = '123-45672020';
  //   const nowTS = new Date().getTime();
  //   const testRequestId = `${testDatasetId}::${nowTS}`;
  //
  //   const expectedMsg = {
  //     status: 'completed',
  //     status_path: 'this/isalongpath/string',
  //     progress: { current: 0, total: 30, pct: 0, apis: {} },
  //     dl_check_page_path: null,
  //     final_file_name: 'this/isanotherlongpath/string',
  //     datasetId: `${testDatasetId}`,
  //     requestId: `${testRequestId}`,
  //     requested: mockDataRequested,
  //     resumed: true,
  //     readyForDownload: true,
  //   };
  //
  //   beforeAll(() => {
  //     jest.restoreAllMocks();
  //   });
  //
  //   beforeEach(async () => {
  //     global.fetch = jest.fn(() => {
  //       return Promise.resolve({
  //         ok: true,
  //         ready: true,
  //         json: () => {
  //           return Promise.resolve(completedMsg);
  //         },
  //       });
  //     });
  //
  //     // setGlobalFetchResponse(completedMsg);
  //
  //     jest.doMock('../local-storage-helper/local-storage-helper', () => ({
  //       set: jest.fn(),
  //       get: jest.fn().mockImplementation(key => {
  //         const output = {};
  //         output[inProgressKey] = {};
  //         output[inProgressKey][testRequestId] = {
  //           status: 'started',
  //           status_path: 'this/isalongpath/string',
  //           progress: { current: 0, total: 30, pct: 0, apis: {} },
  //           dl_check_page_path: null,
  //           final_file_name: 'this/isanotherlongpath/string',
  //           datasetId: `${testDatasetId}`,
  //           requestId: `${testRequestId}`,
  //           requested: mockDataRequested,
  //         };
  //         return output[key];
  //       }),
  //       remove: jest.fn(),
  //     }));
  //     import('../local-storage-helper/local-storage-helper').then(module => {
  //       localStorageHelper = module.default;
  //     });
  //     import('./download-service').then(module => {
  //       downloadService = module.default;
  //     });
  //   });
  //
  //   // it('creates status subject for updates to status and makes an ', async () => {
  //   //   downloadService.startProcessingIncompleteFileRequests();
  //   //   const hot$ = watchSignal(downloadService.downloadStatus(testRequestId));
  //   //   await expect(hot$).toEmit();
  //   //   jest.runOnlyPendingTimers();
  //   //   await expect(global.fetch).toBeCalled();
  //   //   expect(global.fetch.mock.calls[0][0]).toContain(`/this/isalongpath/string`);
  //   //   const expected = {};
  //   //   expected[testDatasetId] = [expectedMsg];
  //   //   jest.runOnlyPendingTimers();
  //   //   await expect(hot$).toEmit();
  //   //   expect(localStorageHelper.set.mock.calls[2][1]).toStrictEqual(expected);
  //   // });
  // });

  describe('processing messages', () => {
    let runCount = 0;
    const datasetId = '123-45678';
    let currentDatasetId = `${datasetId}${runCount++}`;
    const mockDataRequested = {
      apiIds: ['1', '2', '3'],
      dateRange: { from: '2005-10-03', to: '2021-02-17' },
      fileTypes: 'zip',
    };
    const hashcode = 'hashcode';
    const statusPath = `/test/status/path/${hashcode}/status.json`;
    const filePath = `/test/file/zip/${hashcode}/a_real_file.zip`;
    let expectedObject;
    let progressObject;
    let requestId;

    beforeEach(async () => {
      currentDatasetId = `${datasetId}${runCount++}`;
      progressObject = {
        current: 0,
        total: globalConstants.config.downloadService.APITotalPagesStartValue * mockDataRequested.apiIds.length,
        pct: 0,
        apis: {},
      };

      requestId = downloadService.initiateDownload(
        currentDatasetId,
        mockDataRequested.apiIds,
        mockDataRequested.dateRange,
        mockDataRequested.fileTypes
      );

      expectedObject = {
        status: 'started',
        status_path: statusPath,
        final_file_name: filePath,
        datasetId: currentDatasetId,
        requestId: requestId,
        dl_check_page_path: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/${hashcode}`,
        requested: mockDataRequested,
        progress: progressObject,
        downloadUrl: filePath,
        filename: filePath.substring(filePath.lastIndexOf('/') + 1),
        statusPath: `${exportsForUnitTests.baseSiteUrl}${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}/${hashcode}`,
        dateRange: mockDataRequested.dateRange,
        prepStarted: true,
        selectedFileType: mockDataRequested.fileTypes,
        startedTable: true,
      };

      mockWebsocket.next({
        status: 'started',
        status_path: statusPath,
        file_path: filePath,
      });
    });

    it('update totals', async () => {
      const hot$ = watchSignal(downloadService.downloadStatus(requestId).pipe());

      mockWebsocket.next({
        apiId: 1,
        totalPages: 5,
        status: 'started',
      });

      progressObject = {
        current: 0,
        total: globalConstants.config.downloadService.APITotalPagesStartValue * (mockDataRequested.apiIds.length - 1) + 5,
        pct: 0,
        apis: { '1': { total: 5, processed: 0, error: null } },
      };
      expectedObject = { ...expectedObject, progress: progressObject };

      await expect(hot$).toEmitValue(expectedObject);

      mockWebsocket.next({
        apiId: 2,
        totalPages: 10,
        status: 'started',
      });

      progressObject = {
        current: 0,
        total: globalConstants.config.downloadService.APITotalPagesStartValue * (mockDataRequested.apiIds.length - 2) + 5 + 10,
        pct: 0,
        apis: {
          '1': { total: 5, processed: 0, error: null },
          '2': { total: 10, processed: 0, error: null },
        },
      };
      expectedObject = { ...expectedObject, progress: progressObject };

      await expect(hot$).toEmitValue(expectedObject);

      mockWebsocket.next({
        apiId: 3,
        totalPages: 15,
        status: 'started',
      });

      progressObject = {
        current: 0,
        total: globalConstants.config.downloadService.APITotalPagesStartValue * (mockDataRequested.apiIds.length - 3) + 5 + 10 + 15,
        pct: 0,
        apis: {
          '1': { total: 5, processed: 0, error: null },
          '2': { total: 10, processed: 0, error: null },
          '3': { total: 15, processed: 0, error: null },
        },
      };
      expectedObject = { ...expectedObject, progress: progressObject };

      await expect(hot$).toEmitValue(expectedObject);
    });

    it('update progress', async () => {
      const hot$ = watchSignal(downloadService.downloadStatus(requestId).pipe());

      mockWebsocket.next({ apiId: 1, totalPages: 5, status: 'started' });
      mockWebsocket.next({ apiId: 2, totalPages: 10, status: 'started' });
      mockWebsocket.next({ apiId: 3, totalPages: 15, status: 'started' });

      const total = globalConstants.config.downloadService.APITotalPagesStartValue * (mockDataRequested.apiIds.length - 3) + 5 + 10 + 15;

      mockWebsocket.next({ apiId: 1, page: 1, status: 'processed' });

      progressObject = {
        current: 1,
        total: total,
        pct: 1 / total,
        apis: {
          '1': { total: 5, processed: 1, error: null },
          '2': { total: 10, processed: 0, error: null },
          '3': { total: 15, processed: 0, error: null },
        },
      };
      expectedObject = { ...expectedObject, progress: progressObject };

      await expect(hot$).toEmitValue(expectedObject);

      mockWebsocket.next({ apiId: 1, page: 2, status: 'processed' });
      mockWebsocket.next({ apiId: 2, page: 1, status: 'processed' });

      progressObject = {
        current: 3,
        total: total,
        pct: 3 / total,
        apis: {
          '1': { total: 5, processed: 2, error: null },
          '2': { total: 10, processed: 1, error: null },
          '3': { total: 15, processed: 0, error: null },
        },
      };
      expectedObject = { ...expectedObject, progress: progressObject };

      await expect(hot$).toEmitValue(expectedObject);

      for (let i = 0; i < 3; i++) {
        mockWebsocket.next({ apiId: 1, page: i, status: 'processed' });
      }
      for (let i = 0; i < 9; i++) {
        mockWebsocket.next({ apiId: 2, page: i, status: 'processed' });
      }
      for (let i = 0; i < 15; i++) {
        mockWebsocket.next({ apiId: 3, page: i, status: 'processed' });
      }

      mockWebsocket.next({ apiId: 1, totalPages: 5, status: 'completed' });
      mockWebsocket.next({ apiId: 2, totalPages: 10, status: 'completed' });
      mockWebsocket.next({ apiId: 3, totalPages: 15, status: 'completed' });

      progressObject = {
        current: 30,
        total: total,
        pct: 30 / total,
        apis: {
          '1': { total: 5, processed: 5, error: null },
          '2': { total: 10, processed: 10, error: null },
          '3': { total: 15, processed: 15, error: null },
        },
      };
      expectedObject = { ...expectedObject, progress: progressObject };

      await expect(hot$).toEmitValue(expectedObject);
    });
  });

  describe('startPollingByRequestToken', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    const requestToken = '210387c27e72a73d4d5cfbfd11f5f811264c5a1f442e7f484af4ee082755d538';
    const failedRequestToken = 'a282fb48850e4f8eae5df293694006fabd592c1e58bf3a1046e3417c5a6df45f';

    it('gets status from json file', async () => {
      const expectedResponse = {
        status: 'complete',
        file_path: `zip/${requestToken}/HstDebt_20010201_20210131.zip`,
      };
      setGlobalFetchResponse(jest, expectedResponse);
      const hot$ = watchSignal(downloadService.startPollingByRequestToken(requestToken));

      jest.advanceTimersByTime(30);
      await expect(hot$).toEmitValue(expectedResponse);
    });

    it('checked repeatedly until complete', async () => {
      setGlobalFetchResponse(jest, {
        status: 'started',
        file_path: `zip/${requestToken}/HstDebt_20010201_20210131.zip`,
      });
      const hot$ = watchSignal(downloadService.startPollingByRequestToken(requestToken));
      jest.advanceTimersByTime(1000);
      await expect(hot$).toEmitValue({
        status: 'in-progress',
        file_path: `zip/${requestToken}/HstDebt_20010201_20210131.zip`,
      });

      jest.advanceTimersByTime(30001);
      await expect(hot$).toEmitValue({
        status: 'in-progress',
        file_path: `zip/${requestToken}/HstDebt_20010201_20210131.zip`,
      });

      setGlobalFetchResponse(jest, {
        status: 'complete',
        file_path: `zip/${requestToken}/HstDebt_20010201_20210131.zip`,
      });

      jest.advanceTimersByTime(30001);
      await expect(hot$).toEmitValue({
        status: 'complete',
        file_path: `zip/${requestToken}/HstDebt_20010201_20210131.zip`,
      });
    });

    it('stops checking status on failed', async () => {
      setGlobalFetchResponse(jest, {
        status: 'failed',
        file_path: `zip/${failedRequestToken}/TOP_FedClct_20131101_20181001.zip`,
        status_path: `zip/${failedRequestToken}/status.json`,
        filesize_kb: 12806.95,
      });
      const hot$ = watchSignal(downloadService.startPollingByRequestToken(requestToken));
      jest.advanceTimersByTime(1000);
      await expect(global.fetch).toBeCalledTimes(1);
      await expect(hot$).toEmitValue({
        file_path: `zip/${failedRequestToken}/TOP_FedClct_20131101_20181001.zip`,
        status: 'failed',
        status_path: `zip/${failedRequestToken}/status.json`,
        filesize_kb: 12806.95,
      });

      // We're running the timers long enough to give it a chance to call again.
      jest.advanceTimersByTime(30001);
      await expect(global.fetch).toBeCalledTimes(1);
      jest.advanceTimersByTime(30001);
      await expect(global.fetch).toBeCalledTimes(1);
    });
  });
});
