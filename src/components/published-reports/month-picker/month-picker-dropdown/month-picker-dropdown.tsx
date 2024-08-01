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
} from './month-picker-dropdown.module.scss';
import ScrollContainer from '../../../scroll-container/scroll-container';

interface IMonthPickerDropdown {
  monthDropdownOptions: string[];
  yearDropdownOptions: string[];
  handleClick: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const MonthPickerDropdown: FunctionComponent = ({
  monthDropdownOptions,
  yearDropdownOptions,
  handleClick,
  selectedDate,
  setSelectedDate,
}: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [scrollAdjust, setScrollAdjust] = useState(null);
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

  useEffect(() => {
    setSelectedDate(selectedMonth + ' ' + selectedYear);
  }, [selectedYear, selectedMonth]);

  return (
    <div className={dropdownContainer}>
      <div className={publishedDateLabel}>Published Date</div>
      <div className={selectedDateDisplay}>{selectedDate}</div>
      <button className={yearButton} onClick={() => setShowYears(!showYears)} style={!!scrollAdjust ? { paddingRight: scrollAdjust + 'px' } : null}>
        {selectedYear} <FontAwesomeIcon className={arrowIcon} icon={showYears ? faCaretDown : faCaretUp} />
      </button>
      <div className={dropdownList}>
        <ScrollContainer deps={[yearDropdownOptions, monthDropdownOptions, showYears, selectedMonth, selectedYear]} setScrollAdjust={setScrollAdjust}>
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
