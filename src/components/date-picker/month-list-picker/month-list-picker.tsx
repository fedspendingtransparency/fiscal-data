import React, { FunctionComponent, useEffect, useRef } from 'react';
import { dropdownContainer, dropdownList, selected } from './month-list-picker.module.scss';
import ScrollContainer from '../../scroll-container/scroll-container';
import { monthFullNames } from '../../../utils/api-utils';
import { analyticsEventHandler } from '../../../helpers/insights/insight-helpers';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';

interface IMonthListPicker {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  handleClose: () => void;
  allReportDates: string[];
  active: boolean;
}

const monthYearToDate = (monthYear: string): Date => {
  const [month, year] = monthYear.split(' ');
  return new Date(`${month} 1, ${year}`);
};

// Flat single-click list of "Month Year" dates, used for yearly report groups in place
// of the month/year picker with an apply step
const MonthListPicker: FunctionComponent<IMonthListPicker> = ({ selectedDate, setSelectedDate, handleClose, allReportDates, active }) => {
  const monthYearOptions = [...new Set(allReportDates)].sort((a, b) => monthYearToDate(b).getTime() - monthYearToDate(a).getTime());
  const selectedMonthYear = selectedDate ? monthFullNames[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear() : '';
  const scrollToSelectedDate = useRef(null);

  const handleDateClick = (monthYear: string) => {
    const eventAction = 'Published Report Date Selection';
    analyticsEventHandler('Data Download', monthYear, eventAction);
    ga4DataLayerPush({
      event: eventAction,
      eventLabel: monthYear,
    });
    setSelectedDate(monthYearToDate(monthYear));
    handleClose();
  };

  useEffect(() => {
    if (scrollToSelectedDate.current) {
      scrollToSelectedDate.current.scrollIntoView({ block: 'nearest' });
    }
  }, [active]);

  return (
    <div className={dropdownContainer}>
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
    </div>
  );
};

export default MonthListPicker;
