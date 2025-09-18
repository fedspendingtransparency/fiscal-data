import { expose } from 'comlink';
import { getGeneratedFileSize } from '../helpers/dataset-detail/report-helpers';

const renderPDFInWorker = async props => {
  try {
    const { createPDFReport } = await import('../components/published-reports/download-report-table/gen-report-download-table-row/createPdfReport');
    return await createPDFReport(props.report).then(blob => {
      const url = URL.createObjectURL(blob);
      const size = getGeneratedFileSize(blob.size);
      return { url, size };
    });
  } catch (e) {
    console.warn(e);
  }
};

expose({ renderPDFInWorker: renderPDFInWorker });
