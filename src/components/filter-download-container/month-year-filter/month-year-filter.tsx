import React, { FunctionComponent, useEffect, useState } from 'react';
import { monthFullNames } from '../../../utils/api-utils';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { filterLabel } from '../user-filter/user-filter.module.scss';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../recoil/reactTableFilteredState';

const generateYearOptions = (earliestDate, latestDate) => {
  const startYear = new Date(earliestDate).getFullYear();
  const endYear = new Date(latestDate).getFullYear();
  const yearOptions = [];

  for (let year = endYear; year >= startYear; year--) {
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

  const months = monthFullNames.map((month, index) => ({
    label: month,
    value: index + 1,
  }));
  const years = generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate);

  useEffect(() => {
    const startDate = new Date(defaultYear, defaultMonth, 1);
    const endDate = new Date(defaultYear, defaultMonth + 1, 0);
    console.log({ from: startDate, to: endDate });

    setDateRange({ from: startDate, to: endDate });
  }, []);

  useEffect(() => {
    const startDate = new Date(selectedYear.value, selectedMonth.value - 1, 1);
    const endDate = new Date(selectedYear.value, selectedMonth.value, 0);
    console.log({ from: startDate, to: endDate });
    setDateRange({ from: startDate, to: endDate });
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <div>
        <ComboCurrencySelect
          label="Month"
          labelClass={filterLabel}
          options={months}
          changeHandler={setSelectedMonth}
          selectedOption={selectedMonth}
          containerBorder={true}
          searchBarLabel="Search Months"
        />
        <ComboCurrencySelect
          label="Year"
          labelClass={filterLabel}
          options={years}
          changeHandler={setSelectedYear}
          selectedOption={selectedYear}
          searchBarLabel="Search Years"
          containerBorder={true}
        />
      </div>
    </>
  );
};

export default MonthYearFilter;
