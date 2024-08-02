import React, { FunctionComponent, useEffect, useState } from 'react';
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
  handleClick: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  handleClose: () => void;
  handleApplyDate: () => void;
}

const MonthPickerDropdown: FunctionComponent = ({
  monthDropdownOptions,
  yearDropdownOptions,
  handleClick,
  setSelectedDate,
  handleClose,
  handleApplyDate,
}: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthDropdownOptions[monthDropdownOptions.length - 1]);
  const [selectedYear, setSelectedYear] = useState(yearDropdownOptions[0]);
  const handleMonthClick = (month: string) => {
    if (handleClick) {
      // handleClick();
    }
    setSelectedMonth(month);
  };

  const handleYearClick = (year: string) => {
    setShowYears(false);
    setSelectedYear(year);
  };

  const handleApply = () => {
    if (handleApplyDate) {
      handleApplyDate();
    }
    setSelectedDate(selectedMonth + ' ' + selectedYear);
  };

  return (
    <div className={dropdownContainer}>
      <div className={publishedDateLabel}>Published Date</div>
      <div className={selectedDateDisplay}>{selectedMonth + ' ' + selectedYear}</div>
      <button className={yearButton} onClick={() => setShowYears(!showYears)} aria-label="Select Year">
        {selectedYear} <FontAwesomeIcon className={arrowIcon} icon={showYears ? faCaretDown : faCaretUp} />
      </button>
      <div className={dropdownList}>
        {showYears && (
          <ScrollContainer deps={[yearDropdownOptions, monthDropdownOptions, showYears, selectedMonth, selectedYear]}>
            <ul>
              {yearDropdownOptions?.map((option, i) => (
                <li key={i}>
                  <button className={option === selectedYear && selected} onClick={() => handleYearClick(option)}>
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
                  <button className={option === selectedMonth && selected} onClick={() => handleMonthClick(option)}>
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
        <button className={applyButton} onClick={handleApply}>
          <FontAwesomeIcon icon={faCheck} className={checkIcon} />
          Apply
        </button>
      </div>
    </div>
  );
};

export default MonthPickerDropdown;
