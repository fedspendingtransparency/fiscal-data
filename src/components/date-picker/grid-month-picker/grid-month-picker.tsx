import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  arrowIcon,
  dropdownList,
  listMonth,
  listYear,
  selected,
  unorderList,
  unorderYear,
  yearButton,
  yearChevron,
  yearHeader,
} from './month-picker.module.scss';
import DateDropdown from '../date-dropdown/date-dropdown';
import { monthFullNames } from '../../../utils/api-utils';
import ScrollContainer from '../../scroll-container/scroll-container';

interface IMonthPickerDropdown {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  handleClose: () => void;
  allReportDates: string[];
  active: boolean;
  allReportYears: string[];
  ignoreDisabled?: boolean;
  latestDate: Date;
  earliestDate: Date;
}

const GirdMonthPicker: FunctionComponent<IMonthPickerDropdown> = ({
  setSelectedDate,
  selectedDate,
  handleClose,
  allReportDates,
  active,
  allReportYears,
  ignoreDisabled,
  latestDate,
  earliestDate,
}: IMonthPickerDropdown) => {
  const [showYears, setShowYears] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthFullNames[selectedDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>(selectedDate.getFullYear().toString());

  const scrollToSelectedMonth = useRef(null);

  const allYears = [...new Set(allReportYears)];
  const monthDropdownOptions = monthFullNames;

  const currentYearIndex = useMemo(() => allYears.findIndex(year => year === selectedYear), [allYears, selectedYear]);

  const hidePreviousYear = showYears || currentYearIndex <= 0;

  const hideNextYear = showYears || currentYearIndex === -1 || currentYearIndex >= allYears.length - 1;

  const applyAndClose = (monthString: string, yearString: string) => {
    const newDate = new Date(`${monthString} 01, ${yearString}`);
    setSelectedDate(newDate);
  };

  const handleMonthClick = (month: string) => {
    const disabled = !allReportDates.includes(`${month} ${selectedYear}`);
    if (!ignoreDisabled && disabled) return;
    setSelectedMonth(month);
    applyAndClose(month, selectedYear);
  };

  const handleYearClick = (year: string) => {
    const disabled = !allReportDates.includes(`${selectedMonth} ${year}`);
    if (!ignoreDisabled && disabled) {
      setSelectedYear(year);
      setShowYears(false);
      return;
    }
    setShowYears(false);
    setSelectedYear(year);
    applyAndClose(selectedMonth.toString(), year);
  };

  const stepYear = (stepper: number) => {
    const currentIndex = allYears.findIndex(years => years.toString() === selectedYear.toString());
    if (currentIndex === -1) return;
    const nextIndex = currentIndex + stepper;
    if (nextIndex < 0 || nextIndex >= allYears.length) return;
    const nextYear = allYears[nextIndex].toString();
    setSelectedYear(nextYear);
  };

  const yearDesc = useMemo(() => [...allYears].sort((a, b) => Number(b) - Number(a)), [allYears]);

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
        <DateDropdown
          handleClose={handleClose}
          setSelectedMonth={month => {
            setSelectedMonth(month);
          }}
          setSelectedYear={year => {
            setSelectedYear(year);
          }}
          setCurrentDate={(date: Date) => {
            setSelectedMonth(monthFullNames[date.getMonth()]);
            setSelectedYear(String(date.getFullYear()));
            setSelectedDate(date);
          }}
          allDates={allReportDates}
          selectedDate={selectedMonth + ' ' + selectedYear}
          fromDate={earliestDate}
          toDate={latestDate}
          hideFooter={true}
        >
          <>
            <div className={yearHeader}>
              <button
                className={yearChevron}
                onClick={() => stepYear(-1)}
                data-hidden={hidePreviousYear}
                aria-hidden={hidePreviousYear}
                disabled={hidePreviousYear}
                aria-label="Previous Year"
                tabIndex={hidePreviousYear ? -1 : 0}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              <button className={yearButton} onClick={() => setShowYears(!showYears)} aria-label="Toggle Year Dropdown">
                {selectedYear} <FontAwesomeIcon className={arrowIcon} icon={showYears ? faCaretUp : faCaretDown} />
              </button>

              <button
                className={yearChevron}
                onClick={() => stepYear(+1)}
                data-hidden={hideNextYear}
                aria-hidden={hideNextYear}
                disabled={hideNextYear}
                aria-label="Next Year"
                tabIndex={hideNextYear ? -1 : 0}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

            <div className={dropdownList}>
              {showYears && (
                <ScrollContainer deps={[allYears, monthDropdownOptions, showYears, selectedMonth, selectedYear]}>
                  <ul className={unorderYear}>
                    {yearDesc?.map((option, i) => {
                      const disabled = !allReportDates.includes(`${selectedMonth} ${option}`);
                      return (
                        <li key={i} className={listYear}>
                          <button
                            className={option.toString() === selectedYear.toString() ? selected : undefined}
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
                  <ul className={unorderList}>
                    {monthDropdownOptions?.map((option, i) => {
                      const disabled = !allReportDates.includes(option + ' ' + selectedYear);
                      return (
                        <li key={i} className={listMonth}>
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
        </DateDropdown>
      )}
    </>
  );
};

export default GirdMonthPicker;
