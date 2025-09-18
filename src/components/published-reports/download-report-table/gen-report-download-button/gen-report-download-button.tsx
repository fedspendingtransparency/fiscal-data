import React, { useEffect, useState } from 'react';
import { fileDescription } from '../download-report-table-row/download-report-table-row.module.scss';
import { getGeneratedReportFileDisplay } from '../../util/util';
import { useRenderPDF } from './useRenderPDF';
import DownloadContents from '../download-report-table-row/button-contents';
import { downloadItem } from './gen-report-download-button.module.scss';

interface IGeneratedReport {
  name: string;
  downloadName: string;
  date: string;
  size: string;
  config;
  data;
  colConfig;
}

const GenReportDownloadButton = ({ generatedReport, fileDisplay, setIsLoading, setApiErrorMessage, mobileView }) => {
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
                  fileDisplay={fileDisplay}
                  displayName={displayName}
                  url={value.url}
                  download={generatedReport.downloadName}
                />
                {setIsLoading(false)}
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default GenReportDownloadButton;
