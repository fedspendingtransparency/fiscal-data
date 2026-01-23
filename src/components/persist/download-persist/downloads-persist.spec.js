import { act, render } from '@testing-library/react';
import React from 'react';
import { getGreatestProgress } from './downloads-persist';
import { ReplaySubject } from 'rxjs';
import * as progressHelpers from './download-progress-helper';
import DownloadsPersist, { downloadsContext } from './downloads-persist';

let mockDownloadStatusSubject;
let mockSubjectMap = {};

const mockSpies = {
  initiator: jest.fn().mockImplementation((datasetId, apis, dateRange, fileTypes, requestTime) => `${datasetId}::${requestTime}`),
  getStoredQueue: jest.fn().mockReturnValue([]),
  startProcessingIncomplete: jest.fn(),
  removeFromStoredQueue: jest.fn(),
  cancelDownload: jest.fn(),
};

jest.mock('../../../helpers/download-service/download-service', function() {
  return {
    __esModule: true,
    default: {
      initiateDownload: jest.fn().mockImplementation((...args) => {
        return mockSpies.initiator(...args);
      }),
      downloadStatus: jest.fn().mockImplementation(requestId => {
        return mockSubjectMap[requestId] || mockDownloadStatusSubject;
      }),
      datasetsInOrder: jest.fn().mockReturnValue([]),
      cancelDownload: jest.fn().mockImplementation((...args) => mockSpies.cancelDownload(...args)),
      startProcessingIncompleteFileRequests: jest.fn().mockImplementation(cb => mockSpies.startProcessingIncomplete(cb)),
      getStoredQueue: jest.fn().mockImplementation(() => mockSpies.getStoredQueue()),
      storeQueuedDownload: jest.fn(),
      removeFromStoredQueue: jest.fn().mockImplementation((...args) => mockSpies.removeFromStoredQueue(...args)),
    },
  };
});

const socketConnectionInitiatorSpy = jest.spyOn(mockSpies, 'initiator');

