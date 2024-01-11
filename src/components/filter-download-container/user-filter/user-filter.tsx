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
  };
  onUserFilter: (selection: { label: string | number; value?: string | number | null }) => void;
  apiData: {
    data?: [{ [key: string]: string }];
    meta?: { [key: string]: string | Record<string, unknown> };
  };
  setResetFilters?: (x: boolean) => void;
};

const UserFilter: FunctionComponent<UserFilterProps> = ({ selectedTable, onUserFilter, apiData, setResetFilters }) => {
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
    }
  };

  useEffect(() => {
    establishOptions();
  }, [apiData]);

  return (
    <>
      {selectedTable.userFilter && userFilterOptions && (
        <div className={userFilterWrapper}>
          <ComboCurrencySelect
            label={`${selectedTable.userFilter.label}:`}
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
  },
  userFilterSelection?: {
    label: string;
    value: string;
  },
  userFilteredData?: {
    data?: [{ [key: string]: string }] | [];
  }
): boolean => selectedTable?.userFilter?.label && userFilterSelection?.value && userFilteredData?.data && userFilteredData?.data.length === 0;

export const getMessageForUnmatchedUserFilter = (selectedTable: { userFilter?: { [key: string]: unknown } }): JSX.Element => (
  <>
    {selectedTable.userFilter && selectedTable.userFilter.label && selectedTable.userFilter.dataUnmatchedMessage && (
      <NotShownMessage
        heading={`The ${selectedTable.userFilter.label} specified does not have
                available data within the date range selected.`}
        bodyText={selectedTable.userFilter.dataUnmatchedMessage}
      />
    )}
  </>
);
