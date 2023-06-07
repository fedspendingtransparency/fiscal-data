import React from 'react';
import buttons from '../../buttons/buttons';
import DownloadPercentageStatus from '../../download-percentage-status/download-percentage-status';
import * as styles from './download-modal-item.module.scss';
import { faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from "../../download-wrapper/helpers";

/**
 *
 * @param download {Object}
 * @param cancelDownloadRequest {Function} - call to cancel download/queued download
 * @param resumed {Boolean} - true if download is resumed from a prior session and devoid of progress tracking
 */

const DownloadModalItem = ({
  download,
  cancelDownloadRequest,
  resumed = false
}) => {
  const fileNameArr = download.filename?.split('_');
  const fileName = fileNameArr ? `${fileNameArr.slice(0, fileNameArr.length - 2).join('_')}.zip` : download.filename;

  const formatDateRange = (range) => {
    const from = formatDate(new Date(range?.from));
    const to = formatDate(new Date(range?.to));
    return `${from} - ${to}`;
  };

  let statusTitle = '';
  let percentage = 0;
  let queued = false;
  if (download) {
    if (download.readyForDownload || download.status === 'completed') {
      statusTitle = "Ready for download.";
      percentage = 100;
    } else if (download.prepStarted && download.statusPath) {
      statusTitle = "Currently preparing:";
      percentage = Math.round(download.progressPct);
      // percentage may hit 100 but shouldn't display that until the download is complete
      if (percentage > 99) percentage = 99;
    } else {
      statusTitle = "Queued for download next:";
      percentage = 0;
      queued = true;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.title} data-testid="title">{statusTitle}</div>
      <div className={styles.content}>
        <div className={`${styles.progressIndicator} ${resumed ? styles.resumed : ''}`} data-testid="progress-indicator">
          {resumed ?
            (
              <div className={`${styles.resumedSpinner} ${queued ? styles.queuedSpinner : ''}`}>
                {(download.status === 'completed' || download.readyForDownload)
                  ? <FontAwesomeIcon data-testid="spinner-icon" icon={faCheckCircle} />
                  : <FontAwesomeIcon data-testid="spinner-icon" icon={faSpinner} spin pulse />
                }
              </div>
            ) : (
              <DownloadPercentageStatus percentage={percentage} />
            )
          }
        </div>
        <div
          className={[
            styles.fileContent,
            resumed && (download.status === 'completed' || download.readyForDownload) ? styles.readyForDownload : ''
          ].join(' ')}
        >
          <div className={styles.mobileContentContainer}>
            <div className={`${styles.mobileProgressIndicator} ${resumed ? styles.resumed : ''}`}>
              {resumed ?
                (
                  <div className={`${styles.resumedSpinner} ${queued ? styles.queuedSpinner : ''}`}>
                    {(download.status === 'completed' || download.readyForDownload)
                      ? <FontAwesomeIcon data-testid="spinner-icon" icon={faCheckCircle} />
                      : <FontAwesomeIcon data-testid="spinner-icon" icon={faSpinner} spin pulse />
                    }
                  </div>
                ) : (
                  <DownloadPercentageStatus percentage={percentage} />
                )
              }
            </div>
            <div className={styles.fileDetails}>
              <div className={styles.fileInfo}>
                <div className={styles.fileName} data-testid="name">{fileName}</div>
                <div className={styles.pill} data-testid="date-range">{formatDateRange(download.dateRange)}</div>
                <div className={styles.pill} data-testid="file-type">{download.selectedFileType}</div>
              </div>
              {(!download.readyForDownload && download.status !== 'completed') && (
                <div
                  className={ `${styles.cancelDownloadButton} cancelDownloadButton` }
                  data-testid="cancel-download-button"
                >
                  {buttons.cancelButton(download, cancelDownloadRequest)}
                </div>
              )}
              {resumed && download.status === 'completed' && (
                <a
                  href={download.fullFileUrl}
                  className={styles.downloadButton}
                  data-testid="download-button"
                >
                  Download File
                </a>
              )}
            </div>
          </div>
          {(download.statusPath && !download.readyForDownload) && (
            <div className={styles.downloadLink} data-testid="download-link">
              Don't have time to wait? Don't forget to copy the link below before you leave the site!
              <div className={styles.copyLink}>
                <div
                  className={styles.downloadLinkName}
                  data-testid="download-link-name"
                >
                  {download.statusPath}
                </div>
                <div
                  className={ `${styles.copyLinkButton} copyLinkButton` }
                  data-testid="copy-link-button"
                >
                  {buttons.copyToClipboardButton(download.statusPath)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadModalItem;
