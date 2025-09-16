import { renderPDF } from '../../../../workers/pdfWorker';
import { useAsync } from 'react-use';
import { useEffect } from 'react';

export const useRenderPDF = report => {
  const { value, loading, error } = useAsync(async () => {
    return renderPDF({ report });
  }, [report]);

  useEffect(() => (value ? () => URL.revokeObjectURL(value) : undefined), [value]);
  return { value, loading, error };
};
