import React, { FunctionComponent, useEffect, useState } from 'react';
import { monthFullNames } from '../../../utils/api-utils';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { monthYearContainer, filterLabel } from './month-year-filter.module.scss';

const generateYearOptions = (earliestDate: Date, latestDate: Date) => {
  const startYear = new Date(earliestDate).getFullYear();
  const endYear = new Date(latestDate).getFullYear();
  const yearOptions = [];

  for (let year = endYear; year >= startYear; year--) {
    console.log(year);
    yearOptions.push({ label: year.toString(), value: year });
  }

  return yearOptions;
};

type MonthYearFilterProps = {
  selectedTable?: {
    earliestDate: Date;
    latestDate: Date;
    apiFilter?: {
      label: string;
      field: string;
      labelField?: string;
      notice: string;
      optionValues: { key: string };
      optionLabels?: { key: string };
      dataUnmatchedMessage: string;
      dataSearchLabel: string;
      fieldFilter?: {
        value: string[];
        field: string;
      };
    };
  };
  setDateRange: (range: { from: Date; to: Date }) => void;
};

const MonthYearFilter: FunctionComponent<MonthYearFilterProps> = ({ selectedTable, setDateRange }) => {
  const defaultMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState({ value: defaultMonth + 1, label: monthFullNames[defaultMonth] });
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState({ value: defaultYear, label: defaultYear });
  const [years, setYears] = useState<{ label: string; value: string }[]>();

  const months = monthFullNames.map((month, index) => ({
    label: month,
    value: index + 1,
  }));
  useEffect(() => {
    setYears(generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate));
  }, [selectedTable]);

  useEffect(() => {
    const startDate = new Date(defaultYear, defaultMonth, 1);
    const endDate = new Date(defaultYear, defaultMonth + 1, 0);
    setSelectedMonth({ value: defaultMonth + 1, label: monthFullNames[defaultMonth] });
    setSelectedYear({ value: defaultYear, label: defaultYear });
    setDateRange({ from: startDate, to: endDate });
  }, [selectedTable]);

  useEffect(() => {
    const startDate = new Date(selectedYear.value, selectedMonth.value - 1, 1);
    const endDate = new Date(selectedYear.value, selectedMonth.value, 0);
    setDateRange({ from: startDate, to: endDate });
  }, [selectedMonth, selectedYear]);

  const updateYear = selection => {
    console.log('year selection', selection);
    if (selection !== null) {
      setSelectedYear(selection);
    }
  };
  const updateMonth = selection => {
    console.log('month selection', selection);

    if (selection !== null) {
      setSelectedMonth(selection);
    }
  };

  return (
    <>
      {years && (
        <div className={monthYearContainer}>
          <ComboCurrencySelect
            label="Month"
            labelClass={filterLabel}
            options={months}
            changeHandler={updateMonth}
            selectedOption={selectedMonth}
            containerBorder={true}
            searchBarLabel="Search Months"
          />
          <ComboCurrencySelect
            label="Year"
            labelClass={filterLabel}
            options={years}
            changeHandler={updateYear}
            selectedOption={selectedYear}
            searchBarLabel="Search Years"
            containerBorder={true}
          />
        </div>
      )}
    </>
  );
};

export default MonthYearFilter;
