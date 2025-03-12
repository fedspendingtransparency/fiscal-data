import React, { FunctionComponent } from 'react';
import DateColumnFilter from './date-column-filter/date-column-filter';

interface IColumnFilterOptions {
  selectedColumn: { name: string; type: string };
  config;
  setDateRange;
  allTablesSelected;
  setIsFiltered;
  handleDateRangeChange;
  setIsCustomDateRange;
  finalDatesNotFound;
  detailApi;
  detailViewState;
}

const ColumnFilterOptions: FunctionComponent<IColumnFilterOptions> = ({
  selectedColumn,
  selectedTable,
  config,
  setDateRange,
  allTablesSelected,
  setIsFiltered,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
}) => {
  return (
    <>
      {selectedColumn.type === 'Date' && (
        <DateColumnFilter
          columnConfig={selectedColumn}
          selectedTable={selectedTable}
          config={config}
          setDateRange={setDateRange}
          allTablesSelected={allTablesSelected}
          setIsFiltered={setIsFiltered}
          handleDateRangeChange={handleDateRangeChange}
          setIsCustomDateRange={setIsCustomDateRange}
          finalDatesNotFound={finalDatesNotFound}
          detailApi={detailApi}
          detailViewState={detailViewState}
          apiData={apiData}
        />
      )}
    </>
  );
};

export default ColumnFilterOptions;
