import { renderPDF } from '../../../../workers/pdfWorker';
import { useAsync } from 'react-use';
import { useMemo } from 'react';

export const useRenderPDF = report => {
  const { value, loading, error } = useAsync(async () => {
    console.log('generating pdf*******************');
    return renderPDF({ report });
  }, [report]);

  useMemo(() => (value ? () => URL.revokeObjectURL(value) : undefined), [value]);
  return { value, loading, error };
};
