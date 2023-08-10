import localStorageHelper from '../local-storage-helper/local-storage-helper';
import WebsocketService from '../websocket-service/websocket-service';
import { buildDownloadRequestArray } from '../../utils/api-utils-helper';
import { WEB_SOCKET_BASE_URL, DATA_DOWNLOAD_BASE_URL } from 'gatsby-env-variables';
import {
  ReplaySubject,
  from,
  of,
  throwError,
  Subject,
  timer,
  Observable
} from 'rxjs'
import { map, switchMap, filter, takeUntil } from 'rxjs/operators'
import globalConstants from '../constants';

/*
  AC:
    When download is requested:
      - establish connection to initiate file creation
      - store final file and status paths into local storage when started message comes through.
    When download is complete:
      - Update local storage
      - End websocket connection
      - Let status subscribers know it's done.

    Make updates on progress of requested download

    Download process flow:

    initiate a download request with
      - Download File Criteria is generated with utils/api-utils-helpers.js -
      buildDownloadRequestArray
    update status based on incoming messages
    update subscribers to status updates
      - Update local storage with complete status of requested file
    close connection when file generation is complete and file is available to download.
*/

export type StatusMessage = {
  status: 'started' | 'in-progress' | 'processed' | 'complete' | 'failed',
  apiId: number | string,
  status_path?: string,
  file_path?: string,
  totalPages?: number,
  page?: number,
  filesize_kb?: number,
  error?: {
    code: number,
    message: string
  }
}

export type DownloadStatus = {
  datasetId: string,
  requestId?: string,
  requestTime?: number,
  status: 'in-progress' | 'error' | 'complete' | 'completed',
  progress: {
    current: number,
    total: number,
    pct: number,
    apis: {
      [key: string] : {
        total: number,
        processed: number
      }
    }
  },
  dl_check_page_path: string,
  final_file_name: string,
  status_path: string,
  error: null | { message: string, code: number },
  requested: {
    apiIds: string[],
    date_range: { from: string, to: string },
    file_type: string
  }
};

export type ResponseBody = { status: string, [key: string]: unknown };

const websocketUrl = WEB_SOCKET_BASE_URL;
const downloadServiceConfig = globalConstants.config.downloadService;
const pollingInterval_ms = downloadServiceConfig.pollingIntervalInMilliseconds;
const baseSiteUrl = (typeof window !== 'undefined') ?
  `${window.location.protocol}//${window.location.host}`
  : 'https://notarealurl';
const downloadCheckPage = `${globalConstants.DOWNLOAD_CHECK_PAGE_PATH}`;
const apiTotalPagesStartValue = downloadServiceConfig.APITotalPagesStartValue;
const queuedKey = `${downloadServiceConfig.localStorageKeys.queued}`;
const inProgress = `${downloadServiceConfig.localStorageKeys.inProgress}`;
const complete = `${downloadServiceConfig.localStorageKeys.completed}`;
const requestMaxAgeInMilliseconds =
  downloadServiceConfig.requestMaxAgeInMilliseconds;
const requestIdDelimiter = '::';

const currentConnections = {};
const currentStatuses = {};
let downloadStatuses = {};
const resumedDownloads: Array<unknown> = [];

/**
 * When the UI loads, this should be called to check for incomplete download requests.
 * As of 23 June 2021, this is run by the downloadsContext (downloads-persist.jsx).
 */
const startProcessingIncompleteFileRequests =
  (setterFn: (resDownloads: unknown[]) => void): undefined => {
  if (!hasInProgressRequests()) {
    console.info("There are no in-progress download requests to check");
    return;
  }

  console.info("Checking for download request updates");
  beginPollingInProgressFileRequests(setterFn);
};
/**
 * Check if there is anything in the inProgress object in Local Storage
 * @returns {boolean}
 */
const hasInProgressRequests = () => {
  return Object.keys(localStorageHelper.get(inProgress) || {}).length > 0;
}

/**
 * Accepts the token that appears in the status and file download paths
 * of a download request. This token is used by the download check status page
 * and is used to derive the status_path to begin polling for updates.
 * @param requestToken {string}
 */
