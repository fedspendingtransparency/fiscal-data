import React from 'react';
import { Fade, Modal } from '@mui/material';
import { content, modal, slideIn, slideOut } from './modal.module.scss';

/**
 *
 * @param open {Boolean}
 * @param onClose {Function}
 * @param disableEscapeKey {Boolean} - if true, pressing the Esc key will not close the modal
 * @param contentClass {Object} - class to be applied to the content container
 */

const ModalComponent = ({ open = false, onClose, disableEscapeKey, contentClass, children }) => (
  <Modal open={open} onClose={onClose} className={modal} data-testid="modal" disableEscapeKeyDown={disableEscapeKey} closeAfterTransition>
    <Fade in={open} timeout={500}>
      <div className={`${content} ${contentClass} ${open ? slideIn : slideOut}`} data-testid="content">
        {children}
      </div>
    </Fade>
  </Modal>
);

export default ModalComponent;
