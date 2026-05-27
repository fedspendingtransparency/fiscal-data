import React, { FunctionComponent, useEffect, useState } from 'react';
import { fileDescription } from './download-report-table-row.module.scss';
import { getFileDisplay } from '../../util/util';
import { IPublishedReportDataJson } from '../../../../models/IPublishedReportDataJson';
import { getDateLabelForReport } from '../../../../helpers/dataset-detail/report-helpers';
import { getFileSize } from '../../download-report/download-helpers';
import DownloadContents from '../download-button/download-button';

const DownloadReportTableRow: FunctionComponent<{
  reportFile?: IPublishedReportDataJson;
  isDailyReport: boolean;
  mobileView?: boolean;
  setApiErrorMessage?: (errorState: boolean) => void;
  setIsLoading?: (loadingState: boolean) => void;
}> = ({ reportFile, isDailyReport, mobileView }) => {
  const [fileSize, setFileSize] = useState(null);
  const [reportLocation, setReportLocation] = useState<string>(null);
  const [fileName, setFileName] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);

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
      {displayName && (
        <tr className={fileDescription} data-testid="file-download-row">
          <td>
            <DownloadContents
              size={fileSize}
              publishedDate={publishedDate}
              displayName={displayName}
              url={reportLocation}
              fileName={fileName}
              fileType={fileType}
              mobileView={mobileView}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default DownloadReportTableRow;
