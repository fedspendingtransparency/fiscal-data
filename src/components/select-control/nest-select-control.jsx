import React, { useState, useEffect } from 'react';
import { 
  selector_label, 
  selector_nestedOption, 
  selector_optionSelected, 
  selector_optionButton,
  selector_container,
  nested_selector_button,
  labels,
  nested_selector_list,
  icon,
  yearTitle
 } from './select-control.module.scss';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export const ariaLabeler = (selectedOptionLabel, ariaLabel, label) => {
  // if ariaLabel is set, use it. if not use the label. Otherwise, use default text.
  const ariaLabelText = ariaLabel ? ariaLabel : label ? label : 'selection';
  return `Change ${ariaLabelText} from ${selectedOptionLabel}`;
};

const NestSelectControl = ({ label, options, selectedOption, ariaLabel, changeHandler, className }) => {
  const [droppedDown, setDroppedDown] = useState(false);

  const initializeSelectedOption = () => {
    if (options && options.length > 0) {
      const firstOption = options[0];
      if (firstOption.children && firstOption.children.length > 0) {
        return firstOption.children[0];
      }
      return firstOption;
    }
    return null;
  };

  const [optionSelected, setOptionSelected] = useState(selectedOption || initializeSelectedOption());
  
  useEffect(() => {
    setOptionSelected(selectedOption || initializeSelectedOption());
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
      )

    }
    else {
      const colName = option.columnName;
      const isSelectedOption = option === optionSelected || (colName && optionSelected.columnName && colName === optionSelected.columnName);
      return (
        <li key={option.value} className={classNames({ [selector_nestedOption]: true })}>
          <button
            className={classNames([selector_optionButton, isSelectedOption ? selector_optionSelected : selector_optionSelected])}
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
        className={`${selector_container} ${className || ''}`}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        role="presentation"
      >
        <button
          name="dropdownToggle"
          data-testid="toggle-button"
          className={nested_selector_button}
          aria-haspopup="true"
          aria-expanded={droppedDown}
          aria-label={selectedOption ? `Change ${label} from ${selectedOption.label}` : `Select ${label}`}
          onClick={toggleDropdown}
        >
          <div className={labels} title={optionSelected ? optionSelected.label : ''}>
            {optionSelected ? optionSelected.label : ''}
          </div>
          <FontAwesomeIcon icon={faChevronDown} size="sm" className={icon} />
        </button>
        {droppedDown && (
          <ul className={`${nested_selector_list} selectControlList`} data-testid="selectorList">
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
