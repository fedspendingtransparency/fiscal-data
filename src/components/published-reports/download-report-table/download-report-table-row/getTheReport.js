import ReportGenerator from '../../report-generator/report-generator';
import React from 'react';
import { pdf } from '@react-pdf/renderer';

export const createPDFReport = async reportData => {
  const report = <ReportGenerator generatedReport={reportData} />;
  return pdf(report).toBlob();
};
