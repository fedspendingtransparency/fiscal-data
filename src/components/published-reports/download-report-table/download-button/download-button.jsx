import React, { useEffect, useState } from 'react';
import {
  center,
  downloadButtonName,
  downloadedIcon,
  downloadFileContainer,
  downloadIcon,
  downloadInfo,
  downloadItem,
  downloadName,
  downloadSize,
  endName,
  fileDate,
  startName,
} from '../download-report-table-row/download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons/faCloudArrowDown';
import { getFileTypeImage } from '../../util/util';
import { analyticsEventHandler } from '../../../../helpers/insights/insight-helpers';
import { ga4DataLayerPush } from '../../../../helpers/google-analytics/google-analytics-helper';

const DownloadButton = ({ size, publishedDate, displayName, url, mobileView, fileName, fileType = '.pdf' }) => {
  const [downloaded, setDownloaded] = useState(false);
  const fileTypeImage = getFileTypeImage(fileType);

  const onDownloadClick = () => {
    const eventLabel = fileName;
    const eventAction = 'Published Report Download';
    analyticsEventHandler('Data Download', eventLabel, eventAction);
    ga4DataLayerPush({
      event: eventAction,
      eventLabel: eventLabel,
    });

    setTimeout(() => {
      if (!downloaded) {
        setDownloaded(true);
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (downloaded) {
        setDownloaded(false);
      }
    }, 3000);
  }, [downloaded]);

  const download = (
    <div className={` ${downloaded && downloadedIcon} ${center}`} data-testId="download-icon" aria-describedby="Download Icon">
      <FontAwesomeIcon icon={downloaded ? faCircleCheck : faCloudArrowDown} />
      <div className={downloadButtonName}>{downloaded ? 'Downloaded' : 'Download'}</div>
    </div>
  );

  return (
    <>
      <a
        href={url}
        id="download-publish-report"
        download={fileName}
        onClick={onDownloadClick}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Download ${fileName}`}
      >
        <div className={downloadFileContainer}>
          {!mobileView && (
            <>
              <div className={downloadName}>
                <img src={fileTypeImage} alt={`${fileType} icon`} />
                {displayName?.start && <span className={startName}>{displayName.start}</span>}
                <span>{displayName?.end}</span>
              </div>
              <div className={fileDate}>{publishedDate}</div>
              <div className={downloadSize}>{size}</div>
              <div className={downloadIcon}>{download}</div>
            </>
          )}
          {mobileView && (
            <>
              <img src={fileTypeImage} alt={`${fileType} icon`} />
              <div className={downloadItem}>
                <div className={downloadName}>
                  {displayName?.start && <div className={startName}>{displayName.start}</div>}
                  <div className={endName}>{displayName.end}</div>
                </div>
                <div className={downloadInfo}>
                  <div className={fileDate}>{publishedDate}</div>
                  <div>{size}</div>
                </div>
              </div>
              <div className={downloadIcon}>{download}</div>
            </>
          )}
        </div>
      </a>
    </>
  );
};

export default DownloadButton;
