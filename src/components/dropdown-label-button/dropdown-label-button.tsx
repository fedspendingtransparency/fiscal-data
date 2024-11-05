import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { datePickerButton, glow, publishedDateLabel, labelIcon } from './dropdown-label-button.module.scss';

const DropdownLabelButton = ({ label = '', selectedOption = '', icon, setActive, active }) => {
  return (
    <>
      <div className={active ? glow : null}>
        <button className={datePickerButton} onClick={() => setActive(!active)} aria-label="Select Published Report Date">
          <div>
            <FontAwesomeIcon icon={icon} className={labelIcon} />
            <span className={publishedDateLabel}>{label}: </span>
            <span>{selectedOption}</span>
          </div>
          <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
        </button>
      </div>
    </>
  );
};

export default DropdownLabelButton;
