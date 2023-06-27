import React, {useEffect, useRef, useState} from 'react';
import * as styles from '../../select-control/select-control.module.scss';
import { filterYearOptions } from '../../published-reports/util/util';
import useOnClickOutside from 'use-onclickoutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Analytics from "../../../utils/analytics/analytics";

import {
  activeDropdown,
  dropdownInput,
  dropdownInputContainer,
  hoverContainer,
  activeSearchBar, dropdownIcon,
} from './combo-currency-select.module.scss';
import ComboSelectDropdown from './combo-select-dropdown/combo-select-dropdown';


const XRAnalyticsHandler = (action, label) => {
  if(action && label){
    Analytics.event({
      category: "Exchange Rates Converter",
      action: action,
      label: label
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': action,
      'eventLabel': label,
    });
  }
};

const ComboCurrencySelect = (
  {
    options,
    changeHandler,
    optionLabelKey = 'label',
    selectedOption,
    yearFilter = false,
    label,
    labelClass = '',
    labelDisplay,
    required = false,
    disabledMessage,
    isExchangeTool,
    resetFilterCount
  }) => {
  const [filterCharacters, setFilterCharacters] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
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
    if (labelDisplay) {
      setFilterCharacters(selection.label);
    }
    setTimeout(() => {setDropdownActive(false);});
  };

  let timeOutId;

  // Prevent NAN pasted values like .3.2 or --1, etc. since neither keyPress nor onChange can be
  // reliably expected to fire in those cases.
  const restrictKeyPress = (event) => {
    // Extend browser behavior for numeric field preventing the field from echoing '.-+' or
    // digits beyond 4
    if (event.key && !(/\d/.test(event.key))) {
      event.preventDefault();
    }
  };

  // The above restrictKeyPress() isn't fully redundant with this function because when valid
  // number is made NAN by keyboard entry this function would have the effect of blanking the
  // whole field, but the keyPress intercepts that character before the value becomes NAN. So,
  // if a user types '201-' the result is '201' but would be '' without the onKeyPress
  // method. It's also not sufficient to place this sanitizing logic in the onChange method,
  // because onChange doesn't fire when the entry is NAN due to browser validation of numeric
  // input fields.
  const restrictInput = (event) => {
    if (yearFilter) {
      event.target.value = event.target.value.replace(/[^\d]/g, '').substr(0, 4);
    }
  };

  const toggleDropdown = () => {
    if (dropdownActive) {
      onBlurHandler();
    } else {
      clearTimeout(timeOutId);
      setDropdownActive(true);
      setInputFocus();
    }
  }
  /* accessibility-enabling event handlers for interpreting focus state on control */
  const onBlurHandler = (event) => {
    if (((!event || !(event.target.parentElement.contains(event.relatedTarget)))) && !mouseOverDropdown) {
      timeOutId = setTimeout(() => {
        if (selectedOption && selectedOption.value) {
          if (isExchangeTool) {
            setFilterCharacters(selectedOption.label)
          }
          else {
            setFilterCharacters(selectedOption.value);
          }
        }
        setDropdownActive(false);
      });
    }
  };

  const onFocusHandler = () => {
    clearTimeout(timeOutId);
  };

  const onBlurAnalyticsHandler = (event) => {
    if(isExchangeTool && !event.target.parentElement.contains(event.relatedTarget)){
      // XRAnalyticsHandler('Foreign Country-Currency Search', event.target.value);
    }
  };

  const ref = React.useRef(null)
  useOnClickOutside(ref, onBlurHandler)

  useEffect(() => {
    if (selectedOption && selectedOption.value) {
      if (isExchangeTool) {
        setFilterCharacters(selectedOption.label)
      }
      else {
        setFilterCharacters(selectedOption.value);
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    if (resetFilterCount) {
      setFilterCharacters('');
    }
  }, [resetFilterCount]);

  const filterOptionsByEntry = (opts, entry) => {
    let filteredList = opts;
    if (entry?.length) {
      filteredList = opts.filter(opt => opt.label.toUpperCase().includes(entry.toUpperCase()));
    }
    return filteredList;
  };

  const clearFilter = () => {
    changeHandler(null);
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: ''
      }
    })
  };

  const onFilterChange = (event) => {
    const val = (event && event.target) ? event.target.value : '';
    setFilterCharacters(val);
    const localFilteredOptions = yearFilter ?
      filterYearOptions(options, val) :
      filterOptionsByEntry(options, val);
    setFilteredOptions(localFilteredOptions);
    if (localFilteredOptions.length === 1
      && (localFilteredOptions[0].value
        && localFilteredOptions[0].value.toString() === val)) {
      updateSelection(localFilteredOptions[0], false);
    } else {
      clearTimeout(timeOutId);
      setDropdownActive(true);
    }
  };

  const labelText = yearFilter ?
    `Year (${options[options.length -1].label} - ${options[0].label})` :
    label;

  const dropdownStyle = () => {
    let containerClasses;
    if (dropdownActive) {
      if (searchBarActive) {
        containerClasses = `${dropdownInputContainer} ${activeSearchBar}`;
      } else {
        containerClasses = `${dropdownInputContainer} ${activeDropdown}`;
      }
    } else {
      containerClasses = `${dropdownInputContainer} ${hoverContainer}`;
    }
    return containerClasses;
  }

  return (
    <>
      <div className={styles.selector_container} role="presentation">
        {labelText !== '' ?
          <div className={`${styles.selector_label} ${labelClass}`} data-testid="label">
            {labelText}
            {required && (<span className="required">*</span>)}
          </div> : null
        }
        <div ref={ref} onFocus={onFocusHandler} role="presentation">
          <div className={dropdownStyle()}>
            <button
              className={ dropdownInput }
              onClick={toggleDropdown}
            >
              {selectedOption.label}
              <div className={dropdownIcon}>
                {dropdownActive ? (
                  <FontAwesomeIcon icon={faChevronUp} data-testid="collapse-dropdown" aria-label="collapse dropdown" />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} data-testid="expand-dropdown" aria-label="expand dropdown" />
                )}
              </div>
            </button>
          </div>
        </div>
        <ComboSelectDropdown
          active={dropdownActive}
          onBlurHandler={onBlurHandler}
          setMouseOverDropdown={setMouseOverDropdown}
          filteredOptions={filteredOptions}
          selectedOption={selectedOption}
          updateSelection={updateSelection}
          required={required}
          disabledMessage={disabledMessage}
          optionLabelKey={optionLabelKey}
          filter={filterCharacters}
          onChange={onFilterChange}
          onClear={clearFilter}
          searchBarActive={searchBarActive}
          setSearchBarActive={setSearchBarActive}
        />
      </div>
    </>
  );
}

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current &&  htmlElRef.current.focus();
  }

  return [ htmlElRef, setFocus ];
}

export default ComboCurrencySelect;
