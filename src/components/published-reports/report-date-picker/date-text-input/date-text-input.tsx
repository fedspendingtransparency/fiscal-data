import React, { useRef, useState } from 'react';
import { FunctionComponent } from 'react';
import { selectedDateDisplay, inputLabel, helpLabel } from './date-text-input.module.scss';
import { monthFullNames, monthNames } from '../../../../utils/api-utils';

interface iDateTextInput {
  label: string;
  validInput: boolean;
  setValidInput: (inputState: boolean) => void;
  inputFocus: boolean;
  setInputFocus: (focusState: boolean) => void;
  setSelectedDate: (date: string) => void;
}

const DateTextInput: FunctionComponent<iDateTextInput> = ({ label, validInput, setValidInput, inputFocus, setInputFocus, setSelectedDate }) => {
  const dateInputRef = useRef();
  const helpText = 'Press Enter/Return to confirm.';

  const isValidMonth = (monthInput: string) => {
    return monthFullNames.includes(monthInput);
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
        console.log('input is valid', month, year, input);
        return isValidMonth(month) && isValidYear(year);
        // if (isValidMonth(month) && isValidYear(year)) {
        //   setValidInput(true);
        // }
      }
    }
    return false;
  };

  const handleOnKeyDown = e => {
    const input = e.target.value;
    if (e.code === 'Enter') {
      if (isValid(input)) {
        setValidInput(true);
        console.log(e, input);
      } else {
        console.log('invalid error state');
        //set error state
      }
    }
  };
  const handleOnChange = e => {
    const input = e.target.value;
    if (validInput && !isValid(input)) {
      setValidInput(false);
      console.log('else key input invalid', input);
    }
    console.log('here', validInput, input);
  };

  const handleOnFocus = e => {
    console.log('focus');
    setInputFocus(true);
  };

  const handleOnBlur = e => {
    console.log('blur');
    if (!validInput && dateInputRef?.current?.value) {
      dateInputRef.current.value = '';
    }
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
        onChange={handleOnChange}
      />
      <div className={helpLabel} aria-hidden={inputFocus && !validInput} style={inputFocus && !validInput ? null : { display: 'none' }}>
        {helpText}
      </div>
    </>
  );
};

export default DateTextInput;
