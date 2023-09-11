import React, { useRef, useState } from 'react';
import {
  selector_container,
  selector_label,
} from '../../select-control/select-control.module.scss';
import useOnClickOutside from 'use-onclickoutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Analytics from '../../../utils/analytics/analytics';

import {
  activeDropdown,
  dropdownInput,
  dropdownInputContainer,
  hoverContainer,
  activeSearchBar,
  dropdownIcon,
  fullBorderContainer,
} from './combo-currency-select.module.scss';
import ComboSelectDropdown from './combo-select-dropdown/combo-select-dropdown';

let timeOutId;

const XRAnalyticsHandler = (action, label) => {
  if (action && label) {
    Analytics.event({
      category: 'Exchange Rates Converter',
      action: action,
      label: label,
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: action,
      eventLabel: label,
    });
  }
};

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
}) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [inputRef, setInputFocus] = useFocus();
  const [mouseOverDropdown, setMouseOverDropdown] = useState(false);
  const [searchBarActive, setSearchBarActive] = useState(false);

  const updateSelection = (selection, sendGA) => {
    if (isExchangeTool && sendGA) {
      XRAnalyticsHandler('Foreign Country-Currency Selected', selection.label);
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
      const mouseEvent = event.type !== 'blur' && !mouseOverDropdown;
      if (
        mouseEvent &&
        !event.target?.parentElement.contains(event.relatedTarget)
      ) {
        timeOutId = setTimeout(() => {
          setDropdownActive(false);
        });
      }
    }
  };

  const onFocusHandler = () => {
    clearTimeout(timeOutId);
  };

  const onBlurAnalyticsHandler = event => {
    if (
      isExchangeTool &&
      event &&
      !event.target.parentElement.contains(event.relatedTarget)
    ) {
      XRAnalyticsHandler('Foreign Country-Currency Search', event.target.value);
    }
  };

  const ref = React.useRef(null);
  useOnClickOutside(ref, onBlurHandler);

  const labelText = yearFilter
    ? `Year (${options[options.length - 1].label} - ${options[0].label})`
    : label;

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
      <div
        className={selector_container}
        onMouseOver={() => setMouseOverDropdown(true)}
        onMouseLeave={() => setMouseOverDropdown(false)}
        onBlur={() => setMouseOverDropdown(false)}
        onFocus={() => setMouseOverDropdown(true)}
        role="presentation"
      >
        {labelText !== '' ? (
          <div
            className={`${selector_label} ${labelClass}`}
            data-testid="label"
          >
            {labelText}
            {required && <span className="required">*</span>}
          </div>
        ) : null}
        <div ref={ref} onFocus={onFocusHandler} role="presentation">
          <div
            className={dropdownStyle()}
            data-testid="dropdown-button-container"
          >
            <button className={dropdownInput} onClick={toggleDropdown}>
              {selectedOption?.label}
              <div className={dropdownIcon}>
                {dropdownActive ? (
                  <FontAwesomeIcon
                    icon={faChevronUp}
                    data-testid="collapse-dropdown"
                    aria-label="collapse dropdown"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    data-testid="expand-dropdown"
                    aria-label="expand dropdown"
                  />
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
          setMouseOverDropdown={setMouseOverDropdown}
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
