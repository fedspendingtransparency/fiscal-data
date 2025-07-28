import { act, render } from '@testing-library/react';
import React from 'react';
import { getGreatestProgress } from './downloads-persist';
import { ReplaySubject } from 'rxjs';
import downloadService from '../../../helpers/download-service/download-service';
import * as progressHelpers from './download-progress-helper';
import DownloadsPersist, { downloadsContext } from './downloads-persist';
let mockDownloadStatus = new ReplaySubject(1);
mockDownloadStatus.next({
  status: 'started',
  dl_check_page_path: '/somelongaccesshashkey',
  final_file_name: '/someTable_someDateRange.type.zip',
  progress: {
    pct: 0,
  },
});

const mockSpies = {
  initiator: jest.fn().mockImplementation((datasetId, apis, dateRange, fileTypes, requestTime) => `${datasetId}::${requestTime}`),
  inProgress: jest.fn().mockImplementation(() => {
    return [];
  }),
};
jest.mock('../../../helpers/download-service/download-service', function() {
  return {
    __esModule: true,
    default: {
      initiateDownload: jest.fn().mockImplementation((...args) => {
        return mockSpies.initiator(...args);
      }),
      downloadStatus: jest.fn().mockImplementation(() => {
        return mockDownloadStatus;
      }),
      datasetsInOrder: jest.fn().mockImplementation(() => {
        return [];
      }),
      cancelDownload: jest.fn(),
      startProcessingIncompleteFileRequests: () => {},
      getStoredQueue: jest.fn().mockImplementation(() => {
        return [];
      }),
    },
  };
});

const socketConnectionInitiatorSpy = jest.spyOn(mockSpies, 'initiator');

