import { expose } from 'comlink';
import { renderPDF } from '../gen-report-download-button';
import '../workerShim';

let log = console.log;

const renderPDFInWorker = async props => {
  try {
    console.log('????');
    return await renderPDF(props);
  } catch (error) {
    log(error);
    throw error;
  }
};

// for debugging purposes - will override the log method to the callback
const onProgress = (cb: typeof console.info) => (log = cb);

// easier way to expose function from workers using comlink
expose({ renderPDFInWorker, onProgress });

export type WorkerType = {
  renderPDf: typeof renderPDFInWorker;
  onProgress: typeof onProgress;
};
