import React, { useEffect, useState } from 'react';
import { fileDescription } from '../download-report-table-row/download-report-table-row.module.scss';
import { getGeneratedReportFileDisplay } from '../../util/util';
import { useRenderPDF } from './useRenderPDF';
import DownloadContents from '../download-button/download-button';
import { downloadItem } from './gen-report-download-table-row.module.scss';

interface IGeneratedReport {
  name: string;
  downloadName: string;
  date: string;
  size: string;
  config;
  data;
  colConfig;
}

const GenReportDownloadTableRow = ({ generatedReport, setIsLoading, setApiErrorMessage, mobileView }) => {
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);
  const { value, loading, error } = useRenderPDF(generatedReport);

  const updateData = () => {
    const curReportFile: IGeneratedReport = generatedReport;
    const fileDisplay = getGeneratedReportFileDisplay(curReportFile);
    setDisplayName(fileDisplay?.displayName);
    setPublishedDate(curReportFile?.date);
  };

  useEffect(() => {
    updateData();
  }, [generatedReport]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    setApiErrorMessage(error);
  }, [error]);

  return (
    <>
      <tr className={fileDescription} data-testid="file-download-row">
        <td>
          <div className={downloadItem}>
            {value?.url && value?.size && (
              <>
                <DownloadContents
                  size={value.size}
                  publishedDate={publishedDate}
                  displayName={displayName}
                  url={value.url}
                  fileName={generatedReport.downloadName}
                  mobileView={mobileView}
                />
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default GenReportDownloadTableRow;
