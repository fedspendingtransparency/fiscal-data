import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownContainer from '../../../../../dropdown-container/dropdown-container';
import DropdownLabelButton from '../../../../../dropdown-label-button/dropdown-label-button';
import ComboSelectDropdown from '../../../../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { sectionContainer } from './user-filter.module.scss';

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
  apiData?: {
    data?: [{ [key: string]: string }];
    meta?: { [key: string]: string | Record<string, unknown> };
  };
  allTablesSelected?: boolean;
  sharedApiFilterOptions?: boolean;
};

const UserFilterDropdown: FunctionComponent<UserFilterProps> = ({
  selectedTable,
  apiData,
  allTablesSelected,
  sharedApiFilterOptions,
  filterMap,
  setFilterMap,
  columnConfig,
}) => {
  const [active, setActive] = useState(false);
  const defaultSelection = { label: '(None selected)', value: null };

  const [userFilterOptions, setUserFilterOptions] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState(defaultSelection);

  const updateUserFilter = selection => {
    if (selection !== null) {
      setSelectedFilterOption(selection);
      const map = JSON.parse(JSON.stringify(filterMap));
      map[columnConfig.columnName].pendingValue = selection.label;
      setFilterMap(map);
      setActive(false);
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
    if (!sharedApiFilterOptions) {
      setSelectedFilterOption(defaultSelection);
    }
  }, [selectedTable, allTablesSelected]);

  const filterDropdownButton = (
    <DropdownLabelButton selectedOption={selectedFilterOption.label} active={active} setActive={setActive} dropdownWidth="320px" />
  );

  return (
    <div className={sectionContainer}>
      <DropdownContainer dropdownButton={filterDropdownButton} setActive={setActive}>
        {active && (
          <ComboSelectDropdown
            selectedOption={selectedFilterOption}
            setDropdownActive={setActive}
            active={active}
            searchBarLabel={selectedTable?.apiFilter ? selectedTable.apiFilter.dataSearchLabel : 'Search currencies'}
            options={userFilterOptions}
            optionLabelKey="label"
            updateSelection={updateUserFilter}
          />
        )}
      </DropdownContainer>
    </div>
  );
};

export default UserFilterDropdown;
