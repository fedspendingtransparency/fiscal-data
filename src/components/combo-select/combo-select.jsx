import React, {useEffect, useRef, useState} from 'react';
import { inputContainer, iconButton } from './combo-select.module.scss';
import * as styles from '../select-control/select-control.module.scss';
import { filterYearOptions } from '../published-reports/util/util';
import useOnClickOutside from 'use-onclickoutside';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Analytics from "../../utils/analytics/analytics";


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

export default function ComboSelect(
  {
    options,
    changeHandler,
    optionLabelKey = 'label',
    selectedOption,
    yearFilter = false,
    scrollable,
    label,
    labelClass = '',
    labelDisplay,
    required = false,
    disabledMessage,
    inputStyle,
    iconStyle,
    inputContainerStyle,
    isExchangeTool,
    resetFilterCount
  }) {
  const [filterCharacters, setFilterCharacters] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [droppedDown, setDroppedDown] = useState(false);
  const [inputRef, setInputFocus] = useFocus();
  const [mouseOverDropdown, setMouseOverDropdown] = useState(false);

  const updateSelection = (selection, sendGA) => {
    if(isExchangeTool && sendGA){
      XRAnalyticsHandler('Foreign Country-Currency Selected', selection.label);
    }
    changeHandler(selection);
    if (labelDisplay) {
      setFilterCharacters(selection?.label);
    }
    setTimeout(() => {setDroppedDown(false);});
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
    if (droppedDown) {
      onBlurHandler();
    } else {
      clearTimeout(timeOutId);
      setDroppedDown(true);
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
        setDroppedDown(false);
      });
    }
  };

  const onFocusHandler = () => {
   clearTimeout(timeOutId);
  };

  const onBlurAnalyticsHandler = (event) => {
    if(isExchangeTool && !event.target.parentElement.contains(event.relatedTarget)){
      XRAnalyticsHandler('Foreign Country-Currency Search', event.target.value);
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
    if (filteredList.length === 0) {
      // No options matching ${filterCharacters}
      filteredList = [{label: `No matches. Please revise your search.`, value: null}];
    }
    return filteredList;
  };

  const clear = () => {
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
      setDroppedDown(true);
    }
  };

  const labelText = yearFilter ?
    `Year (${options[options.length -1].label} - ${options[0].label})` :
    label;

  return (
    <div className={styles.selector_container}>
      {labelText !== '' ?
        <div className={`${styles.selector_label} ${labelClass}`} data-testid="label">
          {labelText}
          {required && (<span className="required">*</span>)}
        </div> : null
      }
      <div ref={ref} onFocus={onFocusHandler} role={'presentation'} >
        <div>
          {yearFilter ? (
            <input type="number"
                   className={styles.comboSelectField}
                   onChange={onFilterChange}
                   value={filterCharacters}
                   onFocus={onFilterChange}
                   max={options[0].value}
                   min={options[options.length -1].label}
                   maxLength={4}
                   placeholder={'Enter or select a year'}
                   onKeyPress={restrictKeyPress}
                   onInput={restrictInput}
                   title={'Enter a year'}
                   autoComplete={'off'}
            />
          ):(
            <div className={inputContainerStyle ? inputContainerStyle : inputContainer}>
              <input type="text"
                     className={inputStyle ? inputStyle: `${styles.comboSelectField} ${styles.textField}`}
                     onChange={onFilterChange}
                     value={filterCharacters}
                     onFocus={onFilterChange}
                     onBlur={onBlurAnalyticsHandler}
                     max={options[0].value}
                     min={options[options.length -1].label}
                     placeholder={'Enter or select option'}
                     autoComplete={'off'}
                     ref={inputRef}
                     data-testid={'combo-box'}
              />
                  {(!filterCharacters || !(filterCharacters.length > 0))
                  ? (
                      <button
                        data-testid="dropdown-button"
                        className={iconStyle ? iconStyle: iconButton}
                        onClick={toggleDropdown}
                        aria-label={droppedDown ? 'Collapse options' : 'Show options'}
                      >
                        <FontAwesomeIcon icon={faChevronDown} data-testid="down-arrow" />
                      </button>
                    )
                  : (
                      <button
                        data-testid="clear-button"
                        className={iconStyle ? iconStyle : iconButton}
                        onClick={clear}
                        aria-label={filterCharacters.length > 0 ? 'clear filter' : ''}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} data-testid="clear-filter-icon" />
                      </button>
                    )
                  }
            </div>
          )}
        </div>

      {droppedDown && (
        <ul className={`${styles.selector_list} ${scrollable ? styles.scrollable : ''}`}
            data-testid="selectorList"
            role={'presentation'}
            onBlur={onBlurHandler}
            onMouseDown={() => setMouseOverDropdown(true)}
            onMouseLeave={() => setMouseOverDropdown(false)}
        >
          {filteredOptions.map((option, index) => (
            <React.Fragment key={index}>
                <li className={styles.selector_option}>
                  <button
                    className={
                      classNames([
                        styles.selector_optionButton, option === selectedOption ?
                          styles.selector_optionSelected : ''
                      ])
                    }
                    onClick={() => {updateSelection(option, true)}}
                    disabled={required && !option.value}
                    title={(required && !option.value && disabledMessage) && disabledMessage}
                  >
                    {option[optionLabelKey]}
                  </button>
                </li>
            </React.Fragment>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
}

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current &&  htmlElRef.current.focus();
  }

  return [ htmlElRef, setFocus ];
}
