import React, { useEffect, useState } from 'react';
import * as styles from '../../select-control/select-control.module.scss';
import { filterYearOptions } from '../util/util';
import classNames from 'classnames';

export default function ComboSelect({options, changeHandler, optionLabelKey, selectedOption}) {
  const [filterDigits, setFilterDigits] = useState('');
  const [filteredOptions, setFilteredOptions] = useState();
  const [droppedDown, setDroppedDown] = useState(false);
  const labelKey = optionLabelKey ? optionLabelKey : 'label';

  const updateSelection = (selection) => {
    changeHandler(selection);
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
    event.target.value = event.target.value.replace(/[^\d]/g,'').substr(0,4);
  };

  /* accessibility-enabling event handlers for interpreting focus state on control */
  const onBlurHandler = () => {
    timeOutId = setTimeout(() => {
      if (selectedOption && selectedOption.value) {
        setFilterDigits(selectedOption.value);
      }
      setDroppedDown(false);
    });
  };

  const onFocusHandler = () => {
    clearTimeout(timeOutId);
  };

  useEffect(() => {
    if (selectedOption && selectedOption.value) {
      setFilterDigits(selectedOption.value);
    }
  }, [selectedOption]);

  const onFilterChange = (event) => {
    const val = (event && event.target) ? event.target.value : null;
    setFilterDigits(val);
    const localFilteredOptions = filterYearOptions(options, val);
    setFilteredOptions(localFilteredOptions);
    if (localFilteredOptions.length === 1
      && (localFilteredOptions[0].value
        && localFilteredOptions[0].value.toString() === val)) {
      updateSelection(localFilteredOptions[0]);
    } else {
      clearTimeout(timeOutId);
      setDroppedDown(true);
    }
  };

  const labelText = `Year (${options[options.length -1].label} - ${options[0].label})`;

  return (
    <div className={styles.selector_container} onFocus={onFocusHandler}
         onBlur={onBlurHandler}
    >
      <div className={styles.selector_label}>{labelText} <span className='required'>*</span></div>
        <div>
          <input type='number'
                 className={styles.comboSelectField}
                 onChange={onFilterChange}
                 value={filterDigits}
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
        </div>

      {droppedDown && (
        <ul className={styles.selector_list} data-test-id={'selectorList'} aria-hidden>
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
                    onClick={() => {updateSelection(option);}} disabled={!option.value}
                  >
                    {option[labelKey]}
                  </button>
                </li>
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
