import ReportGenerator from '../../report-generator/report-generator';
import React from 'react';

export const createPDFReport = reportData => {
  console.log(reportData);
  return <ReportGenerator generatedReport={reportData} />;
};
