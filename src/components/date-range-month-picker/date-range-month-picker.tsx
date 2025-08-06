import React, { FunctionComponent, useEffect, useState } from 'react';
import { datePickers, dropdownContent } from './date-range-month-picker.module.scss';
import MonthPicker from './month-picker/month-picker';
import { convertDate } from '../dataset-data/dataset-data-helper/dataset-data-helper';
import { isAfter } from 'date-fns';

const DateRangeMonthPicker: FunctionComponent = ({ setDateRange, datasetDateRange, setIsChartLoading }) => {
  console.log(datasetDateRange);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [allYears, setAllYear] = useState<string[]>();

  const getAllYears = range => {
    if (!range?.from || !range?.to) return [];
    const startYear = convertDate(range.from).getFullYear();
    const endYear = convertDate(range.to).getFullYear();
    const years: string[] = [];
    for (let y = endYear; y >= startYear; y--) years.push(y.toString());
    return years;
  };

  useEffect(() => {
    setAllYear(getAllYears(datasetDateRange));
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
          datasetDateRange={datasetDateRange}
        />
        <MonthPicker
          text="To"
          setSelectedDate={setSelectedEndDate}
          selectedDate={selectedEndDate}
          allYears={allYears}
          datasetDateRange={datasetDateRange}
        />
      </div>
    </div>
  );
};

export default DateRangeMonthPicker;
