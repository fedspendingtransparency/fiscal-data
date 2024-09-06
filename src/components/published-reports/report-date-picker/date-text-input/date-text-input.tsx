import React, { useEffect, useRef, useState } from 'react';
import { FunctionComponent } from 'react';
import { selectedDateDisplay, inputLabel, helpLabel, errorState, errorStateLabel } from './date-text-input.module.scss';
import { monthFullNames } from '../../../../utils/api-utils';

interface iDateTextInput {
  label: string;
  validInput: boolean;
  setValidInput: (inputState: boolean) => void;
  inputFocus: boolean;
  setInputFocus: (focusState: boolean) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  handleApply: () => void;
}

const DateTextInput: FunctionComponent<iDateTextInput> = ({
  label,
  validInput,
  setValidInput,
  inputFocus,
  setInputFocus,
  setSelectedMonth,
  setSelectedYear,
  handleApply,
}) => {
  const dateInputRef = useRef();
  const helpText = 'Press Enter/Return to confirm.';
  const invalidDateText = 'Invalid date. Please check input and format.';
  const [errorMessage, setErrorMessage] = useState<string>();
  const [invalidInput, setInvalidInput] = useState(false);

  const isValidMonth = (monthInput: string) => {
    return monthFullNames.includes(monthInput) || (Number(monthInput) <= 12 && Number(monthInput) > 0);
  };

  const isValidYear = (yearInput: number) => {
    return yearInput >= 1000 && yearInput <= 9999;
  };

  const isValid = (input: string, reset?: boolean) => {
    const splitTextDate = input.split(' ');
    const splitNumericDate = input.split('/');
    let month = '';
    let year: number;
    let numeric = false;
    if (splitTextDate.length === 2) {
      month = splitTextDate[0];
      year = Number(splitTextDate[1]);
    } else if (splitNumericDate.length === 2) {
      month = splitNumericDate[0];
      year = Number(splitNumericDate[1]);
      numeric = true;
    }
    const validEntry = isValidMonth(month) && isValidYear(year);
    if (validEntry) {
      let inputMonth = month;
      setErrorMessage(null);
      if (numeric) {
        const monthText = monthFullNames[Number(month) - 1];
        inputMonth = monthText;
        dateInputRef.current.value = monthText + ' ' + year;
      }
      setSelectedMonth(inputMonth);
      setSelectedYear(year.toString());
      setValidInput(true);
    } else {
      setInvalidInput(true);
    }
  };

  useEffect(() => {
    if (validInput) {
      handleApply();
    }
  }, [validInput]);

  const handleOnKeyDown = e => {
    const input = e.target.value;
    if (e.code === 'Enter') {
      isValid(input);
    }
  };

  const handleOnChange = e => {
    const input = e.target.value;
    // if (validInput && !isValid(input)) {
    //   setValidInput(false);
    // }
  };

  const handleOnFocus = () => {
    setInputFocus(true);
  };

  const handleOnBlur = e => {
    if (!validInput && dateInputRef?.current) {
      dateInputRef.current.value = '';
    }
    setInputFocus(false);
  };

  return (
    <>
      <div className={inputLabel}>{label}</div>
      <input
        type="text"
        className={`${selectedDateDisplay} ${invalidInput && errorState}`}
        ref={dateInputRef}
        onKeyDown={handleOnKeyDown}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
      />
      <div
        className={`${helpLabel} ${invalidInput && errorStateLabel}`}
        aria-hidden={inputFocus && !validInput}
        style={inputFocus && !validInput ? null : { display: 'none' }}
      >
        {invalidInput ? invalidDateText : helpText}
      </div>
    </>
  );
};

export default DateTextInput;
