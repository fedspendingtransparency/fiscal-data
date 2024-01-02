import React from 'react';
import { Backdrop, Fade, Modal } from '@material-ui/core';
import { modal, content, slideIn, slideOut } from './modal.module.scss';

/**
 *
 * @param open {Boolean}
 * @param onClose {Function}
 * @param disableBackdropClick {Boolean} - if true, clicking on the backdrop won't close the modal
 * @param disableEscapeKey {Boolean} - if true, pressing the Esc key will not close the modal
 * @param contentClass {Object} - class to be applied to the content container
 */

const ModalComponent = ({ open = false, onClose, disableBackdropClick, disableEscapeKey, contentClass, children }) => (
  <Modal
    open={open}
    onClose={onClose}
    className={modal}
    data-testid="modal"
    disableBackdropClick={disableBackdropClick}
    disableEscapeKeyDown={disableEscapeKey}
    BackdropComponent={Backdrop}
    BackdropProps={{
      'data-testid': 'backdrop',
      timeout: 500,
    }}
    closeAfterTransition
  >
    <Fade in={open} timeout={500}>
      <div className={`${content} ${contentClass} ${open ? slideIn : slideOut}`} data-testid="content">
        {children}
      </div>
    </Fade>
  </Modal>
);

export default ModalComponent;
