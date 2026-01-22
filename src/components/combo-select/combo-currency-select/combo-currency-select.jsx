import React, { useRef, useState } from 'react';
import { selector_label } from '../../select-control/select-control.module.scss';
import useOnClickOutside from 'use-onclickoutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { analyticsHandler } from '../../../helpers/currency-exchange-rates-converter/currency-exchange-rates-converter-helper';

import {
  activeDropdown,
  dropdownInput,
  dropdownInputContainer,
  hoverContainer,
  activeSearchBar,
  dropdownIcon,
  fullBorderContainer,
  dropdownInputWeight,
  selectedText,
  icon,
  dropdownContainer,
} from './combo-currency-select.module.scss';
import ComboSelectDropdown from './combo-select-dropdown/combo-select-dropdown';
import classNames from 'classnames';

let timeOutId;

const ComboCurrencySelect = ({
  options,
  changeHandler,
  optionLabelKey = 'label',
  selectedOption,
  yearFilter = false,
  label = '',
  labelClass = '',
  required = false,
  disabledMessage,
  isExchangeTool,
  containerBorder,
  searchBarLabel = 'Search currencies',
  hasChildren = false,
}) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [inputRef, setInputFocus] = useFocus();
  const [searchBarActive, setSearchBarActive] = useState(false);

  const updateSelection = (selection, sendGA) => {
    if (isExchangeTool && sendGA) {
      analyticsHandler('Foreign Country-Currency Selected', selection[optionLabelKey]);
    }
    changeHandler(selection);
    setDropdownActive(false);
    setTimeout(() => {
      setDropdownActive(false);
    });
  };

  const toggleDropdown = () => {
    if (dropdownActive) {
      timeOutId = setTimeout(() => {
        setDropdownActive(false);
      });
    } else {
      clearTimeout(timeOutId);
      setDropdownActive(true);
      setInputFocus();
    }
  };
  /* accessibility-enabling event handlers for interpreting focus state on control */
  const onBlurHandler = event => {
    if (event) {
      const mouseEvent = event.type !== 'blur';
      if (mouseEvent && !event.target?.parentElement?.contains(event.relatedTarget)) {
        setDropdownActive(false);
      }
    }
  };

  const onFocusHandler = () => {
    clearTimeout(timeOutId);
  };

  const onBlurAnalyticsHandler = event => {
    if (isExchangeTool && event && event.target?.value) {
      analyticsHandler('Foreign Country-Currency Search', event.target.value);
    }
  };

  const ref = React.useRef(null);
  useOnClickOutside(ref, onBlurHandler);

  const labelText = yearFilter ? `Year (${options[options.length - 1][optionLabelKey]} - ${options[0][optionLabelKey]})` : label;

  const dropdownStyle = () => {
    let containerClasses;
    if (dropdownActive) {
      if (searchBarActive) {
        containerClasses = `${dropdownInputContainer} ${activeSearchBar}`;
      } else {
        containerClasses = `${dropdownInputContainer} ${activeDropdown}`;
      }
    } else {
      if (containerBorder) {
        containerClasses = `${dropdownInputContainer} ${hoverContainer} ${fullBorderContainer}`;
      } else {
        containerClasses = `${dropdownInputContainer} ${hoverContainer}`;
      }
    }
    return containerClasses;
  };

  return (
    <>
      <div ref={ref} role="presentation" className={dropdownContainer}>
        {labelText !== '' ? (
          <div className={`${selector_label} ${labelClass}`} data-testid="label" id={labelText + 'dropdown'}>
            {labelText}
            {required && <span className="required">*</span>}
          </div>
        ) : null}
        <div onFocus={onFocusHandler} role="presentation">
          <div className={dropdownStyle()} data-testid="dropdown-button-container">
            <button
              className={classNames([dropdownInput, !isExchangeTool ? dropdownInputWeight : null])}
              onClick={toggleDropdown}
              data-testid="dropdownToggle"
              title={selectedOption[optionLabelKey]}
              aria-labelledby={labelText + 'dropdown'}
            >
              <div className={selectedText}>{selectedOption[optionLabelKey]}</div>
              <div className={dropdownIcon}>
                {dropdownActive ? (
                  <FontAwesomeIcon className={icon} icon={faChevronUp} aria-label="collapse dropdown" />
                ) : (
                  <FontAwesomeIcon className={icon} icon={faChevronDown} aria-label="expand dropdown" data-testid="expand-dropdown" />
                )}
              </div>
            </button>
          </div>
        </div>
        <ComboSelectDropdown
          active={dropdownActive}
          setDropdownActive={setDropdownActive}
          dropdownOnBlurHandler={onBlurHandler}
          searchBarOnBlurHandler={onBlurAnalyticsHandler}
          selectedOption={selectedOption}
          updateSelection={updateSelection}
          required={required}
          disabledMessage={disabledMessage}
          optionLabelKey={optionLabelKey}
          searchBarActive={searchBarActive}
          setSearchBarActive={setSearchBarActive}
          inputRef={inputRef}
          options={options}
          yearFilter={yearFilter}
          changeHandler={changeHandler}
          timeOutId={timeOutId}
          searchBarLabel={searchBarLabel}
          hasChildren={hasChildren}
        />
      </div>
    </>
  );
};

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

export default ComboCurrencySelect;
