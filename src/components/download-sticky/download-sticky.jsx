import React, { useContext, useEffect, useState } from 'react';
import StickyFooter from '../sticky-footer/sticky-footer';
import DownloadPercentageStatus from '../download-percentage-status/download-percentage-status';
import {
  collapsed,
  collapseToggle,
  completed,
  completeStyle,
  downloadContent,
  downloadLink,
  downloadNotice,
  downloadNoticeContainer,
  downloadStatus,
  downloadStatusContainer,
  expandedSection,
  filename,
  mainRow,
  minimizedStyle,
  noticeButton,
  noticeButtonContainer,
  noticeText,
  progress,
  progressIndicatorContainer,
  queueRow,
  resumedSpinner,
  rightSegment,
  status,
  statusHeading,
  toggleIcon,
  toggleTab,
} from './download-sticky.module.scss';
import { downloadsContext } from '../persist/download-persist/downloads-persist';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown';
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons/faAngleDoubleUp';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import buttons from '../buttons/buttons';
import globalConstants from '../../helpers/constants';
import { generateAnalyticsEvent } from '../../layouts/dataset-detail/helper';
import { useRecoilValue } from 'recoil';
import { dataTableDapGaEventLabelState } from '../../recoil/dataTableDapGaEventLabelState';

const gaEventLabels = globalConstants.gaEventLabels;
export const dsTextContent = {
  prepSingle: "We're preparing your download.",
  prepMulti: "We're preparing your downloads.",
  finishedSingle: 'Your file is ready for download.',
  finishedMulti: 'Your files are ready for download.',
  hideLabel: 'Hide Download Details',
  showLabel: 'Show Download Details',
  finishedNote: 'If your file does not start downloading automatically, please ',
  finishedNoteLinkLabel: 'click here',
  finishedNoteEnding: '.',
  finishedMultipleNote: 'If your files do not start downloading automatically, please click the links below:',
  planToLeaveSingle: 'If you plan to leave this site, don’t forget to copy the download link for your file.',
  planToLeaveMulti: 'If you plan to leave this site, don’t forget to copy the download links for your files.',
  copyLinkLabel: 'Copy Link',
  downloadFileButtonLabel: 'Download File',
  doneStatus: 'Done',
  queuedStatus: 'Queued',
  gaHideDetails: gaEventLabels.stickyHideDetails,
  gaMaximizeSticky: gaEventLabels.stickyMaximize,
  gaMinimizeSticky: gaEventLabels.stickyMinimize,
  gaShowDetails: gaEventLabels.stickyShowDetails,
};

