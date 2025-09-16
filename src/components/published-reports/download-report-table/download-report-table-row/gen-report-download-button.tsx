import React, { useEffect } from 'react';
import { getGeneratedFileSize } from '../../../../helpers/dataset-detail/report-helpers';
import { useRenderPDF } from './useRenderPDF';

const GenReportDownloadButton = ({
  generatedReport,
  setApiErrorMessage,
  setIsLoading,
  setFileSize,
  fileSize,
  onDownloadClick,
  generatedReportInstance,
  setGeneratedReportInstance,
  children,
}) => {
  const { value, loading } = useRenderPDF(generatedReport);

  useEffect(() => {
    console.log('rerendering');
  }, []);

  useEffect(() => {
    console.log(loading);
    // setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (value?.url) {
      console.log('setting url');
      getGeneratedFileSize(value, setFileSize);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [value]);

  return value?.url ? (
    <a href={value.url} download={generatedReport.downloadName} onClick={onDownloadClick}>
      {children}
    </a>
  ) : (
    <div>{children}</div>
  );
};

export default GenReportDownloadButton;
