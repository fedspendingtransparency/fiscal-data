import React, { FunctionComponent } from 'react';
import { redirectModalContainer, externalLink, titleText, explanation, directions, linkContainer } from './redirect-modal.module.scss';

import ModalComponent from '../modal/modal';

type RedirectModalProps = {
  isOpen: boolean;
  url: string;
  onClose: () => void;
  onProceed: () => void;
};

const RedirectModal: FunctionComponent<RedirectModalProps> = ({ isOpen, url, onClose, onProceed }) => {
  if (!isOpen) return null;
  console.log('pop pop');
  return (
    <ModalComponent open={isOpen} onClose={onClose}>
      <div className={redirectModalContainer}>
        <div className={titleText}>You’re leaving a Federal Government website.</div>

        <div className={explanation}>
          You’re going to a website that is not managed or controlled by the Federal Government. Its privacy policies may differ from ours.
        </div>

        <div className={directions}>Click this link to go to the website you have selected.</div>
        <div className={linkContainer}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={externalLink} onClick={onProceed}>
            {url}
          </a>
        </div>
      </div>
    </ModalComponent>
  );
};

export default RedirectModal;
