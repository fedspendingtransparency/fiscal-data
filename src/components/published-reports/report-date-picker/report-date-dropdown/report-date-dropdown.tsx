import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { applyButton, buttonContainer, cancelButton, checkIcon, dropdownContainer, inputContainer } from './report-date-dropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import DateTextInput from '../date-text-input/date-text-input';

interface IReportDateDropdown {
  handleClose: () => void;
  handleApply: () => void;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  children: ReactElement;
  allDates: string[];
  selectedDate: string;
  helpText;
}

const ReportDateDropdown: FunctionComponent<IReportDateDropdown> = ({
  handleClose,
  handleApply,
  setSelectedMonth,
  setSelectedYear,
  children,
  allDates,
  selectedDate,
  helpText,
}: IReportDateDropdown) => {
  const [validInput, setValidInput] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  return (
    <>
      <div className={dropdownContainer}>
        <div className={inputContainer}>
          <DateTextInput
            label="Published Date (Example: May 1998 or 05/1998)"
            validInput={validInput}
            setValidInput={setValidInput}
            inputFocus={inputFocus}
            setInputFocus={setInputFocus}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            allDates={allDates}
            selectedDate={selectedDate}
            helpText={helpText}
          />
        </div>
        {children}
        <div className={buttonContainer}>
          <button className={cancelButton} onClick={handleClose}>
            Cancel
          </button>
          <button className={applyButton} onClick={handleApply} aria-label="Apply Selected Date" disabled={inputFocus && !validInput}>
            <FontAwesomeIcon icon={faCheck} className={checkIcon} />
            Apply
          </button>
        </div>
      </div>
    </>
  );
};
export default ReportDateDropdown;
