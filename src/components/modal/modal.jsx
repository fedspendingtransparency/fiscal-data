import React from 'react';
import { Backdrop, Fade, Modal } from '@mui/material';
import { content, modal, slideIn, slideOut } from './modal.module.scss';

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
    onClose={(event, reason) => {
      if (!(disableBackdropClick && reason === 'backdropClick')) {
        onClose(event);
      }
    }}
    className={modal}
    data-testid="modal"
    disableEscapeKeyDown={disableEscapeKey}
    closeAfterTransition
    slotProps={{ backdrop: { 'data-testid': 'backdrop', timeout: 500 } }}
    slots={{ backdrop: Backdrop }}
    sx={{
      zIndex: 1,
    }}
  >
    <Fade in={open} timeout={500}>
      <div className={`${content} ${contentClass} ${open ? slideIn : slideOut}`} data-testid="content">
        {children}
      </div>
    </Fade>
  </Modal>
);

export default ModalComponent;
