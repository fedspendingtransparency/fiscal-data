import { expose } from 'comlink';

const renderPDFInWorker = async props => {
  let url;
  try {
    const { createPDFReport } = await import('../components/published-reports/download-report-table/download-report-table-row/getTheReport');
    const reportBlob = await createPDFReport(props.report);
    console.log(reportBlob);
    url = URL.createObjectURL(await reportBlob);
    return { url, size: reportBlob.size };
  } catch (e) {
    console.warn(e);
  }
};

expose({ renderPDFInWorker: renderPDFInWorker });