const DownloadSticky = () => {
  const closingTimeout = globalConstants.config.stickyFooter.defaultClosingTimeoutInMS;

  const {
    downloadModalIsOpen,
    downloadQueue,
    downloadsPrepared,
    downloadsInProgress,
    activeDownloadProgress,
    ignoreDownloadModalClose,
    resumeDownloadModalIsOpen,
    resumedDownloads,
    resumedDownloadInitTimeout,
    displayForTestCase,
    setCancelDownloadRequest,
  } = useContext(downloadsContext);

  const [closing, setClosing] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(
    ((downloadsInProgress && downloadsInProgress.length > 0) ||
      (downloadQueue && downloadQueue.length > 0) ||
      (resumeDownloadModalIsOpen !== undefined && resumedDownloads && resumedDownloads.length > 0)) &&
      resumedDownloadInitTimeout !== undefined
  );
  const [multipleDownloads, setMultipleDownloads] = useState(downloadQueue && downloadQueue.length > 0);
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [allDownloadsCompleted, setAllDownloadsCompleted] = useState(
    downloadsInProgress &&
      downloadsInProgress.length === 0 &&
      downloadQueue &&
      downloadQueue.length === 0 &&
      downloadsPrepared &&
      downloadsPrepared.length > 0 &&
      resumedDownloads &&
      resumedDownloads.length === 0
  );
  const [allInProgress, setAllInProgress] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const [resumedPrepared, setResumedPrepared] = useState([]);
  const [resumedInProgress, setResumedInProgress] = useState([]);
  const [triggerCleanupAfterClose, setTriggerCleanupAfterClose] = useState(0);
  const [allPrepared, setAllPrepared] = useState([]);
  const dapGaEventLabel = useRecoilValue(dataTableDapGaEventLabelState);

  const fileFromPath = download => {
    let path;
    if (download.filename) path = download.filename;
    else if (download.file_path) path = download.file_path;
    return (path + '').substring(path.lastIndexOf('/') + 1);
  };

  useEffect(() => {
    let downloadCount = downloadQueue ? downloadQueue.length : 0;
    downloadCount += downloadsInProgress ? downloadsInProgress.length : 0;
    downloadCount += downloadsPrepared ? downloadsPrepared.length : 0;
    downloadCount += resumedDownloads ? resumedDownloads.length : 0;
    setMultipleDownloads(downloadCount > 1);

    const allComplete =
      downloadsInProgress &&
      downloadsInProgress.length === 0 &&
      downloadQueue &&
      downloadQueue.length === 0 &&
      downloadsPrepared &&
      downloadsPrepared.length > 0 &&
      resumedDownloads &&
      resumedDownloads.filter(dnl => dnl.status === 'started').length === 0;
    setAllDownloadsCompleted(allComplete);
    if (downloadsInProgress && downloadsInProgress.length > 0) {
      setAllInProgress(downloadsInProgress);
      setInProgress(true);
    } else if (resumedDownloads && resumedDownloads.length > 0) {
      setAllInProgress(resumedDownloads);
      setInProgress(true);
    } else {
      setAllInProgress([]);
      setInProgress(false);
    }

    // putting arrays into a set and then back to an array
    // to remove duplicate entries.
    setAllPrepared([...new Set([...downloadsPrepared.slice(), ...resumedPrepared.filter(dnl => dnl.status === 'completed')])]);

    if (
      (downloadsInProgress && downloadsInProgress.length) ||
      (resumeDownloadModalIsOpen !== undefined && resumedDownloads && resumedDownloads.length) ||
      (downloadQueue && downloadQueue.length) ||
      displayForTestCase
    ) {
      // delay setting sticky to visible to give the modal time to be open.
      // without this delay, the sticky flashes just before the modal is opened.
      setTimeout(() => {
        setNotificationVisible(true);
      }, 200);
      setClosing(false);
    } else if (downloadsPrepared?.length > 0 || resumedPrepared.filter(dnl => dnl.status === 'completed')?.length > 0) {
      setNotificationVisible(true);
      setClosing(true);
    } else {
      // if we're here, then there isn't anything to have the sticky be visible
      // for and we don't want to wait for the delayed closing.
      if (downloadsPrepared && downloadsPrepared.length === 0 && notificationVisible) {
        setNotificationVisible(false);
      }
      setClosing(true);
    }
  }, [
    downloadQueue,
    downloadsPrepared,
    downloadsInProgress,
    downloadModalIsOpen,
    resumedDownloads,
    resumedPrepared,
    resumeDownloadModalIsOpen,
    ignoreDownloadModalClose,
  ]);

  useEffect(() => {
    if (resumedDownloads) {
      setResumedPrepared(resumedDownloads.filter(dnl => dnl.status === 'completed'));
      setResumedInProgress(resumedDownloads.filter(dnl => dnl.status === 'started'));
    }
  }, [resumedDownloads]);

  const renderProgress = (showProgress, showWorking, complete, mini, pctg) => {
    if (showProgress && !complete) {
      return <DownloadPercentageStatus sticky percentage={pctg} minimized={mini} />;
    } else if (showWorking && !complete) {
      return (
        <div className={[`${completeStyle}`, `${resumedSpinner}`, minimized ? `${minimizedStyle}` : ''].join(' ')}>
          <FontAwesomeIcon data-testid="spinner-icon" icon={faSpinner} spin pulse />
        </div>
      );
    } else if (complete) {
      return <FontAwesomeIcon className={[`${completeStyle}`, minimized ? `${minimizedStyle}` : ''].join(' ')} icon={faCheckCircle} />;
    }
  };

  const displayText = complete => {
    if (complete && multipleDownloads) {
      return <span>{dsTextContent.finishedMulti}</span>;
    } else if (complete && !multipleDownloads) {
      return <span>{dsTextContent.finishedSingle}</span>;
    } else if (!complete && multipleDownloads) {
      return <span>{dsTextContent.prepMulti}</span>;
    } else {
      return <span>{dsTextContent.prepSingle}</span>;
    }
  };

  const toggleDetailsEvent = () => {
    const gaEventAction = expanded ? dsTextContent.gaHideDetails : dsTextContent.gaShowDetails;

    generateAnalyticsEvent(dapGaEventLabel, gaEventAction + ' Click');
    setExpanded(!expanded);
  };

  const toggleMinimizeEvent = () => {
    const gaEventAction = minimized ? dsTextContent.gaMaximizeSticky : dsTextContent.gaMinimizeSticky;

    generateAnalyticsEvent(dapGaEventLabel, gaEventAction + ' Click');
    setMinimized(!minimized);
  };

  const renderExpandDetailsButton = () => {
    return (
      <button
        className={[`${collapseToggle}`, expanded ? 'hideDownloadDetails' : 'showDownloadDetails'].join(' ')}
        onClick={toggleDetailsEvent}
        data-testid="collapse-toggle"
      >
        {expanded ? (
          <span>
            {dsTextContent.hideLabel} <FontAwesomeIcon icon={faMinus} size="sm" className={toggleIcon} />
          </span>
        ) : (
          <span>
            {dsTextContent.showLabel} <FontAwesomeIcon icon={faPlus} size="sm" className={toggleIcon} />
          </span>
        )}
      </button>
    );
  };

  const renderDownloadLink = download => {
    return (
      <>
        <a href={download.fullFileUrl} className={downloadLink}>
          {dsTextContent.finishedNoteLinkLabel}
        </a>
        {dsTextContent.finishedNoteEnding}
      </>
    );
  };

  // once the onClose trigger is set, keep triggering it until each completed file is removed
  useEffect(() => {
    if (triggerCleanupAfterClose > 0) {
      if (allPrepared && allPrepared.length) {
        setCancelDownloadRequest(allPrepared.shift());
        setTriggerCleanupAfterClose(triggerCleanupAfterClose + 1);
      } else {
        setTriggerCleanupAfterClose(0);
      }
    }
  }, [triggerCleanupAfterClose]);

  let percentage = Math.round(activeDownloadProgress);

  if (percentage > 99) percentage = 99;
  // nothing to see here, move along
  if (!notificationVisible || downloadModalIsOpen || resumeDownloadModalIsOpen || resumedDownloadInitTimeout) return null;
  return (
    <StickyFooter hideAfterTime={closing ? closingTimeout : null} onClosed={closing ? () => setTriggerCleanupAfterClose(1) : false}>
      <button
        className={toggleTab}
        onClick={toggleMinimizeEvent}
        data-testid={'minimize-toggle'}
        aria-label="Toggle minimized state for download notification."
      >
        {minimized ? (
          <FontAwesomeIcon className="maximizeDownloadNotification" icon={faAngleDoubleUp} data-testid={'maximize-symbol'} />
        ) : (
          <FontAwesomeIcon className="minimizeDownloadNotification" icon={faAngleDoubleDown} data-testid={'minimize-symbol'} />
        )}
      </button>
      <div className={[`${downloadContent}`, minimized ? `${minimizedStyle}` : ''].join(' ')} data-testid="download-sticky-content">
        <div className={mainRow}>
          <div className={downloadStatusContainer}>
            <div className={[`${progressIndicatorContainer}`, allDownloadsCompleted ? `${completed}` : ''].join(' ')}>
              {renderProgress(
                downloadsInProgress && downloadsInProgress.length > 0,
                resumedInProgress && resumedInProgress.length > 0,
                allDownloadsCompleted,
                minimized,
                percentage
              )}
            </div>
            <div className={downloadStatus}>
              <h5 className={[statusHeading, minimized ? `${minimizedStyle}` : ''].join(' ')}>{displayText(!inProgress)}</h5>
              {!minimized && !allDownloadsCompleted && (
                <>
                  {multipleDownloads ? (
                    renderExpandDetailsButton()
                  ) : (
                    <>
                      {inProgress && allInProgress[0] ? (
                        <div className={filename}>{allInProgress[0].filename}</div>
                      ) : (
                        <>
                          {allPrepared && allPrepared[0] && (
                            <div>
                              <span data-testid={'finished-downloading-notice-single'}>{dsTextContent.finishedNote}</span>
                              {renderDownloadLink(allPrepared[0])}
                            </div>
                          )}
                          {resumedDownloads && resumedDownloads[0] && (
                            <div>
                              <span data-testid={'finished-downloading-notice-single'}>{dsTextContent.finishedNote}</span>
                              {renderDownloadLink(resumedDownloads[0])}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
              {!minimized && allDownloadsCompleted && (
                <>
                  {allPrepared &&
                    allPrepared.length > 0 &&
                    (allPrepared.length === 1 ? (
                      <div className={completed}>
                        <div data-testid={'finished-downloading-notice-single'}>
                          {dsTextContent.finishedNote}
                          {renderDownloadLink(allPrepared[0])}
                        </div>
                      </div>
                    ) : (
                      <div className={completed}>
                        <div data-testid={'finished-downloading-notice-multiple'}>{dsTextContent.finishedMultipleNote}</div>
                        <ul>
                          {allPrepared.map((download, index) => (
                            <li key={index}>
                              <a href={download.fullFileUrl} className={downloadLink}>
                                {download.filename}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
          {!minimized && !allDownloadsCompleted && (
            <>
              {inProgress && (
                <div className={downloadNoticeContainer}>
                  {allInProgress.some(ip => ip.statusPath && ip.statusPath.length) && (
                    <div className={downloadNotice}>
                      <div className={noticeText}>{multipleDownloads ? dsTextContent.planToLeaveMulti : dsTextContent.planToLeaveSingle}</div>
                      {!multipleDownloads && (
                        <div className={`${noticeButtonContainer} copyLinkButton`}>
                          {buttons.copyToClipboardButton(allInProgress[0].statusPath, dapGaEventLabel, dsTextContent.copyLinkLabel)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        {!minimized && !allDownloadsCompleted && (
          <>
            {multipleDownloads && (
              <div className={`${expandedSection} ${expanded ? '' : collapsed}`} data-testid="downloads-list">
                {allPrepared.map((download, index) => (
                  <div className={queueRow} key={index}>
                    <div className={progress}>
                      {dsTextContent.doneStatus}
                      <> </>
                      <FontAwesomeIcon icon={faCheckCircle} size="sm" />
                    </div>
                    <div className={rightSegment}>
                      <div className={filename}>{fileFromPath(download)}</div>
                      <a href={download.fullFileUrl} className={noticeButton} rel={globalConstants.EXTERNAL_LINK_REL}>
                        {dsTextContent.downloadFileButtonLabel}
                      </a>
                    </div>
                  </div>
                ))}
                {resumedInProgress &&
                  resumedInProgress.map((resumedDownload, index) => (
                    <div className={queueRow} key={index}>
                      <div className={progress}>
                        <FontAwesomeIcon data-testid="spinner-icon" icon={faSpinner} spin pulse />
                      </div>
                      <div className={rightSegment}>
                        <div className={filename}>{resumedDownload.filename}</div>
                        {resumedDownload.statusPath && (
                          <div className={`${noticeButtonContainer} copyLinkButton`}>
                            {buttons.copyToClipboardButton(resumedDownload.statusPath, dapGaEventLabel, dsTextContent.copyLinkLabel)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                {downloadsInProgress.map((downloadInProgress, index) => (
                  <div className={queueRow} key={index}>
                    <div className={progress}>{downloadInProgress.progressPct > 99 ? 99 : downloadInProgress.progressPct}%</div>
                    <div className={rightSegment}>
                      <div className={filename}>{downloadInProgress.filename}</div>
                      {downloadInProgress.statusPath && (
                        <div className={`${noticeButtonContainer} copyLinkButton`}>
                          {buttons.copyToClipboardButton(downloadInProgress.statusPath, dapGaEventLabel, dsTextContent.copyLinkLabel)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {downloadQueue.map((download, index) => (
                  <div className={queueRow} key={index}>
                    <div className={status}>{dsTextContent.queuedStatus}</div>
                    <div className={rightSegment}>
                      <div className={filename}>{download.filename}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </StickyFooter>
  );
};

export default DownloadSticky;
