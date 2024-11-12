import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { datePickerButton, glow, publishedDateLabel, labelIcon, buttonContent, selectedOptionText } from './dropdown-label-button.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface IDropdownLabelButton {
  label: string;
  selectedOption: string;
  icon: IconDefinition;
  setActive: (activeState: boolean) => void;
  active: boolean;
  ariaLabel?: string;
}

const DropdownLabelButton: FunctionComponent<IDropdownLabelButton> = ({
  label = '',
  selectedOption = '',
  icon,
  setActive,
  active,
  ariaLabel,
}: IDropdownLabelButton) => {
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
