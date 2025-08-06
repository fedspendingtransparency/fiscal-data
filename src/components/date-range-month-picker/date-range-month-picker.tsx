import React, { FunctionComponent, useEffect, useState } from 'react';
import { datePickers, dropdownContent } from './date-range-month-picker.module.scss';
import MonthPicker from './month-picker/month-picker';
import { convertDate } from '../dataset-data/dataset-data-helper/dataset-data-helper';
import { isAfter } from 'date-fns';
import { monthFullNames } from '../../utils/api-utils';

const DateRangeMonthPicker: FunctionComponent = ({ setDateRange, datasetDateRange, setIsChartLoading }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [allYears, setAllYear] = useState<string[]>();
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const buildAvailableDates = (range) => {
    if (!range?.from || !range?.to) return [];
    const start = convertDate(range.from);
    const end = convertDate(range.to);
    if (!start || !end) return [];

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();


    const dateList= [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= last) {
      const currentYear = cursor.getFullYear();
      const currentMonth = cursor.getMonth();
      const isCompletedMonth = (currentYear < nowYear) || (currentYear === nowYear && currentMonth < nowMonth);

      if (isCompletedMonth) {
        dateList.push(`${monthFullNames[currentMonth]} ${currentYear}`)
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return dateList;
  };

  const getAllYears = (range) => {
    if (!range?.from || !range?.to) return [];
    const startYear = convertDate(range.from).getFullYear();
    const endYear = convertDate(range.to).getFullYear();
    const years: string[] = [];
    for (let y = endYear; y >= startYear; y--) years.push(y.toString());
    return years;
  };

  useEffect(() => {
    setAllYear(getAllYears(datasetDateRange));
    setAvailableDates(buildAvailableDates(datasetDateRange));
  }, [datasetDateRange]);

  useEffect(() => {
    if (!selectedStartDate && !selectedEndDate) return;
    setIsChartLoading(true);

    let startDate = selectedStartDate;
    let endDate = selectedEndDate;

    if (selectedStartDate && !selectedEndDate) {
      endDate = selectedStartDate;
    } else if (!selectedStartDate && selectedEndDate) {
      startDate = selectedEndDate;
    } else if (isAfter(convertDate(startDate), convertDate(endDate))) {
      startDate = selectedEndDate;
      endDate = selectedStartDate;
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
    }

    setDateRange({ from: convertDate(startDate), to: convertDate(endDate) });
  }, [selectedStartDate, selectedEndDate]);

  return (
    <div className={dropdownContent}>
      <div className={datePickers}>
        <MonthPicker
          text="From"
          setSelectedDate={setSelectedStartDate}
          selectedDate={selectedStartDate}
          allYears={allYears}
          availableDates={availableDates}
        />
        <MonthPicker
          text="To"
          setSelectedDate={setSelectedEndDate}
          selectedDate={selectedEndDate}
          allYears={allYears}
          availableDates={availableDates}
        />
      </div>
    </div>
  );
};

export default DateRangeMonthPicker;
