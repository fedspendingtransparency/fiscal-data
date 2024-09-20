import React, { FunctionComponent, useEffect, useState } from 'react';
import { monthFullNames } from '../../../utils/api-utils';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import { filterLabel } from '../user-filter/user-filter.module.scss';

const generateYearOptions = (earliestDate, latestDate) => {
  const startYear = new Date(earliestDate).getFullYear();
  const endYear = new Date(latestDate).getFullYear();
  const yearOptions = [];

  for (let year = endYear; year >= startYear; year--) {
    yearOptions.push({ label: year.toString(), value: year });
  }

  return yearOptions;
};

type UserFilterProps = {
  selectedTable?: {
    userFilter?: {
      label: string;
      field: string;
      notice: string;
      optionValues: string[];
      dataUnmatchedMessage: string;
    };
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
  onUserFilter: (selection: { label: string | number; value?: string | number | null }) => void;
  apiData?: {
    data?: [{ [key: string]: string }];
    meta?: { [key: string]: string | Record<string, unknown> };
  };
  setResetFilters?: (x: boolean) => void;
  allTablesSelected?: boolean;
};

const MonthYearFilter: FunctionComponent<UserFilterProps> = ({ selectedTable, onUserFilter, apiData, setResetFilters, allTablesSelected }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(new Date().getMonth() + 1);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const months = monthFullNames.map((month, index) => ({
    label: month,
    value: index + 1,
  }));
  const years = generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate);

  return (
    <>
      <div>
        <span>
          <ComboCurrencySelect
            label={`Month`}
            labelClass={filterLabel}
            options={months}
            changeHandler={e => setSelectedMonth(e.value)}
            selectedOption={{ label: monthFullNames[selectedMonth - 1], value: selectedMonth }}
            containerBorder={true}
            searchBarLabel={selectedTable?.apiFilter ? selectedTable.apiFilter.dataSearchLabel : undefined}
            hasChildren={userFilterOptions[0]?.children}
          />
        </span>
        <span>
          <ComboCurrencySelect
            label={`Year`}
            labelClass={filterLabel}
            options={years}
            changeHandler={setSelectedYear}
            selectedOption={selectedYear}
            containerBorder={true}
          />
          {console.log('selected year', selectedYear)}
        </span>
      </div>
    </>
  );
};

export default MonthYearFilter;
