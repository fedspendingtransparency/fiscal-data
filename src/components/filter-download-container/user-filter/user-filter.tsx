import React, { FunctionComponent, useEffect, useState } from 'react';
import { userFilterWrapper, filterLabel } from './user-filter.module.scss';
import NotShownMessage from '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import DatatableBanner from '../datatable-banner/datatable-banner';
import { monthFullNames } from '../../../utils/api-utils';
import { mockSavingsBondLastFiscalYearCurrentMonth } from '../../../layouts/explainer/explainer-test-helper';

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

const UserFilter: FunctionComponent<UserFilterProps> = ({ selectedTable, onUserFilter, apiData, setResetFilters, allTablesSelected }) => {
  const defaultSelection = { label: '(None selected)', value: null };

  const [userFilterOptions, setUserFilterOptions] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState(defaultSelection);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(new Date().getMonth() + 1);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

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

  useEffect(() => {
    if (selectedTable.apiFilter.disableDateRangeFilter) {
      onUserFilter({
        year: selectedYear,
        month: selectedMonth,
      });
    }
  }, [selectedMonth, selectedYear, selectedTable]);
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
  const updateUserFilter = selection => {
    if (selection !== null) {
      setSelectedFilterOption(selection);
      onUserFilter(selection);
      if (setResetFilters) {
        setResetFilters(true);
      }
    }
  };

  const months = monthFullNames.map((month, index) => ({
    label: month,
    value: index + 1,
  }));
  const years = generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate);

  // const applyFilter = () => {
  //   if (selectedMonth?.value && selectedYear?.value) {
  //     onUserFilter({ month: selectedMonth.value, year: selectedYear.value });
  //   }
  // };

  console.log(selectedTable, 'selectedTableselectedTableselectedTableselectedTableselectedTable');
  const establishOptions = () => {
    let options = null;
    let nestedOptions = null;
    if (selectedTable?.userFilter?.optionValues && userFilterOptions === null) {
      options = selectedTable.userFilter.optionValues.map(val => {
        return { label: val, value: val };
      });
      options.unshift(defaultSelection);
      setUserFilterOptions(options);
    } else if (selectedTable?.apiFilter?.optionValues) {
      if (selectedTable.apiFilter.fieldFilter?.value) {
        const filterOptions = selectedTable.apiFilter.fieldFilter.value;
        nestedOptions = [{ default: true, children: [defaultSelection] }];
        for (let i = 0; i < filterOptions.length; i++) {
          const filter = filterOptions[i];
          const nestedChildren = selectedTable.apiFilter.optionValues[filter].map(val => ({ label: val, value: val }));
          nestedOptions.push({ label: filter, children: nestedChildren });
        }
      } else if (selectedTable.apiFilter?.optionLabels) {
        const allLabels = selectedTable.apiFilter.optionLabels;
        options = selectedTable.apiFilter.optionValues['all'].map(val => {
          const label = allLabels[val];
          if (label) return { label: label, value: val };
        });
      } else {
        options = selectedTable.apiFilter.optionValues['all'].map(val => ({ label: val, value: val }));
      }
      if (nestedOptions) {
        setUserFilterOptions(nestedOptions);
      } else {
        options.unshift(defaultSelection);
        setUserFilterOptions(options);
      }
    }
  };

  // useEffect(() => {
  //   // Reapply the filter whenever month or year changes
  //   applyFilter();
  // }, [selectedMonth, selectedYear]);

  useEffect(() => {
    establishOptions();
  }, [apiData]);

  useEffect(() => {
    establishOptions();
    setSelectedFilterOption(defaultSelection);
  }, [selectedTable]);

  return (
    <>
      {(selectedTable.userFilter || selectedTable.apiFilter) && userFilterOptions && !allTablesSelected && (
        <div className={userFilterWrapper}>
          <ComboCurrencySelect
            label={`${selectedTable.userFilter ? selectedTable.userFilter.label : selectedTable.apiFilter.label}:`}
            labelClass={filterLabel}
            options={userFilterOptions}
            changeHandler={updateUserFilter}
            selectedOption={selectedFilterOption}
            containerBorder={true}
            searchBarLabel={selectedTable?.apiFilter ? selectedTable.apiFilter.dataSearchLabel : undefined}
            hasChildren={userFilterOptions[0]?.children}
          />
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
        </div>
      )}
      {selectedTable?.userFilter?.notice && <DatatableBanner bannerNotice={selectedTable.userFilter.notice} />}
    </>
  );
};

export default UserFilter;

export const determineUserFilterUnmatchedForDateRange = (
  selectedTable: {
    userFilter?: { [key: string]: unknown };
    apiFilter?: { [key: string]: unknown };
  },
  userFilterSelection?: {
    label: string;
    value: string;
  },
  userFilteredData?: {
    data?: [{ [key: string]: string }] | [];
  }
): boolean => {
  if (selectedTable?.userFilter) {
    return selectedTable?.userFilter?.label && userFilterSelection?.value && userFilteredData?.data && userFilteredData?.data.length === 0;
  } else if (selectedTable?.apiFilter) {
    return selectedTable?.apiFilter?.label && userFilterSelection?.value && userFilteredData?.data && userFilteredData?.data.length === 0;
  }
};

export const getMessageForUnmatchedUserFilter = (selectedTable: {
  userFilter?: { [key: string]: unknown };
  apiFilter?: { [key: string]: unknown };
}): JSX.Element => (
  <>
    {selectedTable.userFilter && selectedTable.userFilter.label && selectedTable.userFilter.dataUnmatchedMessage && (
      <NotShownMessage
        heading={
          selectedTable.userFilter?.dataUnmatchedHeader
            ? selectedTable.userFilter?.dataUnmatchedHeader
            : `The ${selectedTable.userFilter.label} specified does not have available data within the date range selected.`
        }
        bodyText={selectedTable.userFilter.dataUnmatchedMessage}
      />
    )}
    {selectedTable.apiFilter && selectedTable.apiFilter.label && selectedTable.apiFilter.dataUnmatchedMessage && (
      <NotShownMessage
        heading={
          selectedTable.apiFilter?.dataUnmatchedHeader
            ? selectedTable.apiFilter?.dataUnmatchedHeader
            : `The ${selectedTable.apiFilter.label} specified does not have available data within the date range selected.`
        }
        bodyText={selectedTable.apiFilter.dataUnmatchedMessage}
      />
    )}
  </>
);

export const getMessageForDefaultApiFilter = (selectedTable: { apiFilter?: { [key: string]: unknown } }): JSX.Element => (
  <>
    {selectedTable?.apiFilter && selectedTable.apiFilter?.dataDefaultHeader && selectedTable.apiFilter?.dataDefaultMessage && (
      <NotShownMessage heading={selectedTable.apiFilter.dataDefaultHeader} bodyText={selectedTable.apiFilter.dataDefaultMessage} />
    )}
  </>
);