const startPollingByRequestToken = (requestToken: string): Observable<StatusMessage> => {
  // Use token to generate a path to the status.json, if it isn't there
  // return Observable with error message (request doesn't exist)
  // if does exist, being polling.
  //
  const response$ = new ReplaySubject<StatusMessage>(1);
  const unsubscribe$ = new Subject<void>();
  const statusUrl =
    `${DATA_DOWNLOAD_BASE_URL}/static-data/downloads/zip/${requestToken}/status.json`;

  const unsubscribe = () => {
    unsubscribe$.next();
    unsubscribe$.complete();
  };

  timer(0, pollingInterval_ms)
    .pipe(
      switchMap(() =>
        fetchAsObservable(statusUrl)
          .pipe(
            switchMap(response => {
              if (response.ok) {
                return response.json() as Promise<StatusMessage>;
              } else if (!response.ok) {
                return throwError(() => new Error(response.toString()));
              } else {
                return of({ status: "unknown" });
              }
            })
          )
      ),
      takeUntil(unsubscribe$)
    )
    .subscribe(
      {
        next: (statusObject: StatusMessage) => {
          if (statusObject['status'] && statusObject['status'] === 'started') {
            response$.next({ ...statusObject, status: 'in-progress'});
          } else if (statusObject['status']) {
            response$.next({ ...statusObject });
            unsubscribe();
          } else {
            response$.error({ status: 404, message: "Not Found" });
            unsubscribe();
          }
        },
        error: (error) => {
          console.error("An error occurred while checking the status of a request token.", error);
          response$.error(error);
          unsubscribe();
        },
        complete: () => {
          response$.complete();
        }
      }
    );

  return response$.asObservable();
};

/**
 * Starts polling all requests in the in-progress object
 */
const beginPollingInProgressFileRequests = (setterFn) => {
  const inProgressRequests = localStorageHelper.get(inProgress);
  downloadStatuses = inProgressRequests;
  const inProgressRequestIds = Object.keys(inProgressRequests);

  inProgressRequestIds.forEach((requestId) => {
    if (!currentStatuses[requestId]) {
      currentStatuses[requestId] = new ReplaySubject(1);
    }

    currentStatuses[requestId].next(inProgressRequests[requestId]);
    updateViaPolling(inProgressRequests[requestId], setterFn);
    inProgressRequests[requestId].resumed = true;
    resumedDownloads.push(inProgressRequests[requestId]);
  });
  if (setterFn !== undefined) {
    setterFn(resumedDownloads);
  }
};

const fetchDataset = (datasetMsg) => {
  return fetchAsObservable(
    `${DATA_DOWNLOAD_BASE_URL}${datasetMsg.status_path.charAt(0) === '/' ? '' : '/'}`
    + `${datasetMsg.status_path}`
  );
}

const updateViaPolling = (datasetMsg, setterFn) => {
  const unsubscribe$ = new Subject<void>();

  const unsubscribe = () => {
    unsubscribe$.next();
    unsubscribe$.complete();
  };

  timer(0, pollingInterval_ms)
    .pipe(
      switchMap(() =>
        fetchDataset(datasetMsg)
          .pipe(
            switchMap(response => {
              if (response.ok) {
                return response.json() as Promise<DownloadStatus>;
              } else if (!response.ok) {
                return throwError(() => new Error(response.toString()));
              } else {
                return of({ status: "unknown" });
              }
            })
          )),
      map((msg) => {
        return {
          ...msg,
          datasetId: datasetMsg.datasetId,
          requestId: datasetMsg.requestId,
          requested: datasetMsg.requested
        };
      } ),
      // We're filtering on completed & status path so that subscribe only fires
      // when we see a fully completed message (no progress updates)
      filter((msg) =>
          (msg.status === 'completed' && msg['status_path']) ||
        (msg.status === 'failed')),
      map((msg) => generateDownloadStatusObject(msg)),
      takeUntil(unsubscribe$)
    )
    .subscribe({
      next: (failedOrCompletedMsg) => {
        if (failedOrCompletedMsg.status === 'completed') {
          datasetMsg.status = 'completed';
          datasetMsg.readyForDownload = true;
          processCompletedMessage(failedOrCompletedMsg);
        } else {
          // failed status
          datasetMsg.status = 'failed';
          datasetMsg.readyForDownload = false;
          processFailedMessage(failedOrCompletedMsg);
        }
        if (setterFn !== undefined) {
          setterFn(resumedDownloads.slice());
        }
        unsubscribe();
      },
      error: (error) => {
        console.error("An error occurred while polling for an incomplete request [%s]",
          datasetMsg.datasetId, error);
      },
      complete: function () {
        // do nothing
      }
    });
};

