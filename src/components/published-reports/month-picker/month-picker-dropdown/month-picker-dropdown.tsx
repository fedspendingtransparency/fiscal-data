import React, { FunctionComponent, useState } from 'react';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  selectedDateDisplay,
  dropdownContainer,
  publishedDateLabel,
  dropdownList,
  selected,
  yearButton,
  arrowIcon,
  buttonContainer,
  applyButton,
  cancelButton,
  checkIcon,
} from './month-picker-dropdown.module.scss';
import ScrollContainer from '../../../scroll-container/scroll-container';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface IMonthPickerDropdown {
  monthDropdownOptions: string[];
  yearDropdownOptions: string[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  handleClose: () => void;
}

const MonthPickerDropdown: FunctionComponent = ({
  monthDropdownOptions,
  yearDropdownOptions,
  setSelectedDate,
  selectedDate,
  handleClose,
}: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const date = selectedDate.split(' ');
  const [selectedMonth, setSelectedMonth] = useState(date[0]);
  const [selectedYear, setSelectedYear] = useState(date[1]);

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const handleYearClick = (year: string) => {
    setShowYears(false);
    setSelectedYear(year);
  };

  const handleApply = () => {
    setSelectedDate(selectedMonth + ' ' + selectedYear);
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <div className={dropdownContainer}>
      <div className={publishedDateLabel}>Published Date</div>
      <div className={selectedDateDisplay}>{selectedMonth + ' ' + selectedYear}</div>
      <button className={yearButton} onClick={() => setShowYears(!showYears)} aria-label="Open Year Dropdown">
        {selectedYear} <FontAwesomeIcon className={arrowIcon} icon={showYears ? faCaretDown : faCaretUp} />
      </button>
      <div className={dropdownList}>
        {showYears && (
          <ScrollContainer deps={[yearDropdownOptions, monthDropdownOptions, showYears, selectedMonth, selectedYear]}>
            <ul>
              {yearDropdownOptions?.map((option, i) => (
                <li key={i}>
                  <button className={option === selectedYear ? selected : null} onClick={() => handleYearClick(option)}>
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollContainer>
        )}
        {!showYears && (
          <ScrollContainer deps={[yearDropdownOptions, monthDropdownOptions, showYears, selectedMonth, selectedYear]}>
            <ul>
              {monthDropdownOptions?.map((option, i) => (
                <li key={i}>
                  <button className={option === selectedMonth ? selected : null} onClick={() => handleMonthClick(option)}>
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollContainer>
        )}
      </div>
      <div className={buttonContainer}>
        <button className={cancelButton} onClick={handleClose}>
          Cancel
        </button>
        <button className={applyButton} onClick={handleApply} aria-label="Apply Selected Date">
          <FontAwesomeIcon icon={faCheck} className={checkIcon} />
          Apply
        </button>
      </div>
    </div>
  );
};

export default MonthPickerDropdown;
