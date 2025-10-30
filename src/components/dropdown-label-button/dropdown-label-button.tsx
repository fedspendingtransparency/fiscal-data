import React, { FunctionComponent, ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import {
  backgroundHighlight,
  buttonContent,
  buttonEnabled,
  dropdownButton,
  glow,
  labelIcon,
  muiButtonContent,
  publishedDateLabel,
  selectedOptionText,
} from './dropdown-label-button.module.scss';

interface IDropdownLabelButton {
  label?: string;
  selectedOption: string;
  icon?: IconDefinition;
  muiIcon?: ReactElement;
  setActive: (activeState: boolean) => void;
  active: boolean;
  ariaLabel?: string;
  dropdownWidth?: string;
  name?: string;
  filtersAreSelected?: boolean;
}

const DropdownLabelButton: FunctionComponent<IDropdownLabelButton> = ({
  label = '',
  selectedOption = '',
  icon,
  muiIcon,
  setActive,
  active,
  ariaLabel,
  dropdownWidth = '20rem',
  disabled,
  name,
  filtersAreSelected,
}: IDropdownLabelButton) => {
  return (
    <>
      <div className={`${active ? glow : null} ${filtersAreSelected ? backgroundHighlight : null}`}>
        <button
          style={{ width: dropdownWidth }}
          className={`${dropdownButton} ${buttonEnabled}`}
          onClick={() => setActive(!active)}
          aria-label={ariaLabel}
          disabled={disabled}
          name={name}
        >
          <div className={buttonContent + (muiIcon ? ` ${muiButtonContent}` : '')}>
            {(icon && <FontAwesomeIcon icon={icon} className={labelIcon} />) || (React.isValidElement(muiIcon) && muiIcon)}
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
