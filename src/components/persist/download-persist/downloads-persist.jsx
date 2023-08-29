import React, { useEffect, useState, useRef } from 'react';
import { DATA_DOWNLOAD_BASE_URL } from 'gatsby-env-variables';
import downloadService from '../../../helpers/download-service/download-service';
import { updatePercentage, updateProgress } from './download-progress-helper';

export const getGreatestProgress = (downloads) => {
  let greatest = 0;
  if (downloads) {
    downloads.forEach(dnl => {
      if (dnl.progressPct > greatest) {
        greatest = dnl.progressPct;
      }
    });
  }
  return greatest;
};

export const downloadsContext = React.createContext({
  downloadCount: 0,
  setDownloadCount: () => {},
  downloadQueue: [],
  setDownloadQueue: () => {},
  downloadQueueByDataset: [],
  setDownloadQueueByDataset: () => {},
  downloadsPrepared: [],
  setDownloadsPrepared: () => {},
  downloadStatusSubscription: null,
  setDownloadStatusSubscription: () => {},
  downloadModalIsOpen: null,
  setDownloadModalIsOpen: () => {},
  resumeDownloadModalIsOpen: null,
  setResumeDownloadModalIsOpen: () => {},
  downloadReadyLocation: null,
  setDownloadReadyLocation: () => {},
  preparingDownload: false,
  setPreparingDownload: () => {},
  downloadFilePath: null,
  setDownloadFilePath: () => {},
  datasetsInProgress: null,
  setDatasetsInProgress: () => {},
  datasetsInProgressByDataset: null,
  setDatasetsInProgressByDataset: () => {},
  downloadStatusPath: null,
  setDownloadStatusPath: () => {},
  activeDownloadProgress: null,
  setActiveDownloadProgress: () => {},
  ignoreDownloadModalClose: false,
  setIgnoreDownloadModalClose: () => {},
  resumedDownloads: null,
  setResumedDownloads: () => {},
  resumedQueue: null,
  setResumedQueue: () => {},
  failedDownloads: null,
  setFailedDownloads: () => {},
  failedDownload: null,
  setFailedDownload: () => {},
  displayForTestCase: false,
  resumedDownloadInitTimeout: null,
  resumedModalHasBeenOpen: null,
  setResumedModalHasBeenOpen: () => {}
});

