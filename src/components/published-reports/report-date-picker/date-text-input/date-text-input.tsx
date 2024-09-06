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

export const invalidDateText = 'Invalid date. Please check input and format.';
export const helpText = 'Press Enter/Return to confirm.';
export const noReportMatch = 'No reports or files available for this date.';

const DateTextInput: FunctionComponent<iDateTextInput> = ({
  label,
  validInput,
  setValidInput,
  inputFocus,
  setInputFocus,
  setSelectedMonth,
  setSelectedYear,
  handleApply,
  allReportDates,
}) => {
  const dateInputRef = useRef();
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
      setInvalidInput(false);

      if (numeric) {
        const monthText = monthFullNames[Number(month) - 1];
        inputMonth = monthText;
        dateInputRef.current.value = monthText + ' ' + year;
      }

      const reportMatch = allReportDates.includes(inputMonth + ' ' + year);
      console.log(reportMatch);
      if (!reportMatch) {
        setErrorMessage(noReportMatch);
        setInvalidInput(true);
      } else {
        setErrorMessage(null);
        setSelectedMonth(inputMonth);
        setSelectedYear(year.toString());
        setValidInput(true);
      }
      // check for matching report
    } else {
      setValidInput(false);
      setErrorMessage(invalidDateText);
      setInvalidInput(true);
    }
  };

  useEffect(() => {
    if (validInput) {
      // handleApply();
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
        placeholder="test"
      />
      {inputFocus && !validInput && !invalidInput && <div className={helpLabel}>{helpText}</div>}
      {inputFocus && !validInput && errorMessage && <div className={errorStateLabel}>{errorMessage}</div>}
      {/*{inputFocus && !validInput && errorMessage && <div className={errorStateLabel}>{errorMessage}</div>}*/}
    </>
  );
};

export default DateTextInput;