const fetchAsObservable = (url: string): Observable<Response> => {
  return from(fetch(url));
};

/**
 * Initiate download request.
 * @param datasetId {string} - Used to key each incoming request to the requesting dataset
 * @param apis {string|string[]} - api id of requested table. Initially one table at a time, but
 * future enhancement is coming. (12Mar2021)
 * @param dateRange {{ from: string, to: string }}
 * @param fileTypes {string} - 'csv' not sure about others (12Mar2021)
 * @param requestTime {number} - epoch millis timestamp when user originally requested download
 * @param userFilter {null|{label: string, field: string, notice: string}} - userFilter
 * @param tableColumnSortData
 */
const initiateDownload = (datasetId: string, apis: string | string[],
                          dateRange: { from: string, to: string },
                          fileTypes: string, requestTime: number,
                          userFilter?: {label: string, value: string},
                          tableColumnSortData?: []): string => {

  const downloadRequestMessage = buildDownloadRequestArray(apis, dateRange, fileTypes, userFilter, tableColumnSortData);
  const newRequestId = `${datasetId}${requestIdDelimiter}${requestTime}`;
  connect(datasetId, apis, dateRange, fileTypes, newRequestId);
  sendInitialRequestMessage(newRequestId, downloadRequestMessage);
  return newRequestId;
};

/**
 * Get status updates for requested dataset id.
 * @returns {Observable<any>}
 * @param requestId
 */
const downloadStatus = (requestId: string):Observable<DownloadStatus> => {
  return currentStatuses[requestId] ? currentStatuses[requestId].asObservable() : of(null);
}

/**
 * Lists all dataset ids that are in progress.
 * @returns {string[]}
 */
const datasetIdsInProgress = (): string[] => {
  return [
    ...new Set(Object.keys(currentStatuses)
      .map((rqId) => rqId.split(requestIdDelimiter)[0]))
  ];
}

/**
 * Check if a specific dataset is in progress.
 * @param datasetId
 * @returns {boolean}
 */
const isDatasetInProgress = (datasetId: string): boolean => {
  return (
    !!Object.keys(currentStatuses)
      .some((rqId) => rqId.split(requestIdDelimiter)[0] === datasetId)
  );
};

/**
 * Observable that returns true if dataset is in progress and false if is it is not.
 * @returns {Observable<boolean>}
 * @param requestId
 */
const datasetInProgress = (requestId: string): Observable<boolean> => {
  if (!currentStatuses[requestId]) return of (false);
  return downloadStatus(requestId)
    .pipe(
      map((statusUpdate) => (statusUpdate.status !== 'completed'))
    );
}

/**
 * Observable that returns true if dataset has passed the "started" phase of the download and
 * false if it has not.
 * @returns {Observable<boolean>}
 * @param requestId
 */
const getDatasetStatus = (requestId: string): Observable<string | boolean> => {
  if (!currentStatuses[requestId]) return of (false);
  return downloadStatus(requestId)
    .pipe(
      map((statusUpdate) => statusUpdate.status)
    )
};

/**
 * Provides array of simple api ids if it can, otherwise, it passes through
 * what is passed in.
 * @param apis
 * @returns {*}
 */
const getApiIds = (apis) => {
  if (!Array.isArray(apis)) {
    if (apis.hasOwnProperty('apiId')) {
      return [apis.apiId];
    }
    return apis;
  }

  if (apis[0].apiId) {
    return apis.map(api => api.apiId);
  } else {
    return apis;
  }
};

/**
 * Connect to websocket
 * @param datasetId {string} - Used to keep track of websocket per dataset
 * @param apis {[]}
 * @param dateRange {{to: string, from: string}}
 * @param fileTypes {string}
 * @param requestId
 */
const connect = (datasetId, apis, dateRange, fileTypes, requestId) => {
  const curWS = WebsocketService.connectWebsocket(websocketUrl);
  currentConnections[requestId] = curWS.socket;
  currentStatuses[requestId] = new ReplaySubject(1);
  currentConnections[requestId].pipe(
    map((msg: ResponseBody) => ({
      ...msg,
      datasetId,
      requestId,
      requested: {
        apiIds: getApiIds(apis),
        dateRange,
        fileTypes
      }
    }))
  )
    .subscribe(
      (msg) => processIncomingMessage(msg),
      (err) => handleWebsocketError(requestId, err),
      () => handleWebsocketComplete(requestId, fileTypes, apis, dateRange)
    );
}

