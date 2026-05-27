import React, { FunctionComponent } from 'react';
import DateColumnFilter from './date-column-filter/date-column-filter';
import SearchFilter from '../../../../search-filter/search-filter';
import MonthYearFilter from './month-year-filter/month-year-filter';
import UserFilterDropdown from './user-filter-dropdown/user-filter-dropdown';

interface IColumnFilterOptions {
  selectedColumn;
  selectedTable;
  activePresetKey;
  presetCustomDateRange;
  presets;
}

const ColumnFilterOptions: FunctionComponent<IColumnFilterOptions> = ({
  selectedColumn,
  selectedTable,
  activePresetKey,
  presetCustomDateRange,
  presets,
  filterMap,
  setFilterMap,
  apiData,
}) => {
  const { userFilter, apiFilter } = selectedTable;
  const userFilterDropdown =
    (userFilter?.field || apiFilter?.field) && (selectedColumn.columnName === userFilter?.field || selectedColumn.columnName === apiFilter?.field);
  const monthYearCustomFilter = selectedTable?.dateField === selectedColumn?.columnName && selectedTable?.apiFilter?.disableDateRangeFilter;
  const applyDateRange = () => {
    // Apply date range to table
  };
  return (
    <>
      {selectedColumn.dataType === 'DATE' && monthYearCustomFilter && <MonthYearFilter selectedTable={selectedTable} setDateRange={applyDateRange} />}
      {selectedColumn.dataType === 'DATE' && !monthYearCustomFilter && (
        <DateColumnFilter
          columnConfig={selectedColumn}
          selectedTable={selectedTable}
          presets={presets}
          activePresetKey={activePresetKey}
          presetCustomDateRange={presetCustomDateRange}
        />
      )}
      {selectedColumn.dataType !== 'DATE' && !userFilterDropdown && (
        <SearchFilter
          searchLabel="Enter filter term"
          hideIcons={true}
          columnConfig={selectedColumn}
          filterMap={filterMap}
          setFilterMap={setFilterMap}
        />
      )}
      {selectedColumn.dataType !== 'DATE' && userFilterDropdown && (
        <UserFilterDropdown
          selectedTable={selectedTable}
          apiData={apiData}
          columnConfig={selectedColumn}
          filterMap={filterMap}
          setFilterMap={setFilterMap}
        />
      )}
    </>
  );
};

export default ColumnFilterOptions;
