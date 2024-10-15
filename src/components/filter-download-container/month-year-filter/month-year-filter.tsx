import React, { FunctionComponent, useEffect, useState } from 'react';
import { monthFullNames } from '../../../utils/api-utils';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { monthYearContainer, filterLabel, filterContainer, selectorContainer } from './month-year-filter.module.scss';

const generateYearOptions = (earliestDate: Date, latestDate: Date) => {
  const startYear = new Date(earliestDate).getFullYear();
  const endYear = new Date(latestDate).getFullYear();
  const yearOptions = [];

  for (let year = endYear; year >= startYear; year--) {
    yearOptions.push({ label: year, value: year });
  }

  return yearOptions;
};

const generateMonthOptions = () =>
  monthFullNames.map((month, index) => ({
    label: month,
    value: index + 1,
  }));

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
      futureDated: boolean;
    };
  };
  setDateRange: (range: { from: Date; to: Date }) => void;
};

const MonthYearFilter: FunctionComponent<MonthYearFilterProps> = ({ selectedTable, setDateRange }) => {
  const defaultMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState({ value: defaultMonth + 1, label: monthFullNames[defaultMonth] });
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState({ value: defaultYear, label: defaultYear });
  const [years, setYears] = useState<{ label: number; value: number }[]>();
  const [months, setMonths] = useState<{ label: string; value: number }[]>();
  useEffect(() => {
    setYears(generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate));
  }, [selectedTable]);

  useEffect(() => {
    setMonths(generateMonthOptions());
  }, []);

  useEffect(() => {
    const startDate = new Date(defaultYear, defaultMonth, 1);
    const endDate = new Date(defaultYear, defaultMonth + 1, 0);
    setSelectedMonth({ value: selectedTable?.apiFilter?.futureDated ? defaultMonth + 2 : defaultMonth + 1, label: monthFullNames[defaultMonth] });
    setSelectedYear({ value: defaultYear, label: defaultYear });
    setDateRange({ from: startDate, to: endDate });
  }, [selectedTable]);

  useEffect(() => {
    const startDate = new Date(selectedYear.value, selectedMonth.value - 1, 1);
    const endDate = new Date(selectedYear.value, selectedMonth.value, 0);
    setDateRange({ from: startDate, to: endDate });
  }, [selectedMonth, selectedYear]);

  const updateYear = (selection: { label: number; value: number }) => {
    if (selection !== null) {
      setSelectedYear(selection);
    }
  };
  const updateMonth = (selection: { label: string; value: number }) => {
    if (selection !== null) {
      setSelectedMonth(selection);
    }
  };

  return (
    <>
      {years && months && (
        <div className={monthYearContainer}>
          <div className={filterLabel}>Choose a Date:</div>
          <div className={selectorContainer}>
            <div className={filterContainer}>
              <ComboCurrencySelect
                label="Month"
                options={months}
                changeHandler={updateMonth}
                selectedOption={selectedMonth}
                searchBarLabel="Search Months"
                containerBorder
              />
            </div>
            <div className={filterContainer}>
              <ComboCurrencySelect
                label="Year"
                options={years}
                changeHandler={updateYear}
                selectedOption={selectedYear}
                searchBarLabel="Search Years"
                containerBorder
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MonthYearFilter;
