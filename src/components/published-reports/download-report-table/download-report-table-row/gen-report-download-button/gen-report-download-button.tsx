import React, { useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import ReportGenerator from '../../../report-generator/report-generator';
import { getGeneratedFileSize } from '../../../../../helpers/dataset-detail/report-helpers';
import { useRenderPDF } from './useRenderPDF';
// import {proxy, wrap} from 'comlink';

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
  // const [instance] = usePDF({ document: <ReportGenerator generatedReport={generatedReport} /> });
  const { url, loading, error } = useRenderPDF({});

  useEffect(() => {
    console.log('here?????/**/', url);
    getGeneratedFileSize(url, setFileSize);
  }, [url]);

  return generatedReportInstance && fileSize ? (
    <a href={url} download={generatedReport.downloadName} onClick={onDownloadClick}>
      {children}
    </a>
  ) : (
    <div>{children}</div>
  );
};

export const renderPDF = async report => {
  const instance = <ReportGenerator generatedReport={report} />;
  return pdf(instance).toBlob();
};

export default GenReportDownloadButton;