/**
 * Cancel tracking for datasetId requested and
 * @param requestId
 */
const cancelDownload = (requestId: string):void => {

  if (currentConnections[requestId]) {
    // disconnect websocket connection
    currentConnections[requestId].complete();
    delete currentConnections[requestId];
  }

  if (currentStatuses[requestId]) {
    currentStatuses[requestId].complete();
    delete currentStatuses[requestId];
  }
  removeFromStoredQueue(requestId);
  removeFromInProgress(requestId);
  removeFromCompleted(requestId);
};

/**
 * Sends initial download request object to opened websocket connection.
 * @param requestId
 * @param downloadRequestObject {Object}
 */
const sendInitialRequestMessage = (requestId, downloadRequestObject) => {
  currentConnections[requestId].next(downloadRequestObject);
}

/**
 * Process all incoming messages from the websocket connection and update what needs to be updated.
 * @param msg
 */
const processIncomingMessage = (msg) => {
  switch (msg.status) {
    case 'started':
      // NOTE: Might have an 'error' property (Object). Will want to decide how to handle that.
      if (msg['status_path']) {
        processStartedMessage(msg);
      } else {
        processApiMessage(msg);
      }
      break;
    case 'Received':
      break; // ignore receipt confirmation
    case 'processed':
      // api progress messages should be 'processed'. Leaving 'complete' for
      // compatibility with previous message version - 01 July 2021.
    // eslint-disable-next-line no-fallthrough
    case 'complete':
      processApiMessage(msg);
      break;
    case 'completed':
      if (msg['status_path']) {
        processCompletedMessage(msg);
      } else if (msg['totalPages']) { // Will be an API Progress message.
        processApiMessage(msg);
      } else {
        console.warn('Received "completed" status but no status_path.')
      }
      break;
    case 'failed':
      if (msg['status_path']) {
        processFailedMessage(msg);
      } else {
        processApiMessage(msg);
      }
      break;
    default:
      console.warn("Unexpected Status Value from download [%s]",
        msg['status'] ? msg.status : undefined);
  }
}
/**
 * Processes the first message back from the connection after the initial request.
 * @param startedMsg {{
 * datasetId: string, requestId: string, status: string, status_path: string, file_path: string
 * }}
 */
const processStartedMessage = (startedMsg) => {
  const inProgressStatuses = localStorageHelper.get(inProgress) || {};
  const newDownloadStatusObject = generateDownloadStatusObject(startedMsg);
  const updatedInProgressStatuses = {
    ...inProgressStatuses,
    [startedMsg.requestId]: newDownloadStatusObject
  };
  downloadStatuses = updatedInProgressStatuses;
  localStorageHelper.set(inProgress, updatedInProgressStatuses);
  updateDownloadProgress(startedMsg.requestId, newDownloadStatusObject);
}

/**
 * Persists a newly queuedDownload request to local storage
 * @param download {Object}
 */
const storeQueuedDownload = (download: DownloadStatus): void => {
  download.requestId = `${download.datasetId}${requestIdDelimiter}${download.requestTime}`;
  const queuedStatuses = localStorageHelper.get(queuedKey) || {};
  const updatedQueuedStatuses = { ...queuedStatuses, [download.requestId]: download };
  localStorageHelper.set(queuedKey, updatedQueuedStatuses);
};

const getStoredQueue = (): unknown => Object.values(localStorageHelper.get(queuedKey) || {});

const processApiMessage = (rawWSMessage) => {
  const update = updateDownloadStatusProgress(
    downloadStatuses[rawWSMessage.requestId], rawWSMessage
  );
  updateDownloadProgress(update.requestId, update);
}

const updateDownloadStatusProgress = (downloadStatusObj, rawWSMessage) => {
  const progress = downloadStatusObj.progress;
  const apis = downloadStatusObj.progress.apis || {};
  const api = apis[rawWSMessage.apiId] || { total: 0, processed: 0, error: null };

  delete downloadStatusObj.startedTable;
  delete downloadStatusObj.completedTable;

  if (rawWSMessage.status === 'started') {
    api.total = rawWSMessage['totalPages'];
    api.processed = 0;
    progress.total = progress.total + rawWSMessage['totalPages'] - apiTotalPagesStartValue;
    downloadStatusObj.startedTable = true;
  } else if (rawWSMessage.status.indexOf('complete') === 0) {
    api.processed = api.total;
    downloadStatusObj.completedTable = true;
  } else if (rawWSMessage.status === 'error' || rawWSMessage.status === 'failed') {
    api.error = rawWSMessage.error;
    processApiFailedMessage(rawWSMessage);
  } else {
    api.processed++;
    progress.current++;
  }

  progress.pct = (progress.current / progress.total);

  apis[rawWSMessage.apiId] = api;
  progress.apis = apis;

  return { ...downloadStatusObj, progress };
}

