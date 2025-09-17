import { wrap } from 'comlink';

const pdfWorker = typeof window !== 'undefined' ? wrap(new Worker(new URL('./pdf.worker.js', import.meta.url))) : null;

export const renderPDF = pdfWorker;
