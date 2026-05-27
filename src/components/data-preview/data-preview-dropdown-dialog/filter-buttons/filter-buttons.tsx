import React, { FunctionComponent } from 'react';
import { applyButton, buttonContainer, cancelButton, checkIcon } from './filter-buttons.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

interface IFilterButtons {
  handleApply: () => void;
  handleCancel: () => void;
}

const FilterButtons: FunctionComponent<IFilterButtons> = ({ handleApply, handleCancel, ariaLabel, applyDisabled }) => {
  return (
    <div className={buttonContainer}>
      <button className={cancelButton} onClick={handleCancel}>
        Cancel
      </button>
      <button className={applyButton} onClick={handleApply} aria-label={ariaLabel} disabled={applyDisabled}>
        <FontAwesomeIcon icon={faCheck} className={checkIcon} />
        Apply
      </button>
    </div>
  );
};

export default FilterButtons;