export const DownloadsProvider = ({ children }) => {
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [downloadQueueByDataset] = useState({});
  const [downloadsPrepared, setDownloadsPrepared] = useState([]);
  const [downloadModalIsOpen, setDownloadModalIsOpen] = useState(false);
  const [preparingDownload, setPreparingDownload] = useState(false);
  const [downloadFilePath, setDownloadFilePath] = useState(null);
  const [datasetsInProgress, setDatasetsInProgress] = useState(null);
  const [downloadStatusPath, setDownloadStatusPath] = useState(null);
  const [downloadsInProgressByDataset] = useState({});
  const [downloadsInProgress, setDownloadsInProgress] = useState([]);
  const [downloadRequest, setDownloadRequest] = useState(null);
  const [cancelDownloadRequest, setCancelDownloadRequest] = useState(null);
  const [refreshDownloadsInProgress, setRefreshDownloadsInProgress] = useState(0);
  const [activeDownloadProgress, setActiveDownloadProgress] = useState(0);
  const [ignoreDownloadModalClose, setIgnoreDownloadModalClose] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [resumedQueue, setResumedQueue] = useState(null);
  const [failedDownloads, setFailedDownloads] = useState([]);
  const [failedDownload, setFailedDownload] = useState(null);
  const [resumedDownloads, setResumedDownloads] = useState([]);
  const [resumedDownloadInitTimeout, setResumedDownloadInitTimeout] = useState();
  const [refreshDownloadPercentages, setRefreshDownloadPercentages] = useState();
  // explicit 'undefined' value to help distinguish initial load
  const [resumeDownloadModalIsOpen, setResumeDownloadModalIsOpen] = useState(undefined);
  const [completedDownload, setCompletedDownload] = useState(null);
  const [resumedModalHasBeenOpen, setResumedModalHasBeenOpen] =  useState(false);
  const [progressInterval, setProgressInterval] = useState(null);
  const displayForTestCase = false;

  const fileFromPath = (path) => (path + '').substring(path.lastIndexOf('/') + 1);

  const getDownloadSubscription = (download) => {

    const requestId = downloadService.initiateDownload(
      downloadRequest.datasetId,
      downloadRequest.apis,
      downloadRequest.dateRange,
      downloadRequest.selectedFileType,
      downloadRequest.requestTime,
      downloadRequest.selectedUserFilter,
      downloadRequest.tableColumnSortData,
    );

    return downloadService.downloadStatus(requestId)
      .subscribe({
        next: statusObj => {

        if (statusObj.status === 'started') {
          download.filename = fileFromPath(statusObj.final_file_name);
          download.downloadUrl = statusObj.final_file_name;
          download.statusPath = statusObj.dl_check_page_path;
          download.requestId = requestId;
          // data transmitted from download service sometimes gets reset,
          // so keep and calculate percentage progress values here
          if (download.totalPages === undefined || download.totalPages > statusObj.progress.total) {
            download.totalPages = statusObj.progress.total;
          }
          if (statusObj.startedTable) {
            download.tablesStarted = download.tablesStarted === undefined
              ? 1
              : download.tablesStarted + 1;
          } else if (statusObj.completedTable) {
            download.tablesCompleted = download.tablesCompleted === undefined
              ? 1
              : download.tablesCompleted + 1;
          } else if (download.pagesProcessed === undefined && statusObj.progress.current > 0) {
            download.pagesProcessed = 1;
          } else if (download.pagesProcessed !== undefined) {
            download.pagesProcessed += 1;
          }
          // use newly created date obj to ensure an actual value change.
          updateProgress(download, setRefreshDownloadsInProgress);

        } else if (statusObj.status === 'completed' && statusObj.final_file_name) {
            const fileUrl = DATA_DOWNLOAD_BASE_URL
              ? `${DATA_DOWNLOAD_BASE_URL}${statusObj.final_file_name}`
              : statusObj.final_file_name;
            startDownloadIfResumedModalIsNotOpen(fileUrl);

            download.readyForDownload = true;
            download.status = 'completed';
            download.fullFileUrl = fileUrl;
            download.progressPct = 100;
            setCompletedDownload(download);
            setActiveDownloadProgress(100);
          }
        },
        error: (error) => {
          console.error("%s preparing failed.", download.filename, error);
          download.status = error.status;
          download.error = error.error;
          setFailedDownload(download);
        },
        complete: () => {}
      });
    };

  const startDownloadIfResumedModalIsNotOpen = (fileUrl) => {
    if (!resumeDownloadModalIsOpen && !resumedDownloadInitTimeout) {
      window.location.assign(fileUrl);
    }
  };

  const generateDownloadObjectHash = (downloadRequest) => {
    let apis;
    const drApis = (downloadRequest['apis'] ? downloadRequest['apis'] : null) ||
      downloadRequest.requested.apiIds;
    if (Array.isArray(drApis)) {
      apis = drApis.map(api => api.apiId);
    } else {
      apis = [drApis['apiId'] ? drApis['apiId'] : downloadRequest.requested['apis']];
    }
    const datasetId = (downloadRequest?.dataset?.datasetId)
      || (downloadRequest?.requested?.datasetId);

    const newObj = {
      apis: apis,
      dateRange: downloadRequest.dateRange,
      selectedFileType: downloadRequest.selectedFileType,
      datasetId: datasetId,
      requestTime: downloadRequest.requestTime,
      selectedUserFilter: downloadRequest.selectedUserFilter,
      tableColumnSortData: downloadRequest.tableColumnSortData
    };
    return JSON.stringify(newObj);
  };

  useEffect(() => {
    if (downloadRequest) {
      downloadRequest.originalRequestHash = generateDownloadObjectHash(downloadRequest);
      if (!downloadsInProgressByDataset[downloadRequest.datasetId]) {

        const download = {
          datasetId: downloadRequest.datasetId,
          apis: downloadRequest.apis,
          dateRange: {
            from: new Date(downloadRequest.dateRange.from.getTime()),
            to: new Date(downloadRequest.dateRange.to.getTime())
          },
          selectedFileType: downloadRequest.selectedFileType,
          filename: downloadRequest.filename,
          requestTime: downloadRequest.requestTime,
          originalRequestHash: downloadRequest.originalRequestHash,
          selectedUserFilter: downloadRequest.selectedUserFilter,
          tableColumnSortData: downloadRequest.tableColumnSortData,
        };
        downloadsInProgressByDataset[downloadRequest.datasetId] = download;
        setDownloadsInProgress(Object.values(downloadsInProgressByDataset)
          .sort((a, b) => a.requestTime - b.requestTime));
        download.downloadStatusSubscription = getDownloadSubscription(download);
        download.progressPct = 0;
        download.prepStarted = true;
      } else {
        downloadService.storeQueuedDownload(downloadRequest);
        if (!downloadQueueByDataset[downloadRequest.datasetId]) {
          downloadQueueByDataset[downloadRequest.datasetId] = [];
        }
        downloadQueueByDataset[downloadRequest.datasetId].push(downloadRequest);
        setDownloadQueue([...downloadQueue.slice(), downloadRequest]);
      }
      setIgnoreDownloadModalClose(false);
      setDownloadRequest(null);
    }
  }, [downloadRequest]);

  /**
   * This is being done to avoid async issues
   */
  useEffect(() => {
    if (completedDownload) {
      setDownloadsPrepared([...downloadsPrepared, completedDownload]);
      setCompletedDownload(null);
    }
  }, [completedDownload]);

  useEffect(() => {
    if (!failedDownload) return;
    setCancelDownloadRequest(failedDownload);

    const failedDL = JSON.parse(JSON.stringify(failedDownload));
    delete failedDL.downloadStatusSubscription;
    let faileds = failedDownloads?.slice() || [];
    faileds = [...faileds, failedDL];

    setFailedDownloads(faileds);
    setFailedDownload(null);
  }, [failedDownload]);

  const calculateDownloadCount = (dlQueue, dlInProgress) => {
    setDownloadCount(dlQueue.length + dlInProgress.length);
  };

  useEffect(() => {
    downloadsInProgress.forEach(dnl => {
      updatePercentage(dnl, setRefreshDownloadsInProgress);
    });
  }, [refreshDownloadPercentages]);

  const updateActiveDownloadPercentage = (updatedPercentage) => {
    if (updatedPercentage < 100 && updatedPercentage > activeDownloadProgress) {
      setActiveDownloadProgress(updatedPercentage);
    }
  };

  useEffect(() => {
    calculateDownloadCount(downloadQueue, downloadsInProgress);
    if (downloadsInProgress && downloadsInProgress.length) {
      if (!progressInterval) {
        setProgressInterval(setInterval(() => {
          setRefreshDownloadPercentages(new Date());
        }, 1000));
      }
    } else if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
      setActiveDownloadProgress(0);
    }
  }, [downloadQueue, downloadsInProgress]);

  const removeFromDownloadQueue = (targetHash) => {
    const queueIndex = downloadQueue.map((d) => d.originalRequestHash)
      .indexOf(targetHash);

    if (queueIndex === -1) return;
    downloadQueue.splice(queueIndex, 1);
  };

  const removeFromDownloadQueueByDataset = (datasetId, targetHash) => {
    if (!downloadQueueByDataset[datasetId]) return;
    const qByDIndex =
      downloadQueueByDataset[datasetId]
        .map(d => d.originalRequestHash)
        .indexOf(targetHash);
    if (qByDIndex === -1) return;
    downloadQueueByDataset[datasetId]
      .splice(qByDIndex, 1);
    if (downloadQueueByDataset[datasetId].length === 0) {
      delete downloadQueueByDataset[datasetId];
    }
  };

  const removeFromDownloadsInProgress = (datasetId, targetHash) => {
    if (!downloadsInProgressByDataset[datasetId]) return;

    if (downloadsInProgressByDataset[datasetId].originalRequestHash === targetHash) {
      downloadsInProgressByDataset[datasetId].downloadStatusSubscription.unsubscribe();
      downloadsInProgressByDataset[datasetId] = null;
      delete downloadsInProgressByDataset[datasetId];
    }
    setDownloadsInProgress(
      Object.values(downloadsInProgressByDataset)
        .sort((a, b) => a.requestTime - b.requestTime)
    );
  };

  const removeFromResumedDownloads = (download) => {
    if (download && download.requestId && resumedDownloads && resumedDownloads.length) {
      setResumedDownloads(
        resumedDownloads.filter(resDnl => resDnl.requestId !== download.requestId)
      );
    }
  };

  const removeFromDownloadsPrepared = (download) => {
    if (download && download.requestId && downloadsPrepared && downloadsPrepared.length) {
      setDownloadsPrepared(
        downloadsPrepared.filter(prepDnl => prepDnl.requestId !== download.requestId)
      );
    }
  };

  useEffect(() => {
    if (cancelDownloadRequest === undefined || cancelDownloadRequest === null) return;

    // handle cases where the download Object was reconstituted from local storage
    if (!cancelDownloadRequest.apis && cancelDownloadRequest.requested.apiIds) {
      cancelDownloadRequest.apis = cancelDownloadRequest.requested.apiIds;
      cancelDownloadRequest.dataset = { datasetId: cancelDownloadRequest.datasetId};
    }
    const cancelRequest = generateDownloadObjectHash(cancelDownloadRequest);
    const cancelDatasetId = cancelDownloadRequest.datasetId;

    downloadService.cancelDownload(cancelDownloadRequest.requestId);

    removeFromDownloadQueue(cancelRequest);
    removeFromDownloadQueueByDataset(
      cancelDatasetId,
      cancelRequest);
    removeFromDownloadsInProgress(cancelDatasetId, cancelRequest);
    removeFromResumedDownloads(cancelDownloadRequest);
    removeFromDownloadsPrepared(cancelDownloadRequest);

    startNextDownload(cancelDatasetId);

  }, [cancelDownloadRequest]);

  useEffect(() => {
    downloadsInProgress.forEach(dnl => {
      updateActiveDownloadPercentage(dnl.progressPct);
    });
    setDownloadsInProgress(downloadsInProgress.slice());
  }, [refreshDownloadsInProgress]);

  const startNextDownload = (datasetId) => {
    if (downloadQueueByDataset[datasetId]) {
      if (downloadQueueByDataset[datasetId].length) {
        // we want to delay checking whether to pull up the sticky
        // until we know there are no more queued downloads
        setIgnoreDownloadModalClose(true);
        const stagedReq = downloadQueueByDataset[datasetId].shift();
        setDownloadRequest(stagedReq);
      }
      if (!downloadQueueByDataset[datasetId].length) {
        delete downloadQueueByDataset[datasetId];
      }
      setDownloadQueue(
        Object.values(downloadQueueByDataset).flat().sort((a, b) => a.requestTime - b.requestTime)
      );
    }
  };

  useEffect(() => {
    if (downloadsPrepared && downloadsPrepared.length) {

      downloadsPrepared
        .filter(prep => prep.downloadStatusSubscription !== undefined)
        .forEach(prep => {
          prep.downloadStatusSubscription.unsubscribe();
          delete prep.downloadStatusSubscription;
          delete downloadsInProgressByDataset[prep.datasetId];
          setDownloadsInProgress(Object.values(downloadsInProgressByDataset));
          startNextDownload(prep.datasetId);
        });
      if (Object.values(downloadsInProgressByDataset).length) {
        setActiveDownloadProgress(getGreatestProgress(Object.values(downloadsInProgressByDataset)));
      }

    }
  }, [downloadsPrepared]);

  const downloadsInProgressRef = useRef(0);
  downloadsInProgressRef.current = downloadsInProgress.length;

  useEffect(() => {
    if (resumeDownloadModalIsOpen === undefined && !resumedModalHasBeenOpen &&
      ((resumedDownloads && resumedDownloads.length) || resumedQueue !== null)) {
      // give it time to make one status check before displaying the modal,
      // in case something in-progress from last session is now ready
      setResumedModalHasBeenOpen(true);
      setResumedDownloadInitTimeout(setTimeout(() => {
        setResumeDownloadModalIsOpen(true);
        setResumedDownloadInitTimeout(undefined);
        }, 3000));
    }
    return(() => { clearTimeout(resumedDownloadInitTimeout); });
  }, [resumedDownloads]);

  // saves a snapshot of the stored Queue into the resumedQueue state var at load time
  const reconstituteQueueFromLocalStorage = () => {
    setResumedQueue(downloadService.getStoredQueue().sort((a, b) => a.requestTime - b.requestTime));
  };

  // process each item from the resumedQueue snapshot
  useEffect(() => {
    if (resumedQueue && resumedQueue.length) {
      const localResumedQueue = resumedQueue.slice();
      const resumedRequest = localResumedQueue.shift();

      // ensure we have date objects, not simple strings
      resumedRequest.dateRange.from = new Date(resumedRequest.dateRange.from);
      resumedRequest.dateRange.to = new Date(resumedRequest.dateRange.to);

      setDownloadRequest(resumedRequest);
      downloadService.removeFromStoredQueue(resumedRequest.requestId);

      // re-triggers this useEffect block until all the resumedQueue items are processed
      setResumedQueue(localResumedQueue);
    }
  }, [resumedQueue]);

  useEffect(() => {
    if (resumedDownloads && resumedDownloads.length
      && resumeDownloadModalIsOpen === undefined
      && resumedDownloadInitTimeout === undefined) {
      // give it time to make one status check before displaying the modal,
      // in case something in-progress from last session is now ready
      setResumedDownloadInitTimeout(setTimeout(() => {
        setResumeDownloadModalIsOpen(true);
      }, 3000));

    } else if (resumedDownloads && resumedDownloads.length) {
      const completed = resumedDownloads.filter(rd => rd.status === 'completed');

      if (completed.length === 0) return;
      completed.forEach((c) => {
        const fileUrl = DATA_DOWNLOAD_BASE_URL
          ? `${DATA_DOWNLOAD_BASE_URL}${c.final_file_name}`
          : c.final_file_name;
        const prepped = downloadsPrepared.slice();
        c.readyForDownload = true;
        c.fullFileUrl = fileUrl;
        prepped.push(c);
        setDownloadsPrepared(prepped);
      });
      setResumedDownloads(resumedDownloads.filter(rd => rd.status !== 'completed'));
    }
    return(() => { clearTimeout(resumedDownloadInitTimeout); });
  }, [resumedDownloads]);

  useEffect(() => {
    // should only occur at site load once
    if (resumeDownloadModalIsOpen === undefined && resumedDownloadInitTimeout === undefined) {
      downloadService.startProcessingIncompleteFileRequests(setResumedDownloads);
      reconstituteQueueFromLocalStorage();
    }
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    }
  }, []);

  return (
    <downloadsContext.Provider
      value={{
        downloadCount,
        downloadQueue,
        setDownloadQueue,
        downloadsPrepared,
        setDownloadsPrepared,
        downloadModalIsOpen,
        setDownloadModalIsOpen,
        resumeDownloadModalIsOpen,
        setResumeDownloadModalIsOpen,
        preparingDownload,
        setPreparingDownload,
        downloadFilePath,
        setDownloadFilePath,
        downloadStatusPath,
        setDownloadStatusPath,
        datasetsInProgress,
        setDatasetsInProgress,
        downloadsInProgress,
        activeDownloadProgress,
        setDownloadRequest,
        setCancelDownloadRequest,
        ignoreDownloadModalClose,
        setIgnoreDownloadModalClose,
        resumedDownloads,
        setResumedDownloads,
        displayForTestCase,
        resumedQueue,
        failedDownloads,
        resumedDownloadInitTimeout
      }}
    >
      {children}
    </downloadsContext.Provider>
  )
};

const DownloadsPersist = ({ element }) => {
  return (
    <DownloadsProvider>
      {element}
    </DownloadsProvider>
  )
};

export default DownloadsPersist;
