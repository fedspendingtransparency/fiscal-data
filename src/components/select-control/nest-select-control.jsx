import React, { useState, useEffect } from 'react';
import {
  selector_label,
  selector_nestedOption,
  selector_optionSelected,
  selector_optionButton,
  nested_selector_container,
  nested_selector_button,
  labels,
  nested_selector_list,
  icon,
  yearTitle,
  dropdown_open,
} from './select-control.module.scss';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export const ariaLabeler = (selectedOptionLabel, ariaLabel, label) => {
  // if ariaLabel is set, use it. if not use the label. Otherwise, use default text.
  const ariaLabelText = ariaLabel ? ariaLabel : label ? label : 'selection';
  return `Change ${ariaLabelText} from ${selectedOptionLabel}`;
};

const NestSelectControl = ({ label, options, selectedOption, changeHandler, className }) => {
  const [droppedDown, setDroppedDown] = useState(false);
  const [optionSelected, setOptionSelected] = useState(selectedOption);

  useEffect(() => {
    setOptionSelected(selectedOption);
  }, [options, selectedOption]);

  const updateSelection = selection => {
    setDroppedDown(false);
    setOptionSelected(selection);
    changeHandler(selection);
  };

  const toggleDropdown = () => {
    setDroppedDown(!droppedDown);
  };

  let timeOutId;
  const onBlurHandler = () => {
    timeOutId = setTimeout(() => {
      setDroppedDown(false);
    });
  };

  const onFocusHandler = () => {
    clearTimeout(timeOutId);
  };

  const renderOption = (option, isYear = false) => {
    if (isYear) {
      return (
        <li key={option.value} className={yearTitle}>
          {option.label}
        </li>
      );
    } else {
      const isSelectedOption = option.label === optionSelected.label && option.value === optionSelected.value;
      return (
        <li key={option.value} className={`${selector_nestedOption} ${isYear ? yearTitle : ''} ${isSelectedOption ? selector_optionSelected : ''}`}>
          <button
            className={classNames([selector_optionButton, isSelectedOption ? selector_optionSelected : ''])}
            onClick={() => updateSelection(option)}
          >
            {option.label}
          </button>
        </li>
      );
    }
  };

  return (
    <>
      {label && <label className={selector_label}>{label}</label>}
      <div
        className={`${nested_selector_container} ${className ? className : ''}`}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        role="presentation"
      >
        <button
          name="dropdownToggle"
          data-testid="toggle-button"
          className={classNames([nested_selector_button, droppedDown ? dropdown_open : ''])}
          aria-haspopup="true"
          aria-expanded={droppedDown}
          aria-label={selectedOption ? `Select ${selectedOption.label}` : `Select ${optionSelected.label}`}
          onClick={toggleDropdown}
        >
          <div className={labels} title={optionSelected ? optionSelected.label : ''}>
            {optionSelected ? optionSelected.label : ''}
          </div>
          <FontAwesomeIcon icon={droppedDown ? faChevronUp : faChevronDown} size="sm" className={icon} />
        </button>
        {droppedDown && (
          <ul className={`${nested_selector_list} selectControlList`} data-testid="selectorList" role="presentation">
            {options.map(option => (
              <React.Fragment key={option.value}>
                {renderOption(option, true)}
                {option.children && option.children.map(child => renderOption(child))}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
export default NestSelectControl;
