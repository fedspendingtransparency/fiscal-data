import React, { useEffect, useMemo, useRef, useState } from 'react';
import { renderPDF } from '../../../../workers/pdfWorker';
import { getGeneratedFileSize } from '../../../../helpers/dataset-detail/report-helpers';

const GenReportDownloadButton = ({
  generatedReport,
  setApiErrorMessage,
  setIsLoading,
  // setFileSize,
  // fileSize,
  onDownloadClick,
  generatedReportInstance,
  setGeneratedReportInstance,
  children,
  getContents,
}) => {
  const workerRef = useRef(null);
  const [res, setRes] = useState({});
  const [refSet, setRefSet] = useState(false);
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    console.log(workerRef);
    if (!workerRef.current) {
      workerRef.current = renderPDF;
      setRefSet(true);
      // const test = await workerRef.current.renderPDFInWorker({ generatedReport });
      // console.log('??', test);
      // setRes(test);
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
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [refSet]);

  useMemo(() => {
    if (res) {
      const { value } = res;

      return value ? () => URL.revokeObjectURL(value) : undefined;
    }
  }, [res]);
  // const res = useRenderPDF(generatedReport);
  // const { url } = res;
  // const value = { url: null };
  // useEffect(() => {
  //   console.log('rerendering', res);
  // }, [res]);

  // useEffect(() => {
  // console.log(loading);
  // setIsLoading(loading);
  // }, [loading]);

  useEffect(() => {
    if (res?.url) {
      console.log('setting url', res?.url);
      getGeneratedFileSize(res, setFileSize);
    } else {
      // setIsLoading(true);
    }
  }, [res]);

  useEffect(() => {
    if (fileSize) {
      setIsLoading(false);
      console.log('end loading');
    }
  }, [fileSize]);

  return res?.url ? (
    <a href={res?.url} download={generatedReport.downloadName} onClick={onDownloadClick}>
      {getContents(fileSize)}
    </a>
  ) : (
    <div>{children}</div>
  );
};

export default GenReportDownloadButton;
