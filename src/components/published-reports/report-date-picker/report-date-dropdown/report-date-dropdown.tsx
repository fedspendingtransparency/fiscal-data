import React, { FunctionComponent, ReactElement, useState } from 'react';
import { applyButton, buttonContainer, cancelButton, checkIcon, dropdownContainer, inputContainer } from './report-date-dropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import DateTextInput from '../date-text-input/date-text-input';

interface IReportDateDropdown {
  handleClose: () => void;
  handleApply: () => void;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
  setCurrentDate: (date: Date) => void;
  children: ReactElement;
  allDates: string[];
  selectedDate: string;
  daily?: boolean;
}

const ReportDateDropdown: FunctionComponent<IReportDateDropdown> = ({
  handleClose,
  handleApply,
  setSelectedMonth,
  setSelectedYear,
  setCurrentDate,
  children,
  allDates,
  selectedDate,
  daily,
}: IReportDateDropdown) => {
  const [validInput, setValidInput] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const label = daily ? 'Published Date (Example: May 1, 1998 or 05/01/1998)' : 'Published Date (Example: May 1998 or 05/1998)';
  console.log(allDates);
  return (
    <>
      <div className={dropdownContainer}>
        <div className={inputContainer}>
          <DateTextInput
            label={label}
            validInput={validInput}
            setValidInput={setValidInput}
            inputFocus={inputFocus}
            setInputFocus={setInputFocus}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            allDates={allDates}
            selectedDate={selectedDate}
            daily={daily}
            setCurrentDate={setCurrentDate}
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
