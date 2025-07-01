import React, { FunctionComponent } from 'react';
import DateColumnFilter from './date-column-filter/date-column-filter';
import SearchFilter from '../../../../search-filter/search-filter';
import MonthYearFilter from './month-year-filter/month-year-filter';

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
}) => {
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
      {selectedColumn.dataType !== 'DATE' && <SearchFilter searchLabel="Enter filter term" hideIcons={true} columnConfig={selectedColumn} />}
    </>
  );
};

export default ColumnFilterOptions;
