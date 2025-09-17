import { useMemo, useRef, useState } from 'react';
import { renderPDF } from '../../../../workers/pdfWorker';
import { useAsync } from 'react-use';

export const useRenderPDF = report => {
  const workerRef = useRef(null);
  const [res, setRes] = useState({});

  useMemo(async () => {
    if (!workerRef.current) {
      workerRef.current = renderPDF;
      const test = await workerRef.current.renderPDFInWorker({ report });
      console.log('??', test);
      setRes(test);
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null; // Clear the ref
      }
    };
  }, []);

  const { value, loading, error } = useAsync(async () => {
    console.log('generating pdf*******************');
    return renderPDF({ report });
  }, [report]);

  useMemo(() => {
    if (res) {
      const { value } = res;

      return value ? () => URL.revokeObjectURL(value) : undefined;
    }
  }, [res]);
  return res;
};
