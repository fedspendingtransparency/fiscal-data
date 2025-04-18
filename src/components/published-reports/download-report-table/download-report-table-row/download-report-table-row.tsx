import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  center,
  downloadButton,
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
  fileDescription,
  startName,
} from './download-report-table-row.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck, faCloudArrowDown} from '@fortawesome/free-solid-svg-icons';
import {getFileDisplay, getFileTypeImage, getGeneratedReportFileDisplay} from '../../util/util';
import {IPublishedReportDataJson} from '../../../../models/IPublishedReportDataJson';
import {getDateLabelForReport, getGeneratedFileSize} from '../../../../helpers/dataset-detail/report-helpers';
import {getFileSize} from '../../download-report/download-helpers';
import {PDFDownloadLink} from '@react-pdf/renderer/lib/react-pdf.browser';
import ReportGenerator from '../../report-generator/report-generator';
import {DocumentProps, pdf} from '@react-pdf/renderer';

interface IGeneratedReport {
  name: string;
  downloadName: string;
  date: string;
  size: string;
  config;
  data;
  colConfig;
  setApiErrorMessage: boolean;
}

const DownloadReportTableRow: FunctionComponent<{
  reportFile?: IPublishedReportDataJson;
  generatedReport?: IGeneratedReport;
  isDailyReport: boolean;
  mobileView?: boolean;
}> = ({ reportFile, isDailyReport, mobileView, generatedReport }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [fileSize, setFileSize] = useState(null);
  const [reportLocation, setReportLocation] = useState<string>(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);
  const [fileTypeImage, setFileTypeImage] = useState(null);
  const [generatedReportInstance, setGeneratedReportInstance] = useState<React.ReactElement<DocumentProps>>(null);

  const updateData = () => {
    if (reportFile && !generatedReport) {
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
    } else if (generatedReport) {
      const curReportFile: IGeneratedReport = generatedReport;
      const fileDisplay = getGeneratedReportFileDisplay(curReportFile);
      setDisplayName(fileDisplay?.displayName);
      setFileName(curReportFile.downloadName);
      setPublishedDate(curReportFile?.date);
      setFileType('.pdf');
      setFileTypeImage(getFileTypeImage('.pdf'));
      setReportLocation('');
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

  useEffect(() => {
    if (generatedReport) {
      (async () => {
        const instance = (
          <ReportGenerator reportConfig={generatedReport.config} reportData={generatedReport.data} colConfig={generatedReport.colConfig} />
        );
        setGeneratedReportInstance(instance);
        try {
          const blob = await pdf(instance).toBlob();
          getGeneratedFileSize(blob, setFileSize);
        } catch (error) {
          // setApiErrorMessage(true);
          return;
        }
      })();
    }
  }, [generatedReport]);

  const LinkComponent = ({ children }) => {
    return generatedReport ? (
      <PDFDownloadLink document={generatedReportInstance} fileName={generatedReport.downloadName} onClick={onDownloadClick}>
        {children}
      </PDFDownloadLink>
    ) : (
      <a
        href={reportLocation}
        download={fileName}
        target="_blank"
        rel="noreferrer noopener"
        onClick={onDownloadClick}
        className={downloadButton}
        aria-label={`Download ${fileName}`}
      >
        {children}
      </a>
    );
  };

  const onDownloadClick = () => {
    if (!downloaded) {
      setDownloaded(true);
    }
  };

  useEffect(() => {
    updateData();
  }, [reportFile, generatedReport]);

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
      {displayName && (!generatedReport || (generatedReportInstance && fileSize)) && (
        <tr className={fileDescription} data-testid="file-download-row">
          <td>
            <LinkComponent>
              {!mobileView && (!generatedReport || fileSize) && (
                <>
                  <div className={downloadFileContainer}>
                    <div className={downloadName}>
                      <img src={fileTypeImage} alt={`${fileType} icon`} />
                      {displayName?.start && <span className={startName}>{displayName.start}</span>}
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
              {mobileView && (!generatedReport || fileSize) && (
                <div className={downloadFileContainer}>
                  <img src={fileTypeImage} alt={`${fileType} icon`} />
                  <div className={downloadItem}>
                    <div className={downloadName}>
                      {displayName?.start && <div className={startName}>{displayName.start}</div>}
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
            </LinkComponent>
          </td>
        </tr>
      )}
    </>
  );
};

export default DownloadReportTableRow;
