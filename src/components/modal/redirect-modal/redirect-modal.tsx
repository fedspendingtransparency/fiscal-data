import React, { FunctionComponent } from 'react';
import {
  closeButton,
  directions,
  explanation,
  externalLink,
  icon,
  iconTriangle,
  linkContainer,
  redirectBody,
  redirectContentOverride,
  redirectModalContainer,
  titleContainer,
  titleText,
  topBar,
} from './redirect-modal.module.scss';

import ModalComponent from '../modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

type RedirectModalProps = {
  isOpen: boolean;
  url: string;
  onClose: () => void;
  onProceed: () => void;
};

const RedirectModal: FunctionComponent<RedirectModalProps> = ({ isOpen, url, onClose, onProceed }) => {
  if (!isOpen) return null;
  return (
    <ModalComponent open={isOpen} onClose={onClose} contentClass={redirectContentOverride}>
      <div className={redirectModalContainer}>
        <div className={topBar}>
          <button className={closeButton} aria-label="Close modal" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className={icon} />
          </button>
        </div>
        <div className={redirectBody}>
          <div className={titleContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={iconTriangle} />
            <div className={titleText}>You’re leaving a Federal Government website.</div>
          </div>

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
      </div>
    </ModalComponent>
  );
};

export default RedirectModal;
