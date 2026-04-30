import React, { FunctionComponent } from 'react';
import { redirectModalState } from '../redirect-modal-helper';
import RedirectModal from '../redirect-modal';

const RedirectModalRenderer: FunctionComponent = () => {
  const { open, url, after } = redirectModalState(state => state.modal);
  const setModal = redirectModalState(state => state.setModal);
  if (!open) return null;
  const close = () => setModal(prev => ({ ...prev, open: false }));
  const proceed = () => {
    after?.();
    close();
  };
  return <RedirectModal isOpen={open} url={url} onClose={close} onProceed={proceed} />;
};
export default RedirectModalRenderer;
