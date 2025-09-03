import { wrap } from 'comlink';

const pdfWorker = typeof window !== 'undefined' ? wrap(new Worker(new URL('./pdf.worker.js', import.meta.url))) : null;
// void pdfWorker.onProgress(proxy((...args) => console.log(...args)));

export const renderPDF = pdfWorker?.renderPDFInWorker;
