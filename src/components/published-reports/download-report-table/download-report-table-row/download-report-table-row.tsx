import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  fileDescription,
  downloadIcon,
  center,
  downloadFileContainer,
  fileDate,
  downloadSize,
  downloadInfo,
  downloadName,
  downloadButtonName,
  startName,
  downloadItem,
  downloadedIcon,
  downloadButton,
} from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { getFileTypeImage, splitFileName } from '../../util/util';
import { IReports } from '../../reports-section/reports-section';
import { getDateLabelForReport } from '../../../../helpers/dataset-detail/report-helpers';
import { getFileSize } from '../../download-report/download-helpers';

const DownloadReportTableRow: FunctionComponent<{ reportFile: IReports; isDailyReport: boolean; mobileView?: boolean }> = ({
  reportFile,
  isDailyReport,
  mobileView,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [fileSize, setFileSize] = useState(null);
  const [reportLocation, setReportLocation] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);
  const [fileTypeImage, setFileTypeImage] = useState(null);

  const updateData = () => {
    if (reportFile) {
      const curReportFile: IReports = reportFile;
      const location = curReportFile.path;

      setReportLocation(location || null);
      const name = location ? location.split('/').slice(-1)[0] : 'report';
      setFileName(name);
      setPublishedDate(curReportFile.report_date ? getDateLabelForReport(curReportFile, isDailyReport, true) : 'N/A');
      if (location) {
        getFileSize(location).then(size => {
          setFileSize(size);
        });
      }
      // grab the file extension
      const fileTypeRegex = /\(([^)]+)\)/;
      const groupName = curReportFile.report_group_desc;
      const fileTypeMatch = groupName.match(fileTypeRegex);
      const apiFileType = fileTypeMatch[0];
      const downloadFileType = fileTypeMatch[1];
      // Remove parenthesis from file name -> ex. fileName (.pdf) to fileName.pdf
      const fullDisplayName = groupName.replace(' ' + apiFileType, downloadFileType);
      //Split file name so overflow ellipsis can be used in the middle of the name
      const fileDisplayName = splitFileName(fullDisplayName, fullDisplayName.length - 8);
      console.log(fileDisplayName);
      setDisplayName(fileDisplayName || '');
      setFileType(downloadFileType);
      setFileTypeImage(getFileTypeImage(downloadFileType));
    }
  };

  const DownloadButton = () => (
    <>
      {downloaded && (
        <div className={` ${downloadedIcon} ${center}`} data-testid="download-icon" aria-describedby="Download Icon">
          <FontAwesomeIcon icon={faCircleCheck} />
          <div className={downloadButtonName}>Downloaded</div>
        </div>
      )}
      {!downloaded && (
        <div className={center} data-testid="download-icon" aria-describedby="Download Icon">
          <FontAwesomeIcon icon={faCloudArrowDown} />
          <div className={downloadButtonName}>Download</div>
        </div>
      )}
    </>
  );

  const onDownloadClick = () => {
    if (!downloaded) {
      setDownloaded(true);
    }
  };

  useEffect(() => {
    updateData();
  }, [reportFile]);

  useEffect(() => {
    updateData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (downloaded) {
        setDownloaded(false);
      }
    }, 3000);
  }, [downloaded]);

  return (
    <>
      {displayName?.start && displayName?.end && (
        <tr className={fileDescription} data-testid="file-download-row">
          <td>
            <a
              href={reportLocation}
              download={fileName}
              target="_blank"
              rel="noreferrer noopener"
              onClick={onDownloadClick}
              className={downloadButton}
              aria-label={`Download ${fileName}`}
            >
              {!mobileView && (
                <>
                  <div className={downloadFileContainer}>
                    <div className={downloadName}>
                      <img src={fileTypeImage} alt={`${fileType} icon`} />
                      <span className={startName}>{displayName.start}</span>
                      <span>{displayName.end}</span>
                    </div>
                    <div className={fileDate}>{publishedDate}</div>
                    <div className={downloadSize}>{fileSize}</div>
                    <div className={downloadIcon}>
                      <DownloadButton />
                    </div>
                  </div>
                </>
              )}
              {mobileView && (
                <div className={downloadFileContainer}>
                  <img src={fileTypeImage} alt={`${fileType} icon`} />
                  <div className={downloadItem}>
                    <div className={downloadName}>
                      <div className={startName}>{displayName.start + 's'}</div>
                      <div>{displayName.end}</div>
                    </div>
                    <div className={downloadInfo}>
                      <div className={fileDate}>{publishedDate}</div>
                      <div>{fileSize}</div>
                    </div>
                  </div>
                  <div className={downloadIcon}>
                    <DownloadButton />
                  </div>
                </div>
              )}
            </a>
          </td>
        </tr>
      )}
    </>
  );
};

export default DownloadReportTableRow;
