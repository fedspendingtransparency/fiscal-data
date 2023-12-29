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
  highlighted
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
  const [droppedDown, setDroppedDown] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState(initializeSelectedOption());
  const [optionSelected, setOptionSelected] = useState(selectedOption || initializeSelectedOption());
  
  useEffect(() => {
    setOptionSelected(selectedOption || initializeSelectedOption());
  }, [options, selectedOption]);

  const updateSelection = selection => {
    setDroppedDown(false);
    setOptionSelected(selection);
    setHighlightedOption(selection)
    changeHandler(selection);
  };

  const toggleDropdown = () => {
    setDroppedDown(!droppedDown);
  };

  const handleMouseEnter = option => {
    setHighlightedOption(option);
  }
  const handleMouseLeave = () => {
    setHighlightedOption(selectedOption);
  }

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
      const isHighLighted = option === highlightedOption;
      return (
        <li key={option.value} className={classNames({ [selector_nestedOption]: true })}>
          <button
            className={classNames([selector_optionButton, {highlighted : isHighLighted}, {'selector_optionSelected' : isSelectedOption}])}
            onClick={() => updateSelection(option)}
            onMouseEnter={() => handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
        className={`${nested_selector_container} ${className ? className : ''} ${droppedDown ? dropdown_open : ''}`}
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
          aria-label={selectedOption ? `Select ${selectedOption.label}` : `Select ${optionSelected.label}`}
          onClick={toggleDropdown}
        >
          <div className={labels} title={optionSelected ? optionSelected.label : ''}>
            {optionSelected ? optionSelected.label : ''}
          </div>
          <FontAwesomeIcon icon={droppedDown ? faChevronUp : faChevronDown} size="sm" className={icon} />
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