// describe('Downloads Persist', () => {
//   let persistedsiteContext;
//
//   const CaptureCtx = () => (
//     <downloadsContext.Consumer>
//       {ctx => {
//         persistedsiteContext = ctx;
//         return null; // must return something
//       }}
//     </downloadsContext.Consumer>
//   );
//
//   beforeEach(() => {
//     jest.useFakeTimers();
//     mockSubjectMap = {};
//     mockDownloadStatusSubject = new ReplaySubject(1);
//     mockDownloadStatusSubject.next({
//       status: 'started',
//       dl_check_page_path: '/somelongaccesshashkey',
//       final_file_name: '/someTable_someDateRange.type.zip',
//       progress: { pct: 0 },
//     });
//
//     jest.clearAllMocks();
//   });
//
//   afterEach(() => {
//     jest.clearAllTimers();
//   });

  // it('initiates a download and subscribes to its progress with the download service', async () => {
  //   // mock setting the window.location
  //   const locationMock = jest.fn();
  //   delete window.location;
  //   window.location = { assign: locationMock };
  //
  //   render(<DownloadsPersist element={<CaptureCtx />} />);
  //
  //   const downloadRequest = {
  //     apis: { apiId: '100100' },
  //     datasetId: 'Mock-Up-Dataset',
  //     dateRange: { from: new Date('01/01/2020'), to: new Date('11/01/2020') },
  //     selectedFileType: 'csv',
  //     requestTime: 1234567890,
  //   };
  //
  //   const updatePercentageSpy = jest.spyOn(progressHelpers, 'updatePercentage');
  //
  //   act(() => {
  //     persistedsiteContext.setDownloadRequest(downloadRequest);
  //   });
  //   // should attempt to update download preparation progress at one second intervals
  //   act(() => {
  //     jest.advanceTimersByTime(3300);
  //   });
  //
  //   expect(updatePercentageSpy).toHaveBeenCalled();
  //
  //   act(() => {
  //     mockDownloadStatusSubject.next({
  //       status: 'completed',
  //       final_file_name: '/someTable_someDateRange.type.zip',
  //     });
  //     jest.runOnlyPendingTimers();
  //   });
  //
  //   expect(persistedsiteContext.downloadsPrepared[0].status).toBe('completed');
  //   expect(locationMock).toHaveBeenCalledWith('/someTable_someDateRange.type.zip');
  // });

  it('is able to cancel an item', () => {
    render(<DownloadsPersist element={<CaptureCtx />} />);

    const downloadRequest = {
      apis: { apiId: '100100' },
      datasetId: 'Mock-Up-Dataset',
      dateRange: { from: new Date('01/01/2020'), to: new Date('11/01/2020') },
      selectedFileType: 'csv',
      requestTime: 1234567890,
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(downloadRequest);
    });

    expect(persistedsiteContext.downloadsInProgress.length).toBe(1);

    act(() => {
      const itemToCancel = persistedsiteContext.downloadsInProgress[0];
      persistedsiteContext.setCancelDownloadRequest(itemToCancel);
    });

    expect(mockSpies.cancelDownload).toHaveBeenCalled();
    expect(persistedsiteContext.downloadsInProgress.length).toBe(0);
  });

  it('removes a prepared download from downloadsPrepared when it is cancelled', () => {
    const locationMock = jest.fn();
    delete window.location;
    window.location = { assign: locationMock };

    render(<DownloadsPersist element={<CaptureCtx />} />);

    const downloadRequest = {
      apis: { apiId: '100100' },
      datasetId: 'Mock-Up-Dataset',
      dateRange: { from: new Date('01/01/2020'), to: new Date('11/01/2020') },
      selectedFileType: 'csv',
      requestTime: 1234567890,
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(downloadRequest);
    });

    act(() => {
      mockDownloadStatusSubject.next({
        status: 'completed',
        final_file_name: '/someTable_someDateRange.type.zip',
      });
    });

    expect(persistedsiteContext.downloadsPrepared.length).toBe(1);

    act(() => {
      persistedsiteContext.setCancelDownloadRequest(persistedsiteContext.downloadsPrepared[0]);
    });

    expect(persistedsiteContext.downloadsPrepared.length).toBe(0);
  });

  it('moves downloads that error into error list', () => {
    render(<DownloadsPersist element={<CaptureCtx />} />);

    const downloadRequest = {
      apis: { apiId: '100100' },
      datasetId: 'Mock-Up-Dataset',
      dateRange: { from: new Date('01/01/2020'), to: new Date('11/01/2020') },
      selectedFileType: 'csv',
      requestTime: 1234567890,
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(downloadRequest);
    });

    act(() => {
      mockDownloadStatusSubject.error({
        status: 'failed',
        error: { message: 'Internal Server Error' },
      });
    });

    expect(persistedsiteContext.failedDownloads.length).toBe(1);
    expect(persistedsiteContext.failedDownloads[0].error.message).toBe('Internal Server Error');
  });

  it('can return the largest progressPct from an array of objects', () => {
    const mockObjs = [{ progressPct: 22 }, { progressPct: 0 }, { progressPct: 98 }, { progressPct: 45 }];
    expect(getGreatestProgress(mockObjs)).toStrictEqual(98);
    expect(getGreatestProgress(undefined)).toStrictEqual(0);
  });

  it('queues a download if one is already in progress for the same dataset, then processes queue when first finishes', () => {
    render(<DownloadsPersist element={<CaptureCtx />} />);
    const datasetId = 'Same-Dataset';

    const req1 = {
      apis: { apiId: '1' },
      datasetId: datasetId,
      dateRange: { from: new Date(), to: new Date() },
      selectedFileType: 'csv',
      requestTime: 100,
      filename: 'file1',
    };

    const req2 = {
      ...req1,
      apis: { apiId: '2' },
      requestTime: 200,
      filename: 'file2',
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(req1);
    });

    expect(persistedsiteContext.downloadsInProgress[0].requestTime).toBe(100);

    act(() => {
      persistedsiteContext.setDownloadRequest(req2);
    });

    expect(persistedsiteContext.downloadQueue.length).toBe(1);
    expect(persistedsiteContext.downloadQueue[0].requestTime).toBe(200);
    expect(persistedsiteContext.downloadsInProgress.length).toBe(1);

    act(() => {
      mockDownloadStatusSubject.next({
        status: 'completed',
        final_file_name: 'file1.zip',
      });
    });

    expect(persistedsiteContext.downloadQueue.length).toBe(0);
  });

  it('handles detailed status updates (tablesStarted, tablesCompleted, pagesProcessed)', () => {
    render(<DownloadsPersist element={<CaptureCtx />} />);

    const req = {
      apis: { apiId: '1' },
      datasetId: 'Detail-Test',
      dateRange: { from: new Date(), to: new Date() },
      selectedFileType: 'csv',
      requestTime: 100,
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(req);
    });

    act(() => {
      mockDownloadStatusSubject.next({
        status: 'started',
        final_file_name: 'pending',
        dl_check_page_path: 'path',
        progress: { total: 100, current: 0 },
        startedTable: true,
      });
    });
    expect(persistedsiteContext.downloadsInProgress[0].tablesStarted).toBe(1);

    act(() => {
      mockDownloadStatusSubject.next({
        status: 'started',
        final_file_name: 'pending',
        dl_check_page_path: 'path',
        progress: { total: 100, current: 0 },
        completedTable: true,
      });
    });
    expect(persistedsiteContext.downloadsInProgress[0].tablesCompleted).toBe(1);

    act(() => {
      mockDownloadStatusSubject.next({
        status: 'started',
        final_file_name: 'pending',
        dl_check_page_path: 'path',
        progress: { total: 100, current: 10 },
      });
    });
    expect(persistedsiteContext.downloadsInProgress[0].pagesProcessed).toBe(1);

    act(() => {
      mockDownloadStatusSubject.next({
        status: 'started',
        final_file_name: 'pending',
        dl_check_page_path: 'path',
        progress: { total: 100, current: 20 },
      });
    });
    expect(persistedsiteContext.downloadsInProgress[0].pagesProcessed).toBe(2);
  });

  it('handles removing from queue by dataset correctly', () => {
    render(<DownloadsPersist element={<CaptureCtx />} />);
    const datasetId = 'dataset-X';

    const req1 = {
      apis: { apiId: '1' },
      datasetId: datasetId,
      dateRange: { from: new Date(), to: new Date() },
      selectedFileType: 'csv',
      requestTime: 100,
    };

    act(() => {
      persistedsiteContext.setDownloadRequest(req1);
    });

    const req2 = { ...req1, requestTime: 200 };
    act(() => {
      persistedsiteContext.setDownloadRequest(req2);
    });

    expect(persistedsiteContext.downloadQueue.length).toBe(1);
    const itemInQueue = persistedsiteContext.downloadQueue[0];

    act(() => {
      persistedsiteContext.setCancelDownloadRequest(itemInQueue);
    });

    expect(persistedsiteContext.downloadQueue.length).toBe(0);
  });
});
