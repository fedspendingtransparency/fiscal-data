import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { datePickerButton, glow, publishedDateLabel, labelIcon, buttonContent, selectedOptionText } from './dropdown-label-button.module.scss';

const DropdownLabelButton = ({ label = '', selectedOption = '', icon, setActive, active, ariaLabel }) => {
  return (
    <>
      <div className={active ? glow : null}>
        <button className={datePickerButton} onClick={() => setActive(!active)} aria-label={ariaLabel}>
          <div className={buttonContent}>
            <FontAwesomeIcon icon={icon} className={labelIcon} />
            <span className={publishedDateLabel}>{label}: </span>
            <span className={selectedOptionText}>{selectedOption}</span>
          </div>
          <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
        </button>
      </div>
    </>
  );
};

export default DropdownLabelButton;
