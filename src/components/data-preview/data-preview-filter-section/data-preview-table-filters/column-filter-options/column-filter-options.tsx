import React, { FunctionComponent, useState } from 'react';
import DateColumnFilter from './date-column-filter/date-column-filter';
import SearchFilter from '../../../../search-filter/search-filter';

interface IColumnFilterOptions {
  selectedColumn;
  config;
  setDateRange;
  allTablesSelected;
  handleDateRangeChange;
  setIsCustomDateRange;
  finalDatesNotFound;
  detailApi;
  detailViewState;
  selectedTable;
}

const ColumnFilterOptions: FunctionComponent<IColumnFilterOptions> = ({
  selectedColumn,
  selectedTable,
  config,
  setDateRange,
  allTablesSelected,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
  presets,
  activePresetKey,
  pickerDateRange,
  setPickerDateRange,
}) => {
  const [filter, setFilter] = useState('');

  return (
    <>
      {selectedColumn.dataType === 'DATE' && !selectedTable?.apiFilter?.disableDateRangeFilter && (
        <DateColumnFilter
          columnConfig={selectedColumn}
          selectedTable={selectedTable}
          config={config}
          setDateRange={setDateRange}
          allTablesSelected={allTablesSelected}
          handleDateRangeChange={handleDateRangeChange}
          setIsCustomDateRange={setIsCustomDateRange}
          finalDatesNotFound={finalDatesNotFound}
          detailApi={detailApi}
          detailViewState={detailViewState}
          apiData={apiData}
          presets={presets}
          activePresetKey={activePresetKey}
          pickerDateRange={pickerDateRange}
          setPickerDateRange={setPickerDateRange}
        />
      )}
      {selectedColumn.dataType !== 'DATE' && !selectedTable?.apiFilter?.disableDateRangeFilter && (
        <SearchFilter
          searchLabel={'Enter filter term'}
          filter={filter}
          header={selectedColumn.prettyName}
          setFilter={setFilter}
          setNoResults={setNoResults}
          hideIcons={true}
        />
      )}
    </>
  );
};

export default ColumnFilterOptions;
