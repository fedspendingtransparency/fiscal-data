import React, { useEffect, useState } from 'react';
import { reportDownloadDesc, propLabel, helpText } from './download-report.module.scss';
import { getDateLabelForReport } from '../../../helpers/dataset-detail/report-helpers';
import DownloadItemButton from '../../download-wrapper/download-item-button/download-item-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { getFileSize } from './download-helpers';

const DownloadReport = ({ reportFile, isPublishedReport }) => {
  const icon = <FontAwesomeIcon icon={faFileDownload} data-test-id="report-icon" />;
  const [fileSize, setFileSize] = useState(null);
  const [reportLocation, setReportLocation] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);

  const updateData = () => {
    const curReportFile = reportFile || {};
    const location = curReportFile.path;

    setReportLocation(location || null);
    setFileName(location ? location.split('/').slice(-1)[0] : 'report');
    setGroupName(curReportFile.report_group_desc || '');
    setPublishedDate(curReportFile.report_date ? getDateLabelForReport(curReportFile, curReportFile.daily) : 'N/A');
    if (location) {
      getFileSize(location).then(size => {
        setFileSize(size);
      });
    }
  };

  useEffect(() => {
    updateData();
  }, [reportFile]);

  useEffect(() => {
    updateData();
  }, []);

  return (
    <>
      <div className={reportDownloadDesc}>
        <div>
          <span className={propLabel}>Report: </span>
          <span data-testid="reportGroupName">{groupName}</span>
        </div>
        <div>
          <span className={propLabel}>File: </span>
          <span data-testid="reportFileDate">{publishedDate}</span>
        </div>
      </div>
      {reportLocation ? (
        <>
          <DownloadItemButton icon={icon} label="Download" href={reportLocation} download={fileName} fileSize={isPublishedReport ? fileSize : null} />
          <div className={helpText} data-testid="helpText" />
        </>
      ) : (
        <>
          <DownloadItemButton icon={icon} label="Download" disabled />
          <div className={helpText} data-testid="helpText">
            Please select a report to download
          </div>
        </>
      )}
    </>
  );
};

export default DownloadReport;
