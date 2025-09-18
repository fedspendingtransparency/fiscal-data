import React, { useEffect, useState } from 'react';
import { fileDescription } from './download-report-table-row.module.scss';
import { getGeneratedReportFileDisplay } from '../../util/util';
import { IGeneratedReport } from './download-report-table-row';
import { useRenderPDF } from './useRenderPDF';
import DownloadContents from './button-contents';

const GenReportDownloadButton = ({ generatedReport, fileDisplay, setIsLoading, loadingRef, selectedAccount }) => {
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);
  const { url, loading, error } = useRenderPDF(generatedReport);
  // const workerRef = useRef(null);
  // const [res, setRes] = useState(null);
  // const [refSet, setRefSet] = useState(false);

  //TODO: test removing the ref from the worker

  const updateData = () => {
    const curReportFile: IGeneratedReport = generatedReport;
    const fileDisplay = getGeneratedReportFileDisplay(curReportFile);
    setDisplayName(fileDisplay?.displayName);
    console.log(fileDisplay?.displayName);
    setPublishedDate(curReportFile?.date);
  };

  useEffect(() => {
    setIsLoading(true);
    updateData();
  }, [generatedReport]);

  useEffect(() => {
    console.log('reset state');
    // loadingRef.current = true;
    // setDisplayName(null);
    // // setFileSize(null);
    // setFileName(null);
    // setFileType(null);
  }, [selectedAccount]);

  return (
    <>
      {/*{displayName && (*/}
      <tr className={fileDescription} data-testid="file-download-row">
        <td>
          <div style={{ minHeight: '44px' }}>
            {url?.url && url?.size && (
              <>
                <DownloadContents
                  size={url.size}
                  publishedDate={publishedDate}
                  fileDisplay={fileDisplay}
                  displayName={displayName}
                  url={url.url}
                  download={generatedReport.downloadName}
                />
                {setIsLoading(false)}
              </>
            )}
          </div>
        </td>
      </tr>
      {/*)}*/}
    </>
  );
};

export default GenReportDownloadButton;
