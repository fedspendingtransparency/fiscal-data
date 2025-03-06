import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

export const RecoilObserver = ({ node, onChange }) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
