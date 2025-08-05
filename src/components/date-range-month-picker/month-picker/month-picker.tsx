import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
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

const MonthPicker: FunctionComponent = ({ text, setSelectedDate, selectedDate, allYears }) => {
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
    const currentSelection = selectedDate?.split(' ');
    const defaultMonth = currentSelection?.length > 1 ? currentSelection[0] : 'Month';
    const defaultYear = currentSelection?.length > 1 ? currentSelection[1] : 'Year';
    setSelectedMonth(defaultMonth);
    setSelectedYear(defaultYear);
  }, [selectedDate]);

  return (
    <>
      <DropdownContainer dropdownButton={button} setActive={setDropdownActive} containerWidth="200px">
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
                    monthDropdownOptions?.map((option, i) => {
                      return (
                        <li key={i}>
                          <button className={option === selectedMonth ? selected : null} onClick={() => handleMonthClick(option)}>
                            {option}
                          </button>
                        </li>
                      );
                    })}
                  {activeDropdown === 'year' &&
                    allYears?.map((option, i) => {
                      return (
                        <li key={i}>
                          <button className={option === selectedYear ? selected : null} onClick={() => handleYearClick(option)}>
                            {option}
                          </button>
                        </li>
                      );
                    })}
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
