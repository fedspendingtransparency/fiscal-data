import { expose } from 'comlink';

const renderPDFInWorker = async props => {
  let reportLink;
  try {
    const { createPDFReport } = await import('../components/published-reports/download-report-table/download-report-table-row/getTheReport');
    reportLink = URL.createObjectURL(await createPDFReport(props.report));
    return reportLink;
  } catch (e) {
    console.log(e);
  }
};

expose({ renderPDFInWorker: renderPDFInWorker });
