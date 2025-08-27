import React, { useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer/lib/react-pdf.browser';
import { pdf } from '@react-pdf/renderer';
import ReportGenerator from '../../../report-generator/report-generator';
import { getGeneratedFileSize } from '../../../../../helpers/dataset-detail/report-helpers';

const GenReportDownloadButton = ({
  generatedReport,
  setApiErrorMessage,
  setIsLoading,
  setFileSize,
  onDownloadClick,
  generatedReportInstance,
  setGeneratedReportInstance,
  children,
}) => {
  useMemo(async () => {
    if (generatedReport && !generatedReportInstance) {
      const instance = <ReportGenerator generatedReport={generatedReport} />;
      setGeneratedReportInstance(instance);
      try {
        const blob = await pdf(instance).toBlob();
        console.log(blob);
        getGeneratedFileSize(blob, setFileSize);
        setApiErrorMessage(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setApiErrorMessage(true);
        return;
      }
    }
  }, [generatedReport]);

  return generatedReportInstance ? (
    <PDFDownloadLink document={generatedReportInstance} fileName={generatedReport.downloadName} onClick={onDownloadClick}>
      {children}
    </PDFDownloadLink>
  ) : (
    <div>{children}</div>
  );
};

export default GenReportDownloadButton;
