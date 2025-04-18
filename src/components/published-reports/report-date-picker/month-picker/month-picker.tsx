import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
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
  allReportDates: string[];
  active: boolean;
  allReportYears: string[];
  ignoreDisabled?: boolean;
}

const MonthPicker: FunctionComponent<IMonthPickerDropdown> = ({
  setSelectedDate,
  selectedDate,
  handleClose,
  allReportDates,
  active,
  allReportYears,
  ignoreDisabled,
}: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthFullNames[selectedDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>(selectedDate.getFullYear().toString());

  const scrollToSelectedMonth = useRef(null);

  const allYears = [...new Set(allReportYears)];
  const monthDropdownOptions = monthFullNames;

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const handleYearClick = (year: string) => {
    setShowYears(false);
    setSelectedYear(year);
  };

  const handleApply = () => {
    setSelectedDate(new Date(selectedMonth + ' 01, ' + selectedYear));
    if (handleClose) {
      handleClose();
    }
  };

  useEffect(() => {
    if (!active) {
      setSelectedMonth(monthFullNames[selectedDate.getMonth()]);
      setSelectedYear(selectedDate.getFullYear().toString());
      setShowYears(false);
    }
  }, [active]);

  useEffect(() => {
    if (scrollToSelectedMonth.current) {
      scrollToSelectedMonth.current.scrollIntoView({ block: 'nearest' });
    }
  }, [active, selectedMonth]);

  return (
    <>
      {active && (
        <ReportDateDropdown
          handleClose={handleClose}
          handleApply={handleApply}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
          allDates={allReportDates}
          selectedDate={selectedMonth + ' ' + selectedYear}
        >
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
                          <button
                            className={option.toString() === selectedYear.toString() ? selected : null}
                            disabled={ignoreDisabled ? false : disabled}
                            onClick={() => handleYearClick(option)}
                          >
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
                      return (
                        <li key={i}>
                          <button
                            className={option === selectedMonth ? selected : null}
                            disabled={ignoreDisabled ? false : disabled}
                            onClick={() => handleMonthClick(option)}
                            ref={option === selectedMonth ? scrollToSelectedMonth : null}
                          >
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
