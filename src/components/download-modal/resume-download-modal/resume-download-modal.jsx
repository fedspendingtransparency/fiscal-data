import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../modal/modal';
import { container, title, downloadItemsContainer, closeButton, subText } from '../download-modal.module.scss';
import {
  preparedSingleContainer,
  resumeHeaderMain,
  resumeSubtitle,
  buttonSet,
  cancelButton,
  buttonRow,
  downloadButton,
  withItems,
} from './resume-download-modal.module.scss';
import { cancelDownloadButton } from '../download-modal-item/download-modal-item.module.scss';
import DownloadModalItem from '../download-modal-item/download-modal-item';
import { downloadsContext } from '../../persist/download-persist/downloads-persist';
import buttons from '../../buttons/buttons';

export const resumeDownloadTitle = 'We are still working to prepare your download.';
export const resumeDownloadTitleMulti = 'We are still working to prepare your downloads.';
export const resumeDownloadSubtitle = 'A download started before you left the site. Now that you’re back, it will continue.';
export const resumeDownloadSubtitleMulti = 'These files started downloading before you left the site. Now that you’re back, they will continue.';
export const resumeCompletedDownloadTitle = 'The file that was preparing for download is now ready.';
export const resumeCompletedDownloadSubtitle = 'Do you want to continue downloading it now?';
export const downloadModalSubText = 'Your download progress status will show on the bottom of your screen after you close this box.';

const ResumeDownloadModal = () => {
  const [resumedPrepared, setResumedPrepared] = useState([]);
  const [resumedInProgress, setResumedInProgress] = useState([]);
  const [resumedDownloadsCount, setResumedDownloadsCount] = useState();

  const {
    resumeDownloadModalIsOpen,
    setResumeDownloadModalIsOpen,
    resumedDownloads,
    downloadsPrepared,
    downloadsInProgress,
    downloadQueue,
    setCancelDownloadRequest,
  } = useContext(downloadsContext);

  useEffect(() => {
    let allPrepared = [];
    if (resumedDownloads) {
      allPrepared = resumedDownloads.filter(dnl => dnl.status === 'completed');
    }

    if (downloadsPrepared && downloadsPrepared.length) {
      allPrepared = [...allPrepared, ...downloadsPrepared];
    }
    let allInProgress = [];
    if (resumedDownloads) {
      allInProgress = resumedDownloads.filter(dnl => dnl.status === 'started');
    }
    if (downloadsInProgress && downloadsInProgress.length) {
      allInProgress.push(...downloadsInProgress);
    }
    const queueCount = downloadQueue ? downloadQueue.length : 0;
    setResumedDownloadsCount(allPrepared.length + allInProgress.length + queueCount);
    setResumedPrepared(allPrepared);
    setResumedInProgress(allInProgress);
  }, [resumedDownloads, downloadsPrepared, downloadsInProgress, downloadQueue]);

  const cancelAndClose = download => {
    setCancelDownloadRequest(download);
    setResumeDownloadModalIsOpen(false);
  };

  const onClose = () => {
    setResumeDownloadModalIsOpen(false);
  };

  return (
    <>
      {resumedDownloadsCount > 0 && !!resumeDownloadModalIsOpen && (
        <>
          <Modal open={true} onClose={() => setResumeDownloadModalIsOpen(false)} contentClass={container}>
            {resumedDownloadsCount === 1 ? (
              <>
                {resumedPrepared.length === 1 ? (
                  <div className={preparedSingleContainer}>
                    <div className={resumeHeaderMain} data-testid="download-modal-title">
                      {resumeCompletedDownloadTitle}
                    </div>
                    <div className={resumeSubtitle}>{resumeCompletedDownloadSubtitle}</div>
                    <div className={buttonSet}>
                      <div className={`${cancelDownloadButton} ${cancelButton} ${buttonRow}`} data-testid="direct-cancel-button">
                        {buttons.cancelButton(resumedPrepared[0], cancelAndClose)}
                      </div>
                      <div className={buttonRow}>
                        <a
                          href={resumedPrepared[0].fullFileUrl}
                          data-testid="direct-download-button"
                          className={downloadButton}
                          onClick={() => setResumeDownloadModalIsOpen(false)}
                        >
                          Download File
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {resumedInProgress.length === 1 && (
                      <>
                        <div className={title} data-testid="download-modal-title">
                          {resumeDownloadTitle}
                        </div>
                        <div className={`${resumeSubtitle} ${withItems}`}>{resumeDownloadSubtitle}</div>
                        <div className={downloadItemsContainer} data-testid="download-items-container">
                          <DownloadModalItem download={resumedInProgress[0]} cancelDownloadRequest={setCancelDownloadRequest} resumed />
                        </div>
                        <button onClick={onClose} className={closeButton} data-testid="download-modal-close-button" aria-label="Close">
                          Close
                        </button>
                        <div className={subText} data-testid="download-modal-subtext">
                          {downloadModalSubText}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <div className={title} data-testid="download-modal-title">
                  {resumeDownloadTitleMulti}
                </div>
                <div className={`${resumeSubtitle} ${withItems}`}>{resumeDownloadSubtitleMulti}</div>
                <div className={downloadItemsContainer} data-testid="download-items-container">
                  {resumedPrepared.map((download, index) => (
                    <DownloadModalItem key={index} download={download} cancelDownloadRequest={setCancelDownloadRequest} resumed />
                  ))}
                  {resumedInProgress.map((download, index) => (
                    <DownloadModalItem key={index} download={download} cancelDownloadRequest={setCancelDownloadRequest} resumed />
                  ))}
                  {downloadQueue &&
                    downloadQueue.map((download, index) => (
                      <DownloadModalItem key={index} download={download} cancelDownloadRequest={setCancelDownloadRequest} resumed />
                    ))}
                </div>
                <button onClick={onClose} className={closeButton} data-testid="download-modal-close-button" aria-label="Close">
                  Close
                </button>
                <div className={subText} data-testid="download-modal-subtext">
                  {downloadModalSubText}
                </div>
              </>
            )}
          </Modal>
        </>
      )}
    </>
  );
};

export default ResumeDownloadModal;
