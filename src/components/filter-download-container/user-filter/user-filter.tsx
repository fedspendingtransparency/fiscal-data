import React, { FunctionComponent, useEffect, useState } from 'react';
import { userFilterWrapper, filterLabel } from './user-filter.module.scss';
import NotShownMessage from '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import DatatableBanner from '../datatable-banner/datatable-banner';
import MonthYearFilter from '../month-year-filter/month-year-filter';

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
      disableDateRangeFilter: boolean;
      customDateFilter?: {
        startDateField: string;
        endDateField: string;
        dateRange: string;
      };
    };
    earliestDate: Date;
    latestDate: Date;
  };
  onUserFilter: (selection: { label: string | number; value?: string | number | null }) => void;
  apiData?: {
    data?: [{ [key: string]: string }];
    meta?: { [key: string]: string | Record<string, unknown> };
  };
  setResetFilters?: (x: boolean) => void;
  allTablesSelected?: boolean;
  setDateRange: (range: { from: Date; to: Date }) => void;
};

const UserFilter: FunctionComponent<UserFilterProps> = ({
  selectedTable,
  onUserFilter,
  apiData,
  setResetFilters,
  allTablesSelected,
  setDateRange,
}) => {
  const defaultSelection = { label: '(None selected)', value: null };

  const [userFilterOptions, setUserFilterOptions] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState(defaultSelection);

  const updateUserFilter = selection => {
    if (selection !== null) {
      setSelectedFilterOption(selection);
      onUserFilter(selection);
      if (setResetFilters) {
        setResetFilters(true);
      }
    }
  };

  const establishOptions = () => {
    let options = null;
    let nestedOptions = null;
    if (selectedTable?.userFilter?.optionValues) {
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
        options.sort((a, b) => a.label.localeCompare(b.label));
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

  useEffect(() => {
    establishOptions();
  }, [apiData]);

  useEffect(() => {
    establishOptions();
    setSelectedFilterOption(defaultSelection);
    console.log('hi');
  }, [selectedTable, allTablesSelected]);

  useEffect(() => {
    console.log(defaultSelection);
  }, [allTablesSelected]);

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
          {selectedTable?.apiFilter?.disableDateRangeFilter && <MonthYearFilter selectedTable={selectedTable} setDateRange={setDateRange} />}
        </div>
      )}
      {selectedTable?.userFilter?.notice && <DatatableBanner bannerNotice={selectedTable.userFilter.notice} />}
      {selectedTable?.apiFilter?.notice && <DatatableBanner bannerNotice={selectedTable.apiFilter.notice} />}
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
