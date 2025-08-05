import React, { FunctionComponent, useEffect, useState } from 'react';
import { datePickers, dropdownContent } from './date-range-month-picker.module.scss';
import MonthPicker from './month-picker/month-picker';
import { convertDate } from '../dataset-data/dataset-data-helper/dataset-data-helper';
import { isAfter } from 'date-fns';

const DateRangeMonthPicker: FunctionComponent = ({ setDateRange, datasetDateRange }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [allYears, setAllYear] = useState<string[]>();

  useEffect(() => {
    let startDate = selectedStartDate;
    let endDate = selectedEndDate;
    if (selectedStartDate && !selectedEndDate) {
      endDate = selectedStartDate;
    } else if (!selectedStartDate && selectedEndDate) {
      startDate = selectedEndDate;
    } else {
      if (isAfter(convertDate(startDate), convertDate(endDate))) {
        startDate = selectedEndDate;
        endDate = selectedStartDate;
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
      }
    }
    setDateRange({ from: convertDate(startDate), to: convertDate(endDate) });
  }, [selectedStartDate, selectedEndDate]);

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
    <div className={dropdownContent}>
      <div className={datePickers}>
        <MonthPicker text="From" setSelectedDate={setSelectedStartDate} selectedDate={selectedStartDate} allYears={allYears} />
        <MonthPicker text="To" setSelectedDate={setSelectedEndDate} selectedDate={selectedEndDate} allYears={allYears} />
      </div>
    </div>
  );
};

export default DateRangeMonthPicker;
