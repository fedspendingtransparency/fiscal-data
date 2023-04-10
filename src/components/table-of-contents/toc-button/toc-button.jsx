import React from 'react';
import {
  cancelButton,
  container,
  floatingToggle,
  toggleButton
} from './toc-button.module.scss';

/**
 *
 * @param props
 * @returns {*} - Returns a floating toggle button that is visible for mobile and tablet devices.
 */
const TOCButton = ({ state, handleToggle }) => {
  const tocIsOpen = state;

  return (
    <div className={floatingToggle}>
      <div className={container}>
        <button
          className={`${toggleButton} ${!tocIsOpen ? '' : cancelButton}`}
          onClick={(event) => handleToggle && handleToggle(event)}
        >
          {tocIsOpen ? 'Cancel' : 'Table of Contents'}
        </button>
      </div>
    </div>
  )
};
export default TOCButton;
