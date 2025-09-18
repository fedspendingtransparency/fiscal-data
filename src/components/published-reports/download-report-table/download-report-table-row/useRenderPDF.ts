import { useEffect } from 'react';
import { renderPDF } from '../../../../workers/pdfWorker';
import { useAsync } from 'react-use';

export const useRenderPDF = report => {
  const { value: url, loading, error } = useAsync(async () => {
    return renderPDF({ report });
  }, [report]);

  useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url]);
  return { url, loading, error };
};
