import React, { useRef, useState } from 'react';
import { FunctionComponent } from 'react';
import { selectedDateDisplay, inputLabel, helpLabel } from './date-text-input.module.scss';
import { monthFullNames, monthNames } from '../../../../utils/api-utils';

interface iDateTextInput {
  label: string;
}

const DateTextInput: FunctionComponent<iDateTextInput> = ({ label }) => {
  const dateInputRef = useRef();
  const helpText = 'Press Enter/Return to confirm.';
  const [inputFocus, setInputFocus] = useState(false);

  const isValidMonth = (monthInput: string) => {
    return monthFullNames.includes(monthInput) || monthNames.includes(monthInput);
  };

  const isValidYear = (yearInput: number) => {
    return yearInput >= 1000 && yearInput <= 9999;
  };

  const isValid = (input: string) => {
    const inputDate = new Date(input);
    const isValidDateObject = inputDate.getTime() === inputDate.getTime();
    if (isValidDateObject) {
      const splitDate = input.split(' ');
      if (splitDate.length === 2) {
        const month = splitDate[0];
        const year = Number(splitDate[1]);

        if (isValidMonth(month) && isValidYear(year)) {
          console.log('Valid month!');
        }
      }
    }
    return isValidDateObject;
  };

  const handleOnKeyDown = e => {
    if (e.code === 'Enter') {
      const input = e.target.value;
      if (isValid(input)) {
        console.log(e, input);
      }
    }
  };

  const handleOnFocus = e => {
    console.log('focus');
    setInputFocus(true);
  };

  const handleOnBlur = e => {
    console.log('focus');
    setInputFocus(false);
  };

  return (
    <>
      <div className={inputLabel}>{label}</div>
      <input
        type="text"
        className={selectedDateDisplay}
        ref={dateInputRef}
        onKeyDown={handleOnKeyDown}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
      <div className={helpLabel} aria-hidden={inputFocus} style={inputFocus ? null : { display: 'none' }}>
        {helpText}
      </div>
    </>
  );
};

export default DateTextInput;
