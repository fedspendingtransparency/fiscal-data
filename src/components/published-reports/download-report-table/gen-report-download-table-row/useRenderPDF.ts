import { useEffect } from 'react';
import { renderPDF } from '../../../../workers/pdfWorker';
import { useAsync } from 'react-use';

export const useRenderPDF = report => {
  const { value, loading, error } = useAsync(async () => {
    return renderPDF({ report });
  }, [report]);

  useEffect(() => {
    return () => {
      const urls = value?.url;
      const revoke = typeof window !== 'undefined' ? window.URL?.revokeObjectURL : undefined;
      if (typeof revoke === 'function' && typeof urls === 'string' && urls.startsWith('blob')) {
        revoke(urls);
      }
    };
  }, [value]);
  return { value, loading, error };
};
