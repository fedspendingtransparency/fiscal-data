import React, { FunctionComponent } from 'react';
import DataPreviewDownloadWrapper from './data-preview-download-wrapper/data-preview-download-wrapper';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { filterAndDownloadContainer, filterContainer, toggleDownloadContainer } from './data-preview-filter-section.module.scss';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import { breakpointXl } from '../data-preview.module.scss';
import { withWindowSize } from 'react-fns';
import ChartTableToggle from '../data-preview-chart-table-toggle/chart-table-toggle';
import { differenceInHours } from 'date-fns';
import { DataPreviewFilterSectionProps } from '../../../models/data-preview/IFilterSectionProps';
import DataPreviewColumnFilter from './data-preview-column-filter/data-preview-column-filter';

const DataPreviewFilterSection: FunctionComponent<DataPreviewFilterSectionProps> = ({
  width,
  children,
  dateRange,
  setDateRange,
  isFiltered,
  selectedTable,
  selectedPivot,
  dataset,
  allTablesSelected,
  isCustomDateRange,
  selectedUserFilter,
  tableColumnSortData,
  selectedDetailViewFilter,
  apiFilterDefault,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  apiData,
  setViewMode,
  currentDateButton,
  datePreset,
  customRangePreset,
  setIsFiltered,
  datasetDateRange,
}) => {
  const isDisabled = apiFilterDefault;
  const { dataDisplays, userFilter } = selectedTable;
  const { pivotView } = selectedPivot ?? {};
  console.log(dateRange);
  const getChartingInfo = () => {
    const pivotCharting = selectedPivot && pivotView && pivotView.chartType === 'none';
    const dataDisplaysCharting = dataDisplays && dataDisplays.every(dd => dd.chartType === 'none');
    const userFilterCharting = userFilter && !selectedUserFilter?.value;
    const dateRangeCharting = dateRange && dateRange.to && dateRange.from && differenceInHours(dateRange.to, dateRange.from) < 24;
    return !pivotCharting && !dataDisplaysCharting && !allTablesSelected && !userFilterCharting && !dateRangeCharting;
  };

  const downloadComponent = () => (
    <DataPreviewDownloadWrapper
      width={width}
      dateRange={dateRange}
      isFiltered={isFiltered}
      selectedTable={selectedTable}
      dataset={dataset}
      allTablesSelected={allTablesSelected}
      isCustomDateRange={isCustomDateRange}
      selectedUserFilter={selectedUserFilter}
      tableColumnSortData={tableColumnSortData}
      selectedDetailViewFilter={selectedDetailViewFilter}
      isDisabled={isDisabled}
    />
  );

  return (
    <>
      <div className={filterAndDownloadContainer}>
        <div className={filterContainer}>
          <DataPreviewTableFilters
            selectedTable={selectedTable}
            config={dataset}
            setDateRange={setDateRange}
            dateRange2={dateRange}
            allTablesSelected={allTablesSelected}
            handleDateRangeChange={handleDateRangeChange}
            setIsCustomDateRange={setIsCustomDateRange}
            finalDatesNotFound={finalDatesNotFound}
            apiData={apiData}
            width={width}
            currentDateButton={currentDateButton}
            datePreset={datePreset}
            customRangePreset={customRangePreset}
            setIsFiltered={setIsFiltered}
            datasetDateRange={datasetDateRange}
            pivotView={pivotView}
          />
          <DataPreviewColumnFilter allTablesSelected={allTablesSelected} isDisabled={isDisabled} width={width} pivotView={pivotView} />
          {width < pxToNumber(breakpointXl) && getChartingInfo() && <ChartTableToggle onChange={setViewMode} />}
        </div>
        {width >= pxToNumber(breakpointXl) && (
          <div className={toggleDownloadContainer}>
            {getChartingInfo() && <ChartTableToggle onChange={setViewMode} />}
            {downloadComponent()}
          </div>
        )}
      </div>
      {children}
      {width < pxToNumber(breakpointXl) && downloadComponent()}
    </>
  );
};

export default withWindowSize(DataPreviewFilterSection);
