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
  return (
    <>
      {selectedColumn.dataType === 'DATE' && monthYearCustomFilter && (
        <MonthYearFilter selectedTable={selectedTable} setDateRange={() => console.log('set date range')} />
      )}
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
