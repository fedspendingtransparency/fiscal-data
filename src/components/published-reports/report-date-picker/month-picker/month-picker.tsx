import React, { FunctionComponent, useState } from 'react';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dropdownList, selected, yearButton, arrowIcon } from './month-picker.module.scss';
import ScrollContainer from '../../../scroll-container/scroll-container';
import ReportDateDropdown from '../report-date-dropdown/report-date-dropdown';
import { monthFullNames } from '../../../../utils/api-utils';

interface IMonthPickerDropdown {
  monthDropdownOptions: string[];
  yearDropdownOptions: string[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  handleClose: () => void;
}

const MonthPicker: FunctionComponent<IMonthPickerDropdown> = ({
  monthDropdownOptions,
  yearDropdownOptions,
  setSelectedDate,
  selectedDate,
  handleClose,
}: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthFullNames[selectedDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>(selectedDate.getFullYear().toString());

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const handleYearClick = (year: string) => {
    setShowYears(false);
    setSelectedYear(year);
  };

  const handleApply = () => {
    setSelectedDate(new Date(selectedMonth + ' ' + selectedYear));
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <ReportDateDropdown handleClose={handleClose} handleApply={handleApply} displayDate={selectedMonth + ' ' + selectedYear}>
      <>
        <button className={yearButton} onClick={() => setShowYears(!showYears)} aria-label="Toggle Year Dropdown">
          {selectedYear} <FontAwesomeIcon className={arrowIcon} icon={showYears ? faCaretUp : faCaretDown} />
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
      </>
    </ReportDateDropdown>
  );
};

export default MonthPicker;
