import React, { useState } from 'react';
import {
  icon,
  labels,
  selector_button,
  selector_container,
  selector_label,
  selector_list,
  selector_option,
  selector_optionButton,
  selector_optionSelected,
} from './select-control.module.scss';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export const ariaLabeler = (selectedOptionLabel, ariaLabel, label) => {
  // if ariaLabel is set, use it. if not use the label. Otherwise, use default text.
  const ariaLabelText = ariaLabel ? ariaLabel : label ? label : 'selection';
  return `Change ${ariaLabelText} from ${selectedOptionLabel}`;
};

const SelectControl = ({ label, options, selectedOption, ariaLabel, changeHandler, showAll, optionLabelKey, className }) => {
  const labelKey = optionLabelKey ? optionLabelKey : 'label';

  const [droppedDown, setDroppedDown] = useState(false);
  const updateSelection = selection => () => {
    setDroppedDown(false);
    changeHandler(selection);
  };

  const optionSelected = selectedOption || options[0];

  let timeOutId;

  /* accessibility enabling event handlers for interpreting focus state on control */
  const onBlurHandler = () => {
    timeOutId = setTimeout(() => {
      setDroppedDown(false);
    });
  };

  const onFocusHandler = () => {
    clearTimeout(timeOutId);
  };

  const toggleDropdown = () => {
    setDroppedDown(!droppedDown);
  };

  return (
    <>
      {label && <label className={selector_label}>{label}</label>}
      <div className={`${selector_container} ${className ? className : ''}`} onBlur={onBlurHandler} onFocus={onFocusHandler} role="presentation">
        <button
          name="dropdownToggle"
          data-testid="toggle-button"
          className={selector_button}
          aria-haspopup="true"
          aria-expanded={droppedDown}
          aria-label={ariaLabeler(optionSelected[labelKey], ariaLabel, label)}
          onClick={toggleDropdown}
          title={optionSelected[labelKey]}
        >
          <div className={labels}>{optionSelected[labelKey]}</div>
          <FontAwesomeIcon icon={faChevronDown} size="sm" className={icon} />
        </button>
        {droppedDown && (
          <ul className={`${selector_list} selectControlList`} data-testid="selectorList">
            {options.map((option, index) => {
              const colName = option.columnName;
              const isSelectedOption = option === optionSelected || (colName && optionSelected.columnName && colName === optionSelected.columnName);
              return (
                <React.Fragment key={`${colName}-${index}`}>
                  {(!option.hideable || showAll) && (
                    <li className={selector_option}>
                      <button
                        data-testid="selector-option"
                        className={classNames([selector_optionButton, isSelectedOption ? selector_optionSelected : ''])}
                        onClick={updateSelection(option)}
                      >
                        {option[labelKey]}
                      </button>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};
export default SelectControl;
