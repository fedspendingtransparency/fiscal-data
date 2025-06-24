import React, { FunctionComponent } from 'react';
import DateColumnFilter from './date-column-filter/date-column-filter';
import SearchFilter from '../../../../search-filter/search-filter';

interface IColumnFilterOptions {
  selectedColumn;
  selectedTable;
  config;
  activePresetKey;
  pickerDateRange;
  presets;
}

const ColumnFilterOptions: FunctionComponent<IColumnFilterOptions> = ({
  selectedColumn,
  selectedTable,
  config,
  activePresetKey,
  pickerDateRange,
  presets,
}) => {
  return (
    <>
      {selectedColumn.dataType === 'DATE' && !selectedTable?.apiFilter?.disableDateRangeFilter && (
        <DateColumnFilter
          columnConfig={selectedColumn}
          selectedTable={selectedTable}
          config={config}
          presets={presets}
          activePresetKey={activePresetKey}
          pickerDateRange={pickerDateRange}
        />
      )}
      {selectedColumn.dataType !== 'DATE' && !selectedTable?.apiFilter?.disableDateRangeFilter && (
        <SearchFilter searchLabel="Enter filter term" header={selectedColumn.prettyName} hideIcons={true} columnConfig={selectedColumn} />
      )}
    </>
  );
};

export default ColumnFilterOptions;
