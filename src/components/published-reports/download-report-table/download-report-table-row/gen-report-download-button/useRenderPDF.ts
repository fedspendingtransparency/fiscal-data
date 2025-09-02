import { useEffect } from 'react';
import { useAsync } from 'react-use';
import { renderPDF } from './workers';
import type { WorkerType } from './workers/pdf.worker';

export const useRenderPDF = ({ report }: Parameters<WorkerType['renderPDFInWorker']>[0]) => {
  const {
    value: url,
    loading,
    error,
  } = useAsync(async () => {
    console.log('here now.....');
    return renderPDF({ report });
  }, [report]);

  useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url]);
  return { url, loading, error };
};
