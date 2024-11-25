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
  endName,
} from './download-report-table-row.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { getFileDisplay, getFileTypeImage } from '../../util/util';
import { getDateLabelForReport } from '../../../../helpers/dataset-detail/report-helpers';
import { getFileSize } from '../../download-report/download-helpers';
import { IPublishedReportDataJson } from '../../../../models/IPublishedReportDataJson';

const DownloadReportTableRow: FunctionComponent<{ reportFile: IPublishedReportDataJson; isDailyReport: boolean; mobileView?: boolean }> = ({
  reportFile,
  isDailyReport,
  mobileView,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [fileSize, setFileSize] = useState(null);
  const [reportLocation, setReportLocation] = useState<string>(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);
  const [fileTypeImage, setFileTypeImage] = useState<string>(null);

  const updateData = () => {
    if (reportFile) {
      const curReportFile: IPublishedReportDataJson = reportFile;
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

      const fileDisplay = getFileDisplay(curReportFile);
      setDisplayName(fileDisplay.displayName);
      setFileType(fileDisplay.fileType);
      setFileTypeImage(getFileTypeImage(fileDisplay.fileType));
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
                      <div className={startName}>{displayName.start}</div>
                      <div className={endName}>{displayName.end}</div>
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
