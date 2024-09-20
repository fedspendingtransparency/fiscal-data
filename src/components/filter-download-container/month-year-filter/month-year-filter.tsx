import React, { FunctionComponent, useEffect, useState } from 'react';
import { monthFullNames } from '../../../utils/api-utils';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { filterLabel } from '../user-filter/user-filter.module.scss';
import { useSetRecoilState } from 'recoil';
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
  userFilterOptions;
};

const MonthYearFilter: FunctionComponent<MonthYearFilterProps> = ({ selectedTable, userFilterOptions }) => {
  const defaultMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState({ value: defaultMonth + 1, label: monthFullNames[defaultMonth] });
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState({ value: defaultYear, label: defaultYear });
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const months = monthFullNames.map((month, index) => ({
    label: month,
    value: index + 1,
  }));
  const years = generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate);

  const setFilteredDateRange = useSetRecoilState(reactTableFilteredDateRangeState);

  // const [availableYears, setAvailableYears] = useState([]);
  // useEffect(() => {
  //   if (selectedTable?.selectColumns) {
  //     const years = new Set();
  //     const months = new Set();
  //     apiData?.data.forEach(row => {
  //       years.add(row[selectedTable.selectColumns.record_calendar_year]);
  //       months.add(row[selectedTable.selectColumns.record_calendar_month]);
  //     });
  //     setAvailableYears(Array.from(years).sort((a, b) => b - a));
  //     setAvailableMonths(Array.from(months).sort((a, b) => a - b));
  //   }
  //   console.log(availableMonths, availableYears);
  // }, [selectedTable, apiData]);

  // useEffect(() => {
  //   if (selectedTable.apiFilter.disableDateRangeFilter) {
  //     onUserFilter({
  //       year: selectedYear,
  //       month: selectedMonth,
  //     });
  //   }
  // }, [selectedMonth, selectedYear, selectedTable]);
  useEffect(() => {
    console.log(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);
  // useEffect(() => {
  //   if (selectedTable) {
  //     const earliestYear = new Date(selectedTable.earliestDate).getFullYear();
  //     const latestyear = new Date(selectedTable.lastUpdated).getFullYear();
  //     const years = Array.from({ length: latestyear - earliestYear + 1 }, (_, i) => {
  //       const year = earliestYear + i;
  //       return { label: year.toString(), value: year };
  //     });
  //     setAvailableYears(years);
  //   }
  // }, [selectedTable]);

  // const applyFilter = () => {
  //   if (selectedMonth?.value && selectedYear?.value) {
  //     onUserFilter({ month: selectedMonth.value, year: selectedYear.value });
  //   }
  // };

  // useEffect(() => {
  //   // Reapply the filter whenever month or year changes
  //   applyFilter();
  // }, [selectedMonth, selectedYear]);

  return (
    <>
      <div>
        <ComboCurrencySelect
          label="Month"
          labelClass={filterLabel}
          options={months}
          changeHandler={e => setSelectedMonth(e.value)}
          selectedOption={selectedMonth}
          containerBorder={true}
          searchBarLabel="Search Months"
        />
        <ComboCurrencySelect
          label="Year"
          labelClass={filterLabel}
          options={years}
          changeHandler={e => setSelectedYear(e.value)}
          selectedOption={selectedYear}
          searchBarLabel="Search Years"
          containerBorder={true}
        />
      </div>
    </>
  );
};

export default MonthYearFilter;
