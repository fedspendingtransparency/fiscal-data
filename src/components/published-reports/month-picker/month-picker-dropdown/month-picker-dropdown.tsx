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
} from './month-picker-dropdown.module.scss';
import ScrollContainer from '../../../scroll-container/scroll-container';
interface IMonthPickerDropdown {
  monthDropdownOptions: string[];
  yearDropdownOptions: string[];
  handleClick: () => void;
}

const MonthPickerDropdown: FunctionComponent = ({ monthDropdownOptions, yearDropdownOptions, handleClick }: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2023');
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

  return (
    <div className={dropdownContainer}>
      <div className={publishedDateLabel}>Published Date</div>
      <div className={selectedDateDisplay}>{selectedMonth + ' ' + selectedYear}</div>
      <button className={yearButton} onClick={() => setShowYears(!showYears)}>
        {selectedYear} <FontAwesomeIcon className={arrowIcon} icon={showYears ? faCaretDown : faCaretUp} />
      </button>
      <div className={dropdownList}>
        <ScrollContainer deps={[yearDropdownOptions, monthDropdownOptions, showYears, selectedMonth, selectedYear]}>
          {showYears && (
            <ul>
              {yearDropdownOptions?.map((option, i) => (
                <li key={i}>
                  <button className={option === selectedYear && selected} onClick={() => handleYearClick(option)}>
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!showYears && (
            <ul>
              {monthDropdownOptions?.map((option, i) => (
                <li key={i}>
                  <button className={option === selectedMonth && selected} onClick={() => handleMonthClick(option)}>
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollContainer>
      </div>
    </div>
  );
};

export default MonthPickerDropdown;