describe('Downloads Persist', () => {
  jest.useFakeTimers();
  const CaptureCtx = () => (
    <downloadsContext.Consumer>
      {ctx => {
        persistedsiteContext = ctx;
        return null; // must return something
      }}
    </downloadsContext.Consumer>
  );

  let persistedsiteContext;

  beforeEach(() => {
    jest.useFakeTimers();

    mockDownloadStatus = new ReplaySubject(1);
    mockDownloadStatus.next({
      status: 'started',
      dl_check_page_path: '/somelongaccesshashkey',
      final_file_name: '/someTable_someDateRange.type.zip',
      progress: { pct: 0 },
    });

    // actually mount the provider so the context exists
    render(<DownloadsPersist element={<CaptureCtx />} />);

    jest.clearAllMocks();
  });

  it('initiates a download and subscribes to its progress with the download service', async () => {
    // mock setting the window.location
    const locationMock = jest.fn();
    delete window.location;
    window.location = { assign: locationMock };

    const mockTable = { apiId: '100100' };
    const mockAnotherTable = { apiId: '200200' };
    const mockDataset = {
      datasetId: 'Mock-Up-Dataset',
      apis: [mockTable, mockAnotherTable],
      techSpecs: {
        earliestDate: '01-01-2020',
        latestDate: '11-01-2020',
      },
    };
    const mockDateRange = {
      from: new Date('01/01/2020'),
      to: new Date('11/01/2020'),
    };
    const downloadRequest = {
      apis: mockTable,
      datasetId: mockDataset.datasetId,
      dateRange: mockDateRange,
      selectedFileType: 'csv',
      requestTime: 1234567890,
    };
    const downloadRequestForHash = {
      apis: [downloadRequest.apis.apiId],
      dateRange: downloadRequest.dateRange,
      selectedFileType: downloadRequest.selectedFileType,
      requestTime: downloadRequest.requestTime,
    };

    const updatePercentageSpy = jest.spyOn(progressHelpers, 'updatePercentage');
    const updateProgressSpy = jest.spyOn(progressHelpers, 'updateProgress');

    // should not yet have called updateProgress
    expect(updateProgressSpy).toHaveBeenCalledTimes(0);

    act(() => {
      persistedsiteContext.setDownloadRequest(downloadRequest);
    });
    await act(async () => {});
    act(() => {
      mockDownloadStatus.next({
        status: 'started',
        final_file_name: '/someTable_someDateRange.type.zip',
        dl_check_page_path: '/someTable_someDateRange.type.zip',
        progress: {
          pct: 0,
        },
      });
    });

    // should not have been calling updatePercentage
    expect(updatePercentageSpy).toHaveBeenCalledTimes(0);

    // should attempt to update download preparation progress at one second intervals
    act(() => {
      jest.advanceTimersByTime(3300);
    });

    expect(updatePercentageSpy).toHaveBeenCalledTimes(1);

    act(() => {
      mockDownloadStatus.next({
        status: 'completed',
        final_file_name: '/someTable_someDateRange.type.zip',
      });
      jest.runOnlyPendingTimers();
    });
    // 2nd second
    act(() => jest.advanceTimersByTime(3300));
    expect(updatePercentageSpy).toHaveBeenCalledTimes(2);

    const expectedArgs = [
      'Mock-Up-Dataset',
      { apiId: '100100' },
      mockDateRange,
      'csv',
      downloadRequest.requestTime,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
    expect(socketConnectionInitiatorSpy).toHaveBeenCalledWith(...expectedArgs);
    expect(locationMock).toHaveBeenCalledWith('/someTable_someDateRange.type.zip');

    const expectedDownloadPreparedResult = [
      {
        apis: mockTable,
        datasetId: mockDataset.datasetId,
        dateRange: mockDateRange,
        downloadUrl: '/someTable_someDateRange.type.zip',
        filename: 'someTable_someDateRange.type.zip',
        fullFileUrl: '/someTable_someDateRange.type.zip',
        originalRequestHash: JSON.stringify(downloadRequestForHash),
        prepStarted: true,
        readyForDownload: true,
        status: 'completed',
        progressPct: 100,
        requestTime: 1234567890,
        selectedFileType: 'csv',
        statusPath: '/someTable_someDateRange.type.zip',
        requestId: 'Mock-Up-Dataset::1234567890',
      },
    ];

    expect(persistedsiteContext.downloadsPrepared).toMatchObject(expectedDownloadPreparedResult);
  });

  it('is able to cancel an item', () => {
    jest.clearAllMocks();
    // mock setting the window.location
    const locationMock = jest.fn();
    delete window.location;
    window.location = { assign: locationMock };

    const mockTable = { apiId: '100100' };
    const mockAnotherTable = { apiId: '200200' };
    const mockDataset = {
      datasetId: 'Mock-Up-Dataset',
      apis: [mockTable, mockAnotherTable],
      techSpecs: {
        earliestDate: '01-01-2020',
        latestDate: '11-01-2020',
      },
    };
    const mockDateRange = {
      from: new Date('01/01/2020'),
      to: new Date('11/01/2020'),
    };
    const downloadRequest = {
      apis: mockTable,
      dataset: mockDataset,
      dateRange: mockDateRange,
      selectedFileType: 'csv',
    };
    const downloadRequestForHash = {
      apis: [downloadRequest.apis.apiId],
      dateRange: downloadRequest.dateRange,
      selectedFileType: downloadRequest.selectedFileType,
      datasetId: downloadRequest.dataset.datasetId,
    };

    const expectedDownloadInProgressResult = {
      apis: mockTable,
      dataset: mockDataset,
      dateRange: mockDateRange,
      requestId: 'mockRequestId',
      downloadUrl: '/someTable_someDateRange.type.zip',
      filename: 'someTable_someDateRange.type.zip',
      fullFileUrl: '/someTable_someDateRange.type.zip',
      originalRequestHash: JSON.stringify(downloadRequestForHash),
      prepStarted: true,
      readyForDownload: true,
      requestTime: undefined,
      selectedFileType: 'csv',
      statusPath: '/someTable_someDateRange.type.zip',
    };

    expect(persistedsiteContext.downloadsInProgress).toStrictEqual([]);

    act(() => {
      mockDownloadStatus.next({});
    });

    act(() => {
      persistedsiteContext.setDownloadRequest(downloadRequest);
    });

    act(() => {
      mockDownloadStatus.next({
        status: 'started',
        final_file_name: '/someTable_someDateRange.type.zip',
        dl_check_page_path: '/someTable_someDateRange.type.zip',
        progress: {
          pct: 0,
        },
      });
    });

    expect(persistedsiteContext.downloadsInProgress.length).toBeGreaterThan(0);

    act(() => {
      persistedsiteContext.setCancelDownloadRequest(expectedDownloadInProgressResult);
      jest.runOnlyPendingTimers();
    });
    expect(downloadService.cancelDownload).toHaveBeenCalledWith('mockRequestId');
    expect(persistedsiteContext.downloadQueue).toStrictEqual([]);
    expect(persistedsiteContext.downloadsInProgress).toStrictEqual([]);
  });

  it('removes a prepared download from downloadsPrepared when it is cancelled', async () => {
    jest.clearAllMocks();
    // mock setting the window.location
    const locationMock = jest.fn();
    delete window.location;
    window.location = { assign: locationMock };

    const mockTable = { apiId: '100100' };
    const mockAnotherTable = { apiId: '200200' };
    const datasetId = 'Mock-Up-Dataset';
    const requestTime = 1234567890;
    const requestId = `${datasetId}::${requestTime}`;
    const mockDataset = {
      datasetId: datasetId,
      apis: [mockTable, mockAnotherTable],
      techSpecs: {
        earliestDate: '01-01-2020',
        latestDate: '11-01-2020',
      },
    };
    const mockDateRange = {
      from: new Date('01/01/2020'),
      to: new Date('11/01/2020'),
    };
    const downloadRequest = {
      apis: mockTable,
      datasetId: mockDataset.datasetId,
      dateRange: mockDateRange,
      selectedFileType: 'csv',
      requestTime: requestTime,
    };
    const downloadRequestForHash = {
      apis: [downloadRequest.apis.apiId],
      dateRange: downloadRequest.dateRange,
      selectedFileType: downloadRequest.selectedFileType,
      requestTime: downloadRequest.requestTime,
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(downloadRequest);
    });

    act(() => {
      mockDownloadStatus.next({
        status: 'started',
        final_file_name: '/someTable_someDateRange.type.zip',
        dl_check_page_path: '/someTable_someDateRange.type.zip',
        progress: {
          pct: 0,
        },
      });
    });

    act(() => {
      mockDownloadStatus.next({
        status: 'completed',
        final_file_name: '/someTable_someDateRange.type.zip',
      });
    });

    const expectedArgs = [
      'Mock-Up-Dataset',
      { apiId: '100100' },
      mockDateRange,
      'csv',
      downloadRequest.requestTime,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
    expect(socketConnectionInitiatorSpy).toHaveBeenCalledWith(...expectedArgs);
    expect(locationMock).toHaveBeenCalledWith('/someTable_someDateRange.type.zip');

    const expectedDownloadPreparedResult = [
      {
        apis: mockTable,
        datasetId: mockDataset.datasetId,
        dateRange: mockDateRange,
        downloadUrl: '/someTable_someDateRange.type.zip',
        filename: 'someTable_someDateRange.type.zip',
        fullFileUrl: '/someTable_someDateRange.type.zip',
        originalRequestHash: JSON.stringify(downloadRequestForHash),
        prepStarted: true,
        readyForDownload: true,
        status: 'completed',
        requestTime: requestTime,
        progressPct: 100,
        selectedFileType: 'csv',
        statusPath: '/someTable_someDateRange.type.zip',
        requestId: requestId,
        totalPages: undefined,
      },
    ];
    // should now have an item in downloadsPrepared
    expect(persistedsiteContext.downloadsPrepared).toMatchObject(expectedDownloadPreparedResult);

    act(() => {
      // ask that the item be canceled
      persistedsiteContext.setCancelDownloadRequest(expectedDownloadPreparedResult[0]);
      jest.runAllTimers();
    });

    expect(downloadService.cancelDownload).toHaveBeenCalledWith(expectedDownloadPreparedResult[0].requestId);

    // confirm the item's removal
    expect(persistedsiteContext.downloadsPrepared).toStrictEqual([]);
  });

  it('moves downloads that error into error list', () => {
    jest.clearAllMocks();
    const mockTable = { apiId: '100100' };
    const mockAnotherTable = { apiId: '200200' };
    const datasetId = 'Mock-Up-Dataset';
    const requestTime = 1234567890;
    const requestId = `${datasetId}::${requestTime}`;

    const mockDataset = {
      datasetId: datasetId,
      apis: [mockTable, mockAnotherTable],
      techSpecs: {
        earliestDate: '01-01-2020',
        latestDate: '11-01-2020',
      },
    };
    const mockDateRange = {
      from: new Date('01/01/2020'),
      to: new Date('11/01/2020'),
    };
    const downloadRequest = {
      apis: mockTable,
      datasetId: mockDataset.datasetId,
      dateRange: mockDateRange,
      selectedFileType: 'csv',
      requestTime: requestTime,
    };
    const downloadRequestForHash = {
      apis: [downloadRequest.apis.apiId],
      dateRange: downloadRequest.dateRange,
      selectedFileType: downloadRequest.selectedFileType,
      requestTime: downloadRequest.requestTime,
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(downloadRequest);
    });

    act(() => {
      mockDownloadStatus.next({
        status: 'started',
        final_file_name: '/someTable_someDateRange.type.zip',
        dl_check_page_path: '/someTable_someDateRange.type.zip',
        progress: {
          pct: 0,
        },
      });
    });

    act(() => {
      mockDownloadStatus.error({
        status: 'failed',
        error: { message: 'Internal Server Error' },
      });
    });

    const expectedDownloadFailedResult = [
      {
        apis: mockTable,
        datasetId: mockDataset.datasetId,
        dateRange: JSON.parse(JSON.stringify(mockDateRange)),
        downloadUrl: '/someTable_someDateRange.type.zip',
        filename: 'someTable_someDateRange.type.zip',
        originalRequestHash: JSON.stringify(downloadRequestForHash),
        prepStarted: true,
        status: 'failed',
        error: { message: 'Internal Server Error' },
        progressPct: 0,
        requestTime: requestTime,
        selectedFileType: 'csv',
        statusPath: '/someTable_someDateRange.type.zip',
        requestId: requestId,
      },
    ];

    expect(persistedsiteContext.failedDownloads).toMatchObject(expectedDownloadFailedResult);
  });

  it('can return the largest progressPct from an array of objects with progressPct props', () => {
    const mockObjs = [{ progressPct: 22 }, { progressPct: 0 }, { progressPct: 98 }, { progressPct: 45 }];
    expect(getGreatestProgress(mockObjs)).toStrictEqual(98);
  });
});
