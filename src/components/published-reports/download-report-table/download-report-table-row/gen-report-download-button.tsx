import React, { useEffect, useMemo, useRef, useState } from 'react';
import { renderPDF } from '../../../../workers/pdfWorker';
import DownloadContents from './button-contents';
import { fileDescription } from './download-report-table-row.module.scss';
import { getGeneratedReportFileDisplay } from '../../util/util';
import { IGeneratedReport } from './download-report-table-row';

const GenReportDownloadButton = ({ generatedReport, fileDisplay, setIsLoading, loadingRef, selectedAccount }) => {
  const [displayName, setDisplayName] = useState(null);
  const [publishedDate, setPublishedDate] = useState(null);

  const workerRef = useRef(null);
  const [res, setRes] = useState(null);
  const [refSet, setRefSet] = useState(false);

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

  useEffect(() => {
    console.log(workerRef);
    // if (workerRef.current) {
    loadingRef.current = true;
    // setIsLoading(true);
    workerRef.current = renderPDF;
    setRefSet(true);
    // }
    return () => {
      console.log('unmounting ********************');
      // if (workerRef.current) {
      //   workerRef.current.terminate();
      //   workerRef.current = null; // Clear the ref
      // }
    };
  }, [generatedReport]);

  useEffect(() => {
    (async () => {
      if (refSet) {
        try {
          const test = await workerRef.current.renderPDFInWorker({ report: generatedReport });
          console.log('??', test);
          setRes(test);
          // loadingRef.current = false;
          // setIsLoading(false);
        } catch (e) {
          console.log(e);
        }
      }
    })();
    return () => {
      console.log('unmounting xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    };
  }, [refSet]);

  useMemo(() => {
    if (res) {
      const { value } = res;
      return value ? () => URL.revokeObjectURL(value) : undefined;
    }
  }, [res]);

  return (
    <>
      {/*{displayName && (*/}
      <tr className={fileDescription} data-testid="file-download-row">
        <td>
          <div style={{ minHeight: '44px' }}>
            {res?.url && res?.size && (
              <>
                <DownloadContents
                  size={res.size}
                  publishedDate={publishedDate}
                  fileDisplay={fileDisplay}
                  displayName={displayName}
                  url={res.url}
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
