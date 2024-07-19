import React, { FunctionComponent, KeyboardEvent, useState, useEffect } from 'react';
import {
  fileDescription,
  downloadIcon,
  center,
  downloadFileContainer,
  fileDate,
  downloadInfo,
  downloadName,
  downloadButtonName,
  startName,
  downloadItem,
} from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';

import { BASE_URL } from 'gatsby-env-variables';
import { getFileTypeImage, splitFileName } from '../../util/util';

const DownloadReportTableRow: FunctionComponent<{ fileName: string; date: string; path: string; mobileView?: boolean }> = ({
  fileName,
  date,
  path,
  mobileView,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  // grab the file extension
  const regex = /\(([^)]+)\)/;
  const fileTypeMatch = fileName.match(regex);
  const apiFileType = fileTypeMatch[0];
  const fileType = fileTypeMatch[1];
  // Remove parenthesis from file name -> ex. fileName (.pdf) to fileName.pdf
  const fullDisplayName = fileName.split(' ' + apiFileType)[0] + fileType;
  //Split file name so overflow ellipsis can be used in the middle of the name
  const fileDisplayName = splitFileName(fullDisplayName, fullDisplayName.length - 8);
  console.log(fileDisplayName);
  //extract the download file name from the file path
  const splitPath = path.split('/');
  const downloadFileName = splitPath[splitPath.length - 1];

  const fileTypeImage: string = getFileTypeImage(fileType);

  const DownloadButton = () => (
    <div className={center}>
      <FontAwesomeIcon icon={faCloudArrowDown} />
      <div className={downloadButtonName}>{downloaded ? 'Downloaded' : 'Download'}</div>
    </div>
  );

  const onDownloadClick = () => {
    if (!downloaded) {
      setDownloaded(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setDownloaded(false);
    }, [3000]);
  }, []);

  return (
    <>
      {fileDisplayName?.start && fileDisplayName?.end && (
        <tr className={fileDescription} data-testid="file-download-row" role="button" tabIndex={0}>
          {!mobileView && (
            <>
              <td>
                <div className={downloadFileContainer}>
                  <img src={fileTypeImage} alt={`${fileType} icon`} />
                  <div className={downloadName}>
                    <span className={startName}>{fileDisplayName.start}</span>
                    <span>{fileDisplayName.end}</span>
                  </div>
                </div>
              </td>
              <td>{date}</td>
              <td>2KB</td>
              <td className={downloadIcon}>
                <DownloadButton />
              </td>
            </>
          )}
          {mobileView && (
            <td>
              <a href={BASE_URL + path} download={downloadFileName} target="_blank" rel="noreferrer noopener" onClick={onDownloadClick}>
                <div className={downloadFileContainer}>
                  <img src={fileTypeImage} alt={`${fileType} icon`} />
                  <div className={downloadItem}>
                    <div className={downloadName}>
                      <div className={startName}>{fileDisplayName.start}</div>
                      <div>{fileDisplayName.end}</div>
                    </div>
                    <div className={downloadInfo}>
                      <div className={fileDate}>{date}</div>
                      <div>2KB</div>
                    </div>
                  </div>
                  <div className={downloadIcon}>
                    <DownloadButton />
                  </div>
                </div>
              </a>
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default DownloadReportTableRow;
