import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
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

const GenReportDownloadTableRow: FunctionComponent<{
  generatedReport: IGeneratedReport;
  mobileView: boolean;
  setApiErrorMessage: (errorState: boolean) => void;
  setIsLoading: (loadingState: boolean) => void;
}> = ({ generatedReport, setIsLoading, setApiErrorMessage, mobileView }) => {
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);
  const { value, loading, error } = useRenderPDF(generatedReport);

  const prevLoadingRef = useRef<boolean>(false);
  useEffect(() => {
    const prev = prevLoadingRef.current;
    if (loading !== prev) {
      setIsLoading(loading);
      prevLoadingRef.current = loading;
    }
  }, [loading, setIsLoading]);

  useEffect(() => {
    setApiErrorMessage(!!error);
  }, [error, setApiErrorMessage]);

  useEffect(() => {
    const fileDisplay = getGeneratedReportFileDisplay(generatedReport);
    setDisplayName(fileDisplay?.displayName);
    setPublishedDate(generatedReport?.date);
  }, [generatedReport]);

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
