import React, { useState } from "react";
import * as styles from "./select-control.module.scss";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

export const ariaLabeler = (selectedOptionLabel, ariaLabel, label) => {
  // if ariaLabel is set, use it. if not use the label. Otherwise, use default text.
  const ariaLabelText = ariaLabel ? ariaLabel : (label ? label : 'selection');
  return `Change ${ariaLabelText} from ${selectedOptionLabel}`;
}

const SelectControl = ({
  label,
  options,
  selectedOption,
  ariaLabel,
  changeHandler,
  showAll,
  optionLabelKey,
  className
}) => {

  const labelKey = optionLabelKey ? optionLabelKey : 'label';





  const [droppedDown, setDroppedDown] = useState(false);
  const updateSelection = (selection) => () => {
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
      {label && <label className={styles.selector_label}>{label}</label>}
      <div
        className={`${styles.selector_container} ${className ? className : ''}`}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        role={'presentation'}
      >
        <button
          name="dropdownToggle"
          data-testid={'toggle-button'}
          className={styles.selector_button}
          aria-haspopup="true"
          aria-expanded={droppedDown}
          aria-label={ariaLabeler(optionSelected[labelKey], ariaLabel, label)}
          onClick={toggleDropdown}
        >
          <div className={styles.label} title={optionSelected[labelKey]}>
            {optionSelected[labelKey]}
          </div>
          <FontAwesomeIcon icon={faChevronDown} size="sm" className={styles.icon} />
        </button>
        {droppedDown && (
          <ul className={ `${styles.selector_list} selectControlList` } data-testid="selectorList">
            {options.map((option, index) => {
              const colName = option.columnName;
              const isSelectedOption = option === optionSelected || (
                colName &&
                optionSelected.columnName &&
                colName === optionSelected.columnName
              );

              return (
                <React.Fragment key={`${colName}-${index}`}>
                  {(!option.hideable || showAll) && (
                    <li className={styles.selector_option}>
                      <button
                        data-testid="selector-option"
                        className={classNames([
                          styles.selector_optionButton,
                          isSelectedOption ? styles.selector_optionSelected : ''
                        ])}
                        onClick={updateSelection(option)}
                      >
                        {option[labelKey]}
                      </button>
                    </li>)}
                </React.Fragment>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
};
export default SelectControl;
