import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import {
  dropdownButton,
  dropdownContent,
  dropdownList,
  header,
  icon,
  label,
  monthButton,
  monthYearButton,
  selected,
  selectedDropdown,
  yearButton,
} from './month-picker.module.scss';
import ScrollContainer from '../../scroll-container/scroll-container';
import { monthFullNames } from '../../../utils/api-utils';
import { isAfter, isBefore } from 'date-fns';
import { getDateWithoutTimeZoneAdjust } from '../../../utils/date-utils';

const MonthPicker: FunctionComponent = ({ text, setSelectedDate, selectedDate, allYears, datasetDateRange = [] }) => {
  const currentSelection = selectedDate?.split(' ');
  const defaultMonth = currentSelection?.length > 1 ? currentSelection[0] : 'Month';
  const defaultYear = currentSelection?.length > 1 ? currentSelection[1] : 'Year';

  const [dropdownActive, setDropdownActive] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [activeDropdown, setActiveDropdown] = useState('month');

  const monthDropdownOptions = monthFullNames;

  const button = (
    <button onClick={() => setDropdownActive(!dropdownActive)} className={dropdownButton}>
      <span className={label}>{text}:</span> {selectedDate ? selectedDate : ''} <FontAwesomeIcon icon={dropdownActive ? faCaretUp : faCaretDown} />
    </button>
  );

  const monthYearDropdown = (key, selectedOption) => (
    <button
      onClick={() => setActiveDropdown(key)}
      className={`${monthYearButton} ${activeDropdown === key ? selectedDropdown : undefined} ${key === 'year' ? yearButton : monthButton}`}
    >
      {selectedOption}
      <FontAwesomeIcon icon={activeDropdown === key ? faCaretUp : faCaretDown} className={icon} />
    </button>
  );

  const handleMonthClick = option => {
    setSelectedMonth(option);
    setActiveDropdown('year');
  };

  const handleYearClick = option => {
    setSelectedYear(option);
  };

  useEffect(() => {
    if (selectedMonth !== 'Month' && selectedYear !== 'Year') {
      setSelectedDate(`${selectedMonth} ${selectedYear}`);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (!dropdownActive) {
      setActiveDropdown('month');
    }
  }, [dropdownActive]);

  useEffect(() => {
    const parts = selectedDate?.split(' ');
    setSelectedMonth(parts?.length > 1 ? parts[0] : 'Month');
    setSelectedYear(parts?.length > 1 ? parts[1] : 'Year');
  }, [selectedDate]);

  const isValidDate = (month, year) => {
    const monthIndex = monthFullNames.indexOf(month);
    if (monthIndex < 0) return;
    const endOfMonth = getDateWithoutTimeZoneAdjust(new Date(year, monthFullNames.indexOf(month) + 1, 0));
    const fromDate = getDateWithoutTimeZoneAdjust(new Date(datasetDateRange.from));
    const dateIsBefore = isBefore(endOfMonth, fromDate);

    const startOfMonth = getDateWithoutTimeZoneAdjust(new Date(year, monthFullNames.indexOf(month), 1));
    const toDate = getDateWithoutTimeZoneAdjust(new Date(datasetDateRange.to));
    const dateIsAfter = isAfter(startOfMonth, toDate);

    return dateIsAfter || dateIsBefore;
  };
  const isMonthDisabled = month => {
    if (selectedYear === 'Year') return false;
    return isValidDate(month, selectedYear);
  };

  const isYearDisabled = year => {
    if (selectedMonth === 'Month') return false;
    return isValidDate(selectedMonth, year);
  };

  return (
    <>
      <DropdownContainer dropdownButton={button} setActive={setDropdownActive} containerWidth="13.5rem">
        {dropdownActive && (
          <div className={`${dropdownContent}`}>
            <div className={header}>
              {monthYearDropdown('month', selectedMonth)}
              {monthYearDropdown('year', selectedYear)}
            </div>
            <div className={`${dropdownList}`}>
              <ScrollContainer deps={[selectedMonth, selectedYear]}>
                <ul>
                  {activeDropdown === 'month' &&
                    monthDropdownOptions?.map((option, i) => (
                      <li key={i}>
                        <button
                          className={option === selectedMonth ? selected : null}
                          disabled={isMonthDisabled(option)}
                          onClick={() => handleMonthClick(option)}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  {activeDropdown === 'year' &&
                    allYears?.map((option, i) => (
                      <li key={i}>
                        <button
                          className={option === selectedYear ? selected : null}
                          disabled={isYearDisabled(option)}
                          onClick={() => handleYearClick(option)}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                </ul>
              </ScrollContainer>
            </div>
          </div>
        )}
      </DropdownContainer>
    </>
  );
};

export default MonthPicker;
