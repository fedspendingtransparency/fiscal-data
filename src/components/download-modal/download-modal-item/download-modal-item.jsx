import React from 'react';
import buttons from '../../buttons/buttons';
import DownloadPercentageStatus from '../../download-percentage-status/download-percentage-status';
import {
  cancelDownloadButton,
  container,
  content,
  copyLink,
  copyLinkButton,
  downloadButton,
  downloadLink,
  downloadLinkName,
  fileContent,
  fileDetails,
  fileInfo,
  fileNameStyle,
  mobileContentContainer,
  mobileProgressIndicator,
  pill,
  progressIndicator,
  queuedSpinner,
  readyForDownload,
  resumedSpinner,
  resumedStyle,
  title,
} from './download-modal-item.module.scss';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '../../download-wrapper/helpers';
import { useRecoilValue } from 'recoil';
import { dataTableDapGaEventLabelState } from '../../../recoil/dataTableDapGaEventLabelState';

/**
 *
 * @param download {Object}
 * @param cancelDownloadRequest {Function} - call to cancel download/queued download
 * @param resumed {Boolean} - true if download is resumed from a prior session and devoid of progress tracking
 */

const DownloadModalItem = ({ download, cancelDownloadRequest, resumed = false }) => {
  const fileNameArr = download.filename?.split('_');
  const fileName = fileNameArr ? `${fileNameArr.slice(0, fileNameArr.length - 2).join('_')}.zip` : download.filename;
  const dapGaEventLabel = useRecoilValue(dataTableDapGaEventLabelState);

  const formatDateRange = range => {
    const from = formatDate(new Date(range?.from));
    const to = formatDate(new Date(range?.to));
    return `${from} - ${to}`;
  };

  let statusTitle = '';
  let percentage = 0;
  let queued = false;
  if (download) {
    if (download.readyForDownload || download.status === 'completed') {
      statusTitle = 'Ready for download.';
      percentage = 100;
    } else if (download.prepStarted && download.statusPath) {
      statusTitle = 'Currently preparing:';
      percentage = Math.round(download.progressPct);
      // percentage may hit 100 but shouldn't display that until the download is complete
      if (percentage > 99) percentage = 99;
    } else {
      statusTitle = 'Queued for download next:';
      percentage = 0;
      queued = true;
    }
  }

  return (
    <div className={container}>
      <div className={title} data-testid="title">
        {statusTitle}
      </div>
      <div className={content}>
        <div className={`${progressIndicator} ${resumed ? resumedStyle : ''}`} data-testid="progress-indicator">
          {resumed ? (
            <div className={`${resumedSpinner} ${queued ? queuedSpinner : ''}`}>
              {download.status === 'completed' || download.readyForDownload ? (
                <FontAwesomeIcon data-testid="spinner-icon" icon={faCheckCircle} />
              ) : (
                <FontAwesomeIcon data-testid="spinner-icon" icon={faSpinner} spin pulse />
              )}
            </div>
          ) : (
            <DownloadPercentageStatus percentage={percentage} />
          )}
        </div>
        <div className={[fileContent, resumed && (download.status === 'completed' || download.readyForDownload) ? readyForDownload : ''].join(' ')}>
          <div className={mobileContentContainer}>
            <div className={`${mobileProgressIndicator} ${resumed ? resumedStyle : ''}`}>
              {resumed ? (
                <div className={`${resumedSpinner} ${queued ? queuedSpinner : ''}`}>
                  {download.status === 'completed' || download.readyForDownload ? (
                    <FontAwesomeIcon data-testid="spinner-icon" icon={faCheckCircle} />
                  ) : (
                    <FontAwesomeIcon data-testid="spinner-icon" icon={faSpinner} spin pulse />
                  )}
                </div>
              ) : (
                <DownloadPercentageStatus percentage={percentage} />
              )}
            </div>
            <div className={fileDetails}>
              <div className={fileInfo}>
                <div className={fileNameStyle} data-testid="name">
                  {fileName}
                </div>
                <div className={pill} data-testid="date-range">
                  {formatDateRange(download.dateRange)}
                </div>
                <div className={pill} data-testid="file-type">
                  {download.selectedFileType}
                </div>
              </div>
              {!download.readyForDownload && download.status !== 'completed' && (
                <div className={`${cancelDownloadButton} cancelDownloadButton`} data-testid="cancel-download-button">
                  {buttons.cancelButton(download, cancelDownloadRequest)}
                </div>
              )}
              {resumed && download.status === 'completed' && (
                <a href={download.fullFileUrl} className={downloadButton} data-testid="download-button">
                  Download File
                </a>
              )}
            </div>
          </div>
          {download.statusPath && !download.readyForDownload && (
            <div className={downloadLink} data-testid="download-link">
              Don't have time to wait? Don't forget to copy the link below before you leave the site!
              <div className={copyLink}>
                <div className={downloadLinkName} data-testid="download-link-name">
                  {download.statusPath}
                </div>
                <div className={`${copyLinkButton} copyLinkButton`} data-testid="copy-link-button">
                  {buttons.copyToClipboardButton(download.statusPath, dapGaEventLabel)}
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
