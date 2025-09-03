import { wrap } from 'comlink';

const pdfWorker = wrap(new Worker(new URL('./pdf.worker.js', import.meta.url)));
// void pdfWorker.onProgress(proxy((...args) => console.log(...args)));

export const renderPDF = pdfWorker;
