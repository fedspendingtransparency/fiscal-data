import { expose } from 'comlink';

const renderPDFInWorker = async () => {
  console.log('is this real');
  return 'test';
};
const onProgress = cb => (console.log = cb);

expose({ renderPDFInWorker: renderPDFInWorker, onProgress });
