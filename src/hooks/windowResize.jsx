import { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};