const updateDownloadStatusObjectStatus = (downloadStatusObj, rawWSMessage) => {
  const status = rawWSMessage.status;
  let output = { ...downloadStatusObj, status: status };
  if (rawWSMessage.error) {
    output = { ...output, error: rawWSMessage.error };
  }
  return output;
}
const fileFromPath = (path) => (path + '').substring(path.lastIndexOf('/') + 1);

const generateDownloadStatusObject = (rawWSMessage) => {
  const len = rawWSMessage.requested.apiIds.length || 1;
  const checkPath = createDLCheckPagePath(rawWSMessage.status_path);
  return {
    datasetId: `${rawWSMessage.datasetId}`,
    requestId: `${rawWSMessage.requestId}`,
    status: `${rawWSMessage.status}`,
    progress: {
      current: 0,
      total: apiTotalPagesStartValue * len,
      pct: 0,
      apis: {}
    },
    dl_check_page_path: checkPath,
    final_file_name: `${rawWSMessage.file_path}`,
    status_path: `${rawWSMessage.status_path}`,
    filename: fileFromPath(`${rawWSMessage.file_path}`),
    downloadUrl: `${rawWSMessage.file_path}`,
    statusPath: checkPath,
    dateRange: rawWSMessage.requested.dateRange,
    selectedFileType: rawWSMessage.requested.fileTypes,
    prepStarted: true,
    requestTime: rawWSMessage.requested.requestTime,
    requested: rawWSMessage.requested // entire requested object
  };

}

const createDLCheckPagePath = (statusPath) => {
  const requestHash = statusPath.split('/')[4];
  return `${baseSiteUrl}${downloadCheckPage}/${requestHash}`;
}

/**
 * Processes messages that are completed. This function assumes that completeMsg
 * represents a completed file message.
 * @param rawWSMessage
 */
const processCompletedMessage = (rawWSMessage) => {
  const completedStatuses = localStorageHelper.get(complete) || {};
  const updatedStatusObj = updateDownloadStatusObjectStatus(
    downloadStatuses[rawWSMessage.requestId], rawWSMessage);

  removeFromInProgress(rawWSMessage.requestId);

  if (!completedStatuses[rawWSMessage.datasetId]) {
    completedStatuses[rawWSMessage.datasetId] = [];
  }
  completedStatuses[rawWSMessage.datasetId].push(updatedStatusObj);
  localStorageHelper.set(complete, completedStatuses);

  if (currentConnections[rawWSMessage.requestId]) {
    currentConnections[rawWSMessage.requestId].complete();
  }

  updateDownloadProgress(updatedStatusObj.requestId, updatedStatusObj);
}

/**
 * Remove entry by requestId from root level of object stored locally by storageKey
 * @param storageKey
 * @param requestId
 */
const removeFromLocallyStoredObjectByKey = (storageKey, requestId) => {
  const storedObject = localStorageHelper.get(storageKey) || {};
  if (storedObject[requestId]) {
    delete storedObject[requestId];
    localStorageHelper.set(storageKey, storedObject);
  }
};

/**
 * Remove requestId from in progress local storage.
 * @param requestId
 */
const removeFromInProgress = (requestId) => {
  removeFromLocallyStoredObjectByKey(inProgress, requestId);
};

/**
 * Remove datasetId from in progress local storage.
 * @param requestId
 */
const removeFromStoredQueue = (requestId: string): void => {
  removeFromLocallyStoredObjectByKey(queuedKey, requestId);
};

/**
 * Remove datasetId from "completed" local storage.
 * @param requestId
 */
export const removeFromCompleted = (requestId: string): void => {
  const completedStatuses = localStorageHelper.get(complete) || {};
  const updatedCompletedStatuses = {};
  // iterate through current stored statuses and rebuild without cancellations
  Object.entries(completedStatuses).forEach(([datasetId, downloads]) => {
    const filteredDownloads = (downloads as DownloadStatus[])
      .filter(dnl => dnl.requestId !== requestId);
    if (filteredDownloads.length) {
      updatedCompletedStatuses[datasetId] = filteredDownloads;
    }
  });
  localStorageHelper.set(complete, updatedCompletedStatuses);
};

