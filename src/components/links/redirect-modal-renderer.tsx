import React, { FunctionComponent } from 'react';
import { useRecoilState } from 'recoil';
import { redirectModalState } from './redirect-modal-helper';
import RedirectModal from './redirect-modal';

const RedirectModalRenderer: FunctionComponent = () => {
  const [{ open, url, after }, setModal] = useRecoilState(redirectModalState);
  if (!open) return null;
  const close = () => setModal(set => ({ ...set, open: false }));
  const proceed = () => {
    after?.();
    close();
  };
  return <RedirectModal isOpen={open} url={url} onClose={close} onProceed={proceed} />;
};
export default RedirectModalRenderer;
