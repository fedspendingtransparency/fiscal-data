import React, { FunctionComponent } from 'react';
import DateColumnFilter from './date-column-filter/date-column-filter';
import SearchFilter from '../../../../search-filter/search-filter';

interface IColumnFilterOptions {
  selectedColumn;
  selectedTable;
  config;
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
  return (
    <>
      {selectedColumn.dataType === 'DATE' && !selectedTable?.apiFilter?.disableDateRangeFilter && (
        <DateColumnFilter
          columnConfig={selectedColumn}
          selectedTable={selectedTable}
          presets={presets}
          activePresetKey={activePresetKey}
          presetCustomDateRange={presetCustomDateRange}
        />
      )}
      {selectedColumn.dataType !== 'DATE' && !selectedTable?.apiFilter?.disableDateRangeFilter && (
        <SearchFilter searchLabel="Enter filter term" hideIcons={true} columnConfig={selectedColumn} />
      )}
    </>
  );
};

export default ColumnFilterOptions;
