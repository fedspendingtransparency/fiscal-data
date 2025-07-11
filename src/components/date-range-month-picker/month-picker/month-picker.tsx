import React, { FunctionComponent, useState } from 'react';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import { dropdownContent } from '../date-range-month-picker.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { dropdownButton } from './month-picker.module.scss';
import ScrollContainer from '../../scroll-container/scroll-container';
import { selected } from '../../date-picker/month-picker/month-picker.module.scss';

const MonthPicker: FunctionComponent = ({ text, setSelectedDate, selectedDate }) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const button = (
    <button onClick={() => setDropdownActive(!dropdownActive)} className={dropdownButton}>
      {text}: <FontAwesomeIcon icon={dropdownActive ? faCaretUp : faCaretDown} />
    </button>
  );
  const monthDropdownOptions = ['Jan'];
  const handleMonthClick = option => {
    console.log('');
  };
  return (
    <>
      <DropdownContainer dropdownButton={button} setActive={setDropdownActive}>
        {dropdownActive && (
          <div className={dropdownContent}>
            <ScrollContainer deps={[selectedMonth, selectedYear]}>
              <ul>
                {monthDropdownOptions?.map((option, i) => {
                  // const disabled = !allReportDates.includes(option + ' ' + selectedYear);
                  return (
                    <li key={i}>
                      <button
                        className={option === selectedMonth ? selected : null}
                        // disabled={ignoreDisabled ? false : disabled}
                        onClick={() => handleMonthClick(option)}
                        // ref={option === selectedMonth ? scrollToSelectedMonth : null}
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollContainer>
          </div>
        )}
      </DropdownContainer>
    </>
  );
};

export default MonthPicker;
