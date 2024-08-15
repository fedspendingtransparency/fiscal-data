import React, { FunctionComponent, useState } from 'react';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dropdownList, selected, yearButton, arrowIcon } from './month-picker.module.scss';
import ScrollContainer from '../../../scroll-container/scroll-container';
import ReportDateDropdown from '../report-date-dropdown/report-date-dropdown';
import { monthFullNames } from '../../../../utils/api-utils';

interface IMonthPickerDropdown {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  handleClose: () => void;
  allReportDates;
  active: boolean;
  allReportYears: string[];
}

const MonthPicker: FunctionComponent<IMonthPickerDropdown> = ({
  setSelectedDate,
  selectedDate,
  handleClose,
  allReportDates,
  active,
  allReportYears,
}: IMonthPickerDropdown) => {
  console.log(allReportDates);
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthFullNames[selectedDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>(selectedDate.getFullYear().toString());

  const allYears = [...new Set(allReportYears)];
  const monthDropdownOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  console.log(allYears);
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
    <>
      {active && (
        <ReportDateDropdown handleClose={handleClose} handleApply={handleApply} displayDate={selectedMonth + ' ' + selectedYear}>
          <>
            <button className={yearButton} onClick={() => setShowYears(!showYears)} aria-label="Toggle Year Dropdown">
              {selectedYear} <FontAwesomeIcon className={arrowIcon} icon={showYears ? faCaretUp : faCaretDown} />
            </button>
            <div className={dropdownList}>
              {showYears && (
                <ScrollContainer deps={[allYears, monthDropdownOptions, showYears, selectedMonth, selectedYear]}>
                  <ul>
                    {allYears?.map((option, i) => {
                      const disabled = !allReportDates.includes(selectedMonth + ' ' + option);
                      return (
                        <li key={i}>
                          <button className={option === selectedYear ? selected : null} disabled={disabled} onClick={() => handleYearClick(option)}>
                            {option}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollContainer>
              )}
              {!showYears && (
                <ScrollContainer deps={[allYears, monthDropdownOptions, showYears, selectedMonth, selectedYear]}>
                  <ul>
                    {monthDropdownOptions?.map((option, i) => {
                      const disabled = !allReportDates.includes(option + ' ' + selectedYear);
                      console.log(option + ' ' + selectedYear);
                      return (
                        <li key={i}>
                          <button className={option === selectedMonth ? selected : null} disabled={disabled} onClick={() => handleMonthClick(option)}>
                            {option}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollContainer>
              )}
            </div>
          </>
        </ReportDateDropdown>
      )}
    </>
  );
};

export default MonthPicker;
