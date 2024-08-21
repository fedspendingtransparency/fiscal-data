import React, { FunctionComponent, useEffect, useState } from 'react';
import { userFilterWrapper, filterLabel } from './user-filter.module.scss';
import NotShownMessage from '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';
import DatatableBanner from '../datatable-banner/datatable-banner';

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
      notice: string;
      optionValues: string[];
      dataUnmatchedMessage: string;
    };
  };
  onUserFilter: (selection: { label: string | number; value?: string | number | null }) => void;
  apiData: {
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
    if (selectedTable?.userFilter?.optionValues && userFilterOptions === null) {
      options = selectedTable.userFilter.optionValues.map(val => ({ label: val, value: val }));
      options.unshift(defaultSelection);
      setUserFilterOptions(options);
    } else if (selectedTable?.apiFilter?.optionValues && userFilterOptions === null) {
      options = selectedTable.apiFilter.optionValues.map(val => ({ label: val, value: val }));
      options.unshift(defaultSelection);
      setUserFilterOptions(options);
    }
  };

  useEffect(() => {
    establishOptions();
  }, [apiData]);

  useEffect(() => {
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
          />
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
