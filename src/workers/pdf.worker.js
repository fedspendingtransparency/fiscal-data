import { expose } from 'comlink';
import { PDFDownloadLink } from '@react-pdf/renderer/lib/react-pdf.browser';
import React from 'react';

const renderPDFInWorker = async props => {
  console.log('is this real', props);
  let reportLink;
  let instance;
  try {
    const { createPDFReport } = await import('../components/published-reports/download-report-table/download-report-table-row/getTheReport');
    instance = createPDFReport(props.report);
    reportLink = <PDFDownloadLink document={instance} fileName={props.report.downloadName}></PDFDownloadLink>;
  } catch (e) {
    console.log(e);
  }
  // console.log('is this real', instance);

  // const { pdf } = await import('@react-pdf/renderer');
  // return pdf(props).toBlob();
  return 'test';
};
// const onProgress = cb => (console.log = cb);

expose({ renderPDFInWorker: renderPDFInWorker });
