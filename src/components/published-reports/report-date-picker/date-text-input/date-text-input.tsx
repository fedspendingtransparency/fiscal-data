import React, { useEffect, useRef, useState } from 'react';
import { FunctionComponent } from 'react';
import { selectedDateDisplay, inputLabel, helpLabel, errorState, errorStateLabel } from './date-text-input.module.scss';
import { monthFullNames, monthNames } from '../../../../utils/api-utils';

interface iDateTextInput {
  label: string;
  validInput: boolean;
  setValidInput: (inputState: boolean) => void;
  inputFocus: boolean;
  setInputFocus: (focusState: boolean) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  allDates: string[];
  selectedDate: string;
  helpText: string;
}

export const invalidDateText = 'Invalid date. Please check input and format.';
export const noReportMatch = 'No reports or files available for this date.';

const DateTextInput: FunctionComponent<iDateTextInput> = ({
  label,
  validInput,
  setValidInput,
  inputFocus,
  setInputFocus,
  setSelectedMonth,
  setSelectedYear,
  allDates,
  selectedDate,
  helpText,
}) => {
  const dateInputRef = useRef();
  const [errorMessage, setErrorMessage] = useState<string>();

  const isValidMonth = (monthInput: string) => {
    return monthFullNames.includes(monthInput) || monthNames.includes(monthInput) || (Number(monthInput) <= 12 && Number(monthInput) > 0);
  };

  const isValidYear = (yearInput: number) => {
    return yearInput >= 1000 && yearInput <= 9999;
  };

  const isValid = (input: string) => {
    const splitTextDate = input.split(' ');
    const splitNumericDate = input.split('/');
    let month = '';
    let year: number;
    let numeric = false;
    if (splitTextDate.length === 2) {
      const monthEntry = splitTextDate[0].toLowerCase();
      month = monthEntry.charAt(0).toUpperCase() + monthEntry.slice(1);

      const abbreviatedIndex = monthNames.indexOf(month);
      if (abbreviatedIndex >= 0) {
        month = monthFullNames[abbreviatedIndex];
      }
      year = Number(splitTextDate[1]);
    } else if (splitNumericDate.length === 2) {
      month = splitNumericDate[0];
      year = Number(splitNumericDate[1]);
      numeric = true;
    }
    const validEntry = isValidMonth(month) && isValidYear(year);
    if (validEntry) {
      let inputMonth = month;

      if (numeric) {
        const monthText = monthFullNames[Number(month) - 1];
        inputMonth = monthText;
        dateInputRef.current.value = monthText + ' ' + year;
      }

      const reportMatch = allDates?.includes(inputMonth + ' ' + year);
      if (!reportMatch) {
        setErrorMessage(noReportMatch);
      } else {
        setErrorMessage(null);
        setSelectedMonth(inputMonth);
        setSelectedYear(year.toString());
        setValidInput(true);
      }
    } else {
      setValidInput(false);
      setErrorMessage(invalidDateText);
    }
  };

  const handleOnKeyDown = e => {
    const input = e.target.value;
    if (e.code === 'Enter') {
      isValid(input);
    }
  };

  const handleOnChange = () => {
    setValidInput(false);
    setErrorMessage(null);
  };

  const handleOnBlur = () => {
    if (!validInput && dateInputRef?.current) {
      dateInputRef.current.value = selectedDate;
    }
    setErrorMessage(null);
    setInputFocus(false);
  };

  useEffect(() => {
    if (dateInputRef?.current) {
      dateInputRef.current.value = selectedDate;
    }
  }, [selectedDate]);

  const handleFocus = () => {
    setInputFocus(true);
  };

  return (
    <>
      <div className={inputLabel}>{label}</div>
      <input
        type="text"
        className={`${selectedDateDisplay} ${!!errorMessage && errorState}`}
        ref={dateInputRef}
        onKeyDown={handleOnKeyDown}
        onFocus={handleFocus}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        aria-label="Enter report date"
      />
      {inputFocus && !validInput && !errorMessage && <div className={helpLabel}>{helpText}</div>}
      {inputFocus && !validInput && errorMessage && <div className={errorStateLabel}>{errorMessage}</div>}
    </>
  );
};

export default DateTextInput;