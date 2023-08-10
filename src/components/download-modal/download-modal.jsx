import React, { useContext, useEffect, useState } from 'react';
import Modal from '../modal/modal';
import DownloadModalItem from './download-modal-item/download-modal-item';
import * as styles from './download-modal.module.scss';
import { downloadsContext } from '../persist/download-persist/downloads-persist';

export const downloadModalTitle = 'We are working to prepare your download.';
export const downloadModalTitleMulti = 'We are working to prepare your downloads.';
export const downloadModalSubText = 'Your download progress status will show on the bottom of your screen after you close this box.';

/**
 *
 * @param open {Boolean}
 * @param onClose {Function}
 * @param downloadsInProgress {Array} - download currently being prepared
 * @param downloadsQueued {Array} - downloads that are queued for download next
 * @param activeDownloadProgress {Number} - percentage progress of the current download
 * @param setCancelDownloadRequest {Function} - method to call to cancel a download/queued download
 */

const DownloadModal = ({ open,
                         onClose, setCancelDownloadRequest }) => {

  const siteDownloads = useContext(downloadsContext);
  const {
    setDownloadModalIsOpen,
    downloadModalIsOpen,
    downloadsInProgress,
    downloadQueue,
    resumedDownloads
  } = siteDownloads;

  const [resumedPrepared, setResumedPrepared] = useState([]);
  const [resumedInProgress, setResumedInProgress] = useState([]);
  const [downloadCount, setDownloadCount] = useState([]);

  useEffect(() => {
    setDownloadModalIsOpen(!!open && downloadCount > 0);
  }, [open, downloadCount]);

  useEffect(() => {
    let count = downloadsInProgress ? downloadsInProgress.length : 0;
    count += (downloadQueue ? downloadQueue.length : 0);
    setDownloadCount(count);
  }, [downloadsInProgress, downloadQueue])

  useEffect(() => {
    if (resumedDownloads) {
      setResumedPrepared(resumedDownloads.filter((dnl) => dnl.status === 'completed'));
      setResumedInProgress(resumedDownloads.filter((dnl) => dnl.status === 'started'));
    }
  }, [resumedDownloads]);

  return (
    <Modal
      open={downloadModalIsOpen}
      onClose={onClose}
      contentClass={styles.container}
    >
      <div className={styles.title} data-testid="download-modal-title">{downloadCount >  1 ? downloadModalTitleMulti : downloadModalTitle}</div>
      <div className={styles.downloadItemsContainer} data-testid="download-items-container">
        {resumedPrepared && resumedPrepared.map((download, index) => (
          <DownloadModalItem key={index}
                             download={download}
                             cancelDownloadRequest={setCancelDownloadRequest}
                             resumed
          />
        ))}
        {downloadsInProgress && downloadsInProgress.map((download, index) =>
          <DownloadModalItem download={download}
                             key={index}
                             cancelDownloadRequest={setCancelDownloadRequest}
          />)}
        {resumedInProgress && resumedInProgress.map((download, index) => (
          <DownloadModalItem key={index}
                             download={download}
                             cancelDownloadRequest={setCancelDownloadRequest}
                             resumed
          />
        ))}
        {downloadQueue && downloadQueue.map((download, index) =>
          <DownloadModalItem download={download}
                             key={index}
                             cancelDownloadRequest={setCancelDownloadRequest}
          />)}
      </div>
      <button
        onClick={onClose}
        className= { `${styles.closeButton} closeDownloadButton` }
        data-testid="download-modal-close-button"
        aria-label="Close"
      >
        Close
      </button>
      <div className={styles.subText} data-testid="download-modal-subtext">{downloadModalSubText}</div>
    </Modal>
  )
};

export default DownloadModal;
