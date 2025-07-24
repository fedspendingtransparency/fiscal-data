import React, { FunctionComponent, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import DropdownContainer from '../dropdown-container/dropdown-container';
import {
  active,
  datePickers,
  dateRangePicker,
  dropdownButton,
  dropdownContent,
  icon,
  selectedDateRange,
} from './date-range-month-picker.module.scss';
import MonthPicker from './month-picker/month-picker';
import FilterButtons from '../data-preview/data-preview-dropdown-dialog/filter-buttons/filter-buttons';
import { convertDate } from '../dataset-data/dataset-data-helper/dataset-data-helper';
import { monthFullNames } from '../../utils/api-utils';
import { isAfter } from 'date-fns';

const DateRangeMonthPicker: FunctionComponent = ({ dateRange, setDateRange, datasetDateRange }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<string>();
  const [allYears, setAllYear] = useState<string[]>();
  const [dropdownActive, setDropdownActive] = useState(false);
  const button = (
    <button className={`${dropdownButton} ${dropdownActive && active}`} onClick={() => setDropdownActive(!dropdownActive)}>
      <FontAwesomeIcon icon={faCalendarWeek} className={icon} size="1x" data-testid="calendar-week-icon" />
      <span className={selectedDateRange}>{`${selectedRange ? selectedRange : 'Start Date — End Date'}`}</span>
      <div className={icon}>{dropdownActive && <FontAwesomeIcon icon={faCaretUp} />}</div>
    </button>
  );

  const handleApply = () => {
    if (selectedStartDate && selectedEndDate) {
      let startDate = selectedStartDate;
      let endDate = selectedEndDate;
      if (isAfter(convertDate(startDate), convertDate(endDate))) {
        startDate = selectedEndDate;
        endDate = selectedStartDate;
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
      }
      const dateRangeStr = `${startDate} — ${endDate}`;
      const dateRangeObject = { from: convertDate(startDate), to: convertDate(endDate) };
      setSelectedRange(dateRangeStr);
      setDateRange(dateRangeObject);
    } else {
      resetDateFields();
    }
    setDropdownActive(false);
  };

  const resetDateFields = () => {
    const to = dateRange?.to;
    const from = dateRange?.from;
    if (to && from) {
      setSelectedStartDate(monthFullNames[from.getMonth()] + ' ' + from.getFullYear());
      setSelectedEndDate(monthFullNames[to.getMonth()] + ' ' + to.getFullYear());
    } else {
      setSelectedStartDate('');
      setSelectedEndDate('');
    }
  };
  const handleCancel = () => {
    resetDateFields();
    setDropdownActive(false);
  };

  const getAllYears = range => {
    if (range?.from && range?.to) {
      const startDate = convertDate(range.from).getFullYear();
      const endDate = convertDate(range.to).getFullYear();
      const years = [];
      for (let i = endDate; i >= startDate; i--) {
        years.push(i.toString());
      }
      return years;
    }
  };

  useEffect(() => {
    setAllYear(getAllYears(datasetDateRange));
  }, [datasetDateRange]);

  return (
    <div className={dateRangePicker}>
      <DropdownContainer dropdownButton={button} setActive={setDropdownActive} containerWidth="230px">
        {dropdownActive && (
          <div className={dropdownContent}>
            <div className={datePickers}>
              <MonthPicker text="From" setSelectedDate={setSelectedStartDate} selectedDate={selectedStartDate}
                           allYears={allYears} />
              <MonthPicker text="To" setSelectedDate={setSelectedEndDate} selectedDate={selectedEndDate}
                           allYears={allYears} />
            </div>
            <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
          </div>
        )}
      </DropdownContainer>
    </div>
  );
};

export default DateRangeMonthPicker;
