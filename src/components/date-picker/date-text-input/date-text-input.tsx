import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { errorState, errorStateLabel, helpLabel, inputLabel, selectedDateDisplay } from './date-text-input.module.scss';
import { monthFullNames, monthNames } from '../../../utils/api-utils';

interface iDateTextInput {
  label?: string;
  ariaLabel?: string;
  validInput: boolean;
  setValidInput: (inputState: boolean) => void;
  inputFocus: boolean;
  setInputFocus: (focusState: boolean) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  allDates: string[];
  selectedDate: string;
  setCurrentDate: (date: Date) => void;
  minDateErrorMessage?: string;
  maxDateErrorMessage?: string;
  fromDate?: Date;
  toDate?: Date;
}

export const invalidDateText = 'Invalid date. Please check input and format.';
export const noMatchDefaultMessage = 'No reports or files available for this date.';
export const helpText = 'Press Enter/Return to confirm.';

const DateTextInput: FunctionComponent<iDateTextInput> = ({
  label = 'Published Date (Example: May 1998 or 05/1998)',
  ariaLabel = 'Enter date',
  validInput,
  setValidInput,
  inputFocus,
  setInputFocus,
  setSelectedMonth,
  setSelectedYear,
  allDates,
  selectedDate,
  setCurrentDate,
  minDateErrorMessage,
  maxDateErrorMessage,
  fromDate,
  toDate,
}) => {
  const dateInputRef = useRef();
  const [errorMessage, setErrorMessage] = useState<string>();

  const isValidMonth = (monthInput: string) => {
    return monthFullNames.includes(monthInput) || monthNames.includes(monthInput) || (Number(monthInput) <= 12 && Number(monthInput) > 0);
  };

  const isValidYear = (yearInput: number) => {
    return yearInput >= 1000 && yearInput <= 9999;
  };

  const isValidDay = (dayInput: number) => {
    return dayInput <= 31 && dayInput > 0;
  };

  const formatMonth = (monthEntry: string) => {
    let month = monthEntry.charAt(0).toUpperCase() + monthEntry.slice(1);
    const abbreviatedIndex = monthNames.indexOf(month);
    if (abbreviatedIndex >= 0) {
      month = monthFullNames[abbreviatedIndex];
    }
    return month;
  };

  const parseInput = (input: string) => {
    const splitTextDate = input.split(' ');
    const splitNumericDate = input.split('/');
    let month = '';
    let year: number;
    let day: number;
    let numeric = false;
    if (splitTextDate.length === 2) {
      //Monthly date text entry, ex: May 2021
      const monthEntry = splitTextDate[0].toLowerCase();
      month = formatMonth(monthEntry);
      year = Number(splitTextDate[1]);
    } else if (splitTextDate.length === 3) {
      const monthEntry = splitTextDate[0].toLowerCase();
      month = formatMonth(monthEntry);
      const dayEntry = splitTextDate[1];
      day = Number(dayEntry.split(',')[0]);
      year = Number(splitTextDate[2]);
    } else if (splitNumericDate.length === 2) {
      //Monthly date numeric entry, ex: 1/2024
      month = splitNumericDate[0];
      year = Number(splitNumericDate[1]);
      numeric = true;
    } else if (splitNumericDate.length === 3) {
      //Daily date numeric entry, ex: 1/1/2024
      month = splitNumericDate[0];
      day = Number(splitNumericDate[1]);
      year = Number(splitNumericDate[2]);
      numeric = true;
    }
    return { month, day, year, numeric };
  };

  const isValid = (input: string) => {
    const { month, day, year, numeric } = parseInput(input);
    const validEntry = isValidMonth(month) && isValidYear(year) && (!day || isValidDay(day));
    let formattedDate: string;
    if (validEntry) {
      let inputMonth = month;
      if (numeric) {
        inputMonth = monthFullNames[Number(month) - 1];
      }
      formattedDate = day ? inputMonth + ' ' + day + ', ' + year : inputMonth + ' ' + year;
      dateInputRef.current.value = formattedDate;

      const dateMatch = allDates?.includes(formattedDate);
      if (!dateMatch && allDates) {
        setErrorMessage(noMatchDefaultMessage);
      } else if (minDateErrorMessage && fromDate && new Date(formattedDate) < new Date(fromDate)) {
        setErrorMessage(minDateErrorMessage);
      } else if (maxDateErrorMessage && toDate && new Date(formattedDate) > new Date(toDate)) {
        setErrorMessage(maxDateErrorMessage);
      } else {
        setErrorMessage(null);
        if (setSelectedMonth) {
          setSelectedMonth(inputMonth);
        }
        if (setSelectedYear) {
          setSelectedYear(year.toString());
        }
        if (setCurrentDate) {
          setCurrentDate(new Date(formattedDate));
        }
        setValidInput(true);
      }
    } else {
      setValidInput(false);
      setErrorMessage(invalidDateText);
    }
  };

  const handleOnKeyDown = e => {
    const input = e.target.value;
    if (e.key === 'Enter') {
      isValid(input);
    }
  };

  const handleOnChange = () => {
    setValidInput(false);
    setErrorMessage(null);
  };

  const handleOnBlur = () => {
    if (!validInput && dateInputRef?.current) {
      dateInputRef.current.value = !!selectedDate ? selectedDate : '';
    }
    setErrorMessage(null);
    setInputFocus(false);
  };

  useEffect(() => {
    if (dateInputRef?.current) {
      dateInputRef.current.value = !!selectedDate ? selectedDate : '';
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
        aria-label={ariaLabel}
      />
      {inputFocus && !validInput && !errorMessage && <div className={helpLabel}>{helpText}</div>}
      {inputFocus && !validInput && errorMessage && <div className={errorStateLabel}>{errorMessage}</div>}
    </>
  );
};

export default DateTextInput;
