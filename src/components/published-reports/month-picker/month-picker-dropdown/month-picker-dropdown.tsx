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
  handleClose,
}: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthDropdownOptions[monthDropdownOptions.length - 1]);
  const [selectedYear, setSelectedYear] = useState(yearDropdownOptions[0]);

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

  const handleBlur = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      console.log('blurrrr 2');
      // handleClose();
    } else {
      console.log('blurrrr 3', e.currentTarget, e.relatedTarget);
    }
  };

  return (
    <div className={dropdownContainer} onBlur={e => handleBlur(e)} role="presentation">
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
