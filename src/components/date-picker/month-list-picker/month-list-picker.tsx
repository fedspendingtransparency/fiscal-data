import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { dropdownList, selected } from './month-list-picker.module.scss';
import DateDropdown from '../date-dropdown/date-dropdown';
import ScrollContainer from '../../scroll-container/scroll-container';
import { monthFullNames } from '../../../utils/api-utils';

interface IMonthListPicker {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  handleClose: () => void;
  allReportDates: string[];
  active: boolean;
  latestDate: Date;
  earliestDate: Date;
}

const monthYearToDate = (monthYear: string): Date => {
  const [month, year] = monthYear.split(' ');
  return new Date(`${month} 1, ${year}`);
};

// Flat list of "Month Year" dates, used for yearly report groups in place of the
// month/year picker
const MonthListPicker: FunctionComponent<IMonthListPicker> = ({
  selectedDate,
  setSelectedDate,
  handleClose,
  allReportDates,
  active,
  latestDate,
  earliestDate,
}: IMonthListPicker) => {
  const [selectedMonth, setSelectedMonth] = useState(monthFullNames[selectedDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>(selectedDate.getFullYear().toString());
  const scrollToSelectedDate = useRef(null);

  const monthYearOptions = [...new Set(allReportDates)].sort((a, b) => monthYearToDate(b).getTime() - monthYearToDate(a).getTime());
  const selectedMonthYear = selectedMonth + ' ' + selectedYear;
  // example uses the latest report date so it always matches the dataset's actual format
  const latestMonthYear = monthYearOptions[0];
  const searchBarLabel = latestMonthYear ? `Published Date (Example: ${latestMonthYear} or ${latestMonthYear.split(' ')[1]})` : undefined;

  const handleDateClick = (monthYear: string) => {
    const [month, year] = monthYear.split(' ');
    setSelectedMonth(month);
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
    }
  }, [active]);

  useEffect(() => {
    if (scrollToSelectedDate.current) {
      scrollToSelectedDate.current.scrollIntoView({ block: 'nearest' });
    }
  }, [active, selectedMonthYear]);

  return (
    <>
      {active && (
        <DateDropdown
          handleClose={handleClose}
          handleApply={handleApply}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
          allDates={allReportDates}
          selectedDate={selectedMonthYear}
          fromDate={earliestDate}
          toDate={latestDate}
          label={searchBarLabel}
          allowYearOnly
        >
          <div className={dropdownList}>
            <ScrollContainer deps={[monthYearOptions, selectedMonthYear]}>
              <ul>
                {monthYearOptions.map((option, i) => (
                  <li key={i}>
                    <button
                      className={option === selectedMonthYear ? selected : null}
                      onClick={() => handleDateClick(option)}
                      ref={option === selectedMonthYear ? scrollToSelectedDate : null}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollContainer>
          </div>
        </DateDropdown>
      )}
    </>
  );
};

export default MonthListPicker;
