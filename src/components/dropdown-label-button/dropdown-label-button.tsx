import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { datePickerButton, glow, publishedDateLabel, labelIcon, buttonContent, selectedOptionText } from './dropdown-label-button.module.scss';

interface IDropdownLabelButton {
  label?: string;
  selectedOption: string;
  icon?: IconDefinition;
  setActive: (activeState: boolean) => void;
  active: boolean;
  ariaLabel?: string;
  dropdownWidth?: string;
}

const DropdownLabelButton: FunctionComponent<IDropdownLabelButton> = ({
  label = '',
  selectedOption = '',
  icon,
  setActive,
  active,
  ariaLabel,
  dropdownWidth = '20rem',
  disabled,
}: IDropdownLabelButton) => {
  return (
    <>
      <div className={active ? glow : null}>
        <button
          style={{ width: dropdownWidth }}
          className={datePickerButton}
          onClick={() => setActive(!active)}
          aria-label={ariaLabel}
          disabled={disabled}
        >
          <div className={buttonContent}>
            {icon && <FontAwesomeIcon icon={icon} className={labelIcon} />}
            {label && <span className={publishedDateLabel}>{label}: </span>}
            <span className={selectedOptionText}>{selectedOption}</span>
          </div>
          <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
        </button>
      </div>
    </>
  );
};

export default DropdownLabelButton;
