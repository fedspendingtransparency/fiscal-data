import React, { useEffect, useState } from 'react';
import {
  center,
  downloadButtonName,
  downloadedIcon,
  downloadFileContainer,
  downloadIcon,
  downloadName,
  downloadSize,
  fileDate,
  startName,
} from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { getFileTypeImage } from '../../util/util';

const DownloadContents = ({ size, publishedDate, displayName, url, download }) => {
  const [downloaded, setDownloaded] = useState(false);
  const fileTypeImage = getFileTypeImage('.pdf');
  const onDownloadClick = () => {
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

  const DownloadIcon = () => (
    <div className={` ${downloaded && downloadedIcon} ${center}`} data-testid="download-icon" aria-describedby="Download Icon">
      <FontAwesomeIcon icon={downloaded ? faCircleCheck : faCloudArrowDown} />
      <div className={downloadButtonName}>{downloaded ? 'Downloaded' : 'Download'}</div>
    </div>
  );

  return (
    <>
      <a href={url} download={download} onClick={onDownloadClick}>
        <div className={downloadFileContainer}>
          <div className={downloadName}>
            <img src={fileTypeImage} alt={`.pdf icon`} />
            {displayName?.start && <span className={startName}>{displayName?.start}</span>}
            <span>{displayName?.end}</span>
          </div>
          <div className={fileDate}>{publishedDate}</div>
          <div className={downloadSize}>{size}</div>
          <div className={downloadIcon}>
            <DownloadIcon />
          </div>
        </div>
      </a>
    </>
  );
};

export default DownloadContents;
