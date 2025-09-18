import { useEffect } from 'react';
import { renderPDF } from '../../../../workers/pdfWorker';
import { useAsync } from 'react-use';

export const useRenderPDF = report => {
  const { value, loading, error } = useAsync(async () => {
    return renderPDF({ report });
  }, [report]);

  useEffect(() => (value ? () => URL.revokeObjectURL(value?.url) : undefined), [value]);
  return { value, loading, error };
};
