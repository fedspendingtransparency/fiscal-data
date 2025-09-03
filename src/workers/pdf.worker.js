import { expose } from 'comlink';

const renderPDFInWorker = async props => {
  console.log('is this real', props);
  let reportLink;
  let doc;
  let blob;
  try {
    const { createPDFReport } = await import('../components/published-reports/download-report-table/download-report-table-row/getTheReport');

    reportLink = URL.createObjectURL(await createPDFReport(props.report));
    console.log(reportLink);
    return reportLink;
  } catch (e) {
    console.log(e);
  }
};
// const onProgress = cb => (console.log = cb);

expose({ renderPDFInWorker: renderPDFInWorker });
