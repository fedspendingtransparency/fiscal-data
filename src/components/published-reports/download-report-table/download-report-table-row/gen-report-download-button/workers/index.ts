import { proxy, wrap } from 'comlink';
import type { WorkerType } from './pdf.worker';

const pdfWorker = wrap<WorkerType>(
  new Worker(new URL("./pdf.worker.ts", import.meta.url)),
);
void pdfWorker.onProgress(proxy((...args) => console.log(...args)));

export const renderPDF = pdfWorker.renderPDFInWorker;
