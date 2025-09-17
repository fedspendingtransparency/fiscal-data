import React, { useEffect, useMemo, useRef, useState } from 'react';
import { renderPDF } from '../../../../workers/pdfWorker';

const GenReportDownloadButton = ({ generatedReport, setApiErrorMessage, setIsLoading, onDownloadClick, getContents, loadingRef }) => {
  const workerRef = useRef(null);
  const [res, setRes] = useState({});
  const [refSet, setRefSet] = useState(false);

  useEffect(() => {
    console.log(workerRef);
    if (!workerRef.current) {
      workerRef.current = renderPDF;
      setRefSet(true);
    }
    return () => {
      console.log('unmounting ********************');
      // if (workerRef.current) {
      //   workerRef.current.terminate();
      //   workerRef.current = null; // Clear the ref
      // }
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (refSet) {
        try {
          const test = await workerRef.current.renderPDFInWorker({ report: generatedReport });
          console.log('??', test);
          setRes(test);
          loadingRef.current = false;
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
      {res?.url && res?.size && (
        <a href={res.url} download={generatedReport.downloadName} onClick={onDownloadClick}>
          {getContents(res.size)}
        </a>
      )}
    </>
  );
};

export default GenReportDownloadButton;
