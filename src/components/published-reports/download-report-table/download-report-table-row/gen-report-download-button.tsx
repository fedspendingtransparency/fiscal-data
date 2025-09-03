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
  // provides blob data
  const { url, loading, error } = useRenderPDF(generatedReport);
  // const test = renderPDF({ generatedReport });
  // const [instance, updateInstance] = usePDF({ document: test });

  // console.log(test);
  useEffect(() => {
    console.log(url);
    getGeneratedFileSize(url, setFileSize);
  }, [url]);

  return url ? (
    <a href={url} download={generatedReport.downloadName} onClick={onDownloadClick}>
      {children}
    </a>
  ) : (
    <div>{children}</div>
  );
};

export default GenReportDownloadButton;
