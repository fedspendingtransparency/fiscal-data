import React, { FunctionComponent, useEffect, useState } from 'react';
import { monthFullNames } from '../../../utils/api-utils';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { monthYearContainer, filterLabel, filterContainer, selectorContainer } from './month-year-filter.module.scss';
import { he } from 'date-fns/locale';

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
  const [closeYearDropdown, setCloseYearDropdown] = useState(false);
  const [closeMonthDropdown, setCloseMonthDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({
    value: selectedTable?.apiFilter?.futureDated ? defaultMonth + 2 : defaultMonth + 1,
    label: monthFullNames[defaultMonth],
  });
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState({ value: defaultYear, label: defaultYear });
  const [years, setYears] = useState<{ label: number; value: number }[]>();
  const [months, setMonths] = useState<{ label: string; value: number }[]>();

  useEffect(() => {
    console.log('Year dropdown close:', closeYearDropdown);
  }, [closeYearDropdown]);

  useEffect(() => {
    console.log('Month dropdown close:', closeMonthDropdown);
  }, [closeMonthDropdown]);

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
      if (selectedTable?.apiFilter?.futureDated) {
        if (selection.value + 1 <= 12) {
          setSelectedMonth({ label: selection.label, value: selection.value + 1 });
        } else {
          setSelectedMonth({ label: selection.label, value: 1 });
          setSelectedYear(state => ({ label: state.label, value: state.value + 1 }));
        }
      } else {
        setSelectedMonth(selection);
      }
    }
  };

  const hello = () => {
    console.log('hello');
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
                closeSiblingDropdown={closeMonthDropdown}
                setCloseSiblingDropdown={hello}
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
                closeSiblingDropdown={closeYearDropdown}
                setCloseSiblingDropdown={hello}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MonthYearFilter;
