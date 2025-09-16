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
    if (value?.url) {
      getGeneratedFileSize(value, setFileSize);
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