const processApiFailedMessage = (failedMsg) => {
  /*
  error?: {
      code: {number},
      message: {string}
    }
   */
  currentStatuses[failedMsg.requestId].error(failedMsg);
  console.error('An error occurred while requesting table data', failedMsg.error);
  currentConnections[failedMsg.requestId].complete();
}

const processFailedMessage = (failedMsg) => {
  /*
  error?: {
      code: {number},
      message: {string}
    }
   */
  currentStatuses[failedMsg.requestId].error(failedMsg);
  // disconnect websocket
  currentConnections[failedMsg.requestId].complete();
  console.error('An error occurred while creating the zip file', failedMsg.error);
}

const updateDownloadProgress = (requestId, message) => {
  if (!currentStatuses[requestId]) return;
  currentStatuses[requestId].next(message);
}

const handleWebsocketError = (requestId, error) => {
  console.error('Websocket Error: ', error);
}

const handleWebsocketComplete = (requestId, fileType, apis, dateRange) => {
  delete currentConnections[requestId];
  if (currentStatuses[requestId]) {
    currentStatuses[requestId].complete();
    // GA4 Datalayer push
    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);
    if (apis && fileType && dateRange.from) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'event': 'raw-data-download',
        'eventLabel': 'Table Name: ' + apis.tableName + ', Type: ' + fileType + ', Date Range: ' +
          from.toLocaleDateString("en-US") + ' - ' + to.toLocaleDateString("en-US")
      });
    }
  }
  delete currentStatuses[requestId];
}

/**
 * Purge old download requests (in-progress or completed) that are older than
 * the max age. This scrubs all download requests that would no longer have a
 * valid download link due to generated files existing for ~24 hours.
 */
const purgeOldRequests = (): void => {
  // determine 24 hours ago in milliseconds
  const maxAgeTimestamp = new Date().getTime() - requestMaxAgeInMilliseconds;

  // start with in-progress.
  purgeInProgress(maxAgeTimestamp);

  // clear out completed.
  purgeComplete(maxAgeTimestamp);
};
const getRequestIDsToPurge = (source, maxAgeTimestamp) => {
  return source.filter((requestID) => {
    const ts = Number(requestID.split(requestIdDelimiter)[1]);
    return (ts <= maxAgeTimestamp);
  });
};
const purgeInProgress = (maxAgeTimestamp) => {
  const inProgressRequests = localStorageHelper.get(inProgress);

  // if there's nothing in-progress, bailout.
  if (!inProgressRequests) return;

  const inProgressRequestIDs = Object.keys(inProgressRequests);

  // collect requestIds that have a timestamp token older than the max
  const requestIDsToPurge =
    getRequestIDsToPurge(inProgressRequestIDs, maxAgeTimestamp);

  requestIDsToPurge.forEach((requestId) => {
    delete inProgressRequests[requestId];
  });
  localStorageHelper.set(inProgress, inProgressRequests);
};
const purgeComplete = (maxAgeTimestamp) => {

  const completedRequests = localStorageHelper.get(complete);

  // if there's nothing completed, bailout.
  if (!completedRequests) return;

  Object.keys(completedRequests).forEach((datasetId) => {
    let datasetCompleted = completedRequests[datasetId];
    // filter returns only requests that aren't too old yet.
    datasetCompleted = datasetCompleted
      .filter((completedRequest) => {
        const ts =
          Number(completedRequest.requestId.split(requestIdDelimiter)[1]);
        return (ts > maxAgeTimestamp);
      });
    if (datasetCompleted.length === 0) {
      delete completedRequests[datasetId];
    } else {
      completedRequests[datasetId] = datasetCompleted;
    }
  });
  localStorageHelper.set(complete, completedRequests);

};

const downloadService = {
  startProcessingIncompleteFileRequests,
  purgeOldRequests,
  initiateDownload,
  downloadStatus,
  datasetIdsInProgress,
  isDatasetInProgress,
  getDatasetStatus,
  datasetInProgress,
  startPollingByRequestToken,
  cancelDownload,
  storeQueuedDownload,
  getStoredQueue,
  removeFromStoredQueue
}

// run this as early as possible. (when download-service.js gets initiated)
purgeOldRequests();

export const exportsForUnitTests = {
  baseSiteUrl
}

export default downloadService;
