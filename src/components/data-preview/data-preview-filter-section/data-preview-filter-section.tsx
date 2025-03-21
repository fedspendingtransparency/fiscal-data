import React, {FunctionComponent, ReactElement} from 'react';
import DataPreviewDownloadWrapper from './data-preview-download-wrapper/data-preview-download-wrapper';
import {pxToNumber} from '../../../helpers/styles-helper/styles-helper';
import {
  filterAndDownloadContainer,
  filterContainer,
  toggleDownloadContainer
} from './data-preview-filter-section.module.scss';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import ColumnFilter from './column-filter/column-filter';
import {breakpointXl} from '../data-preview.module.scss';
import {withWindowSize} from 'react-fns';
import ChartTableToggle from '../data-preview-chart-table-toggle/chart-table-toggle';
import { differenceInHours } from 'date-fns';
import { DataPreviewFilterSectionProps } from '../../../models/data-preview/IFilterSectionProps';

type DataPreviewFilterSectionProps = {
  width?: number;
  children: ReactElement | string;
  dateRange;
  isFiltered;
  selectedTable;
  selectedPivot;
  dataset;
  allTablesSelected: boolean;
  isCustomDateRange: boolean;
  selectedUserFilter;
  tableColumnSortData;
  filteredDateRange;
  selectedDetailViewFilter;
  apiFilterDefault;
  viewMode: string;
  setViewMode: (mode: string) => void;
};

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
  setIsFiltered,
  handleDateRangeChange,
  setIsCustomDateRange,
  finalDatesNotFound,
  detailApi,
  detailViewState,
  apiData,
  setViewMode,
  viewMode,
}) => {
  const isDisabled = apiFilterDefault;
  const { dataDisplays, userFilter } = selectedTable;
  const { pivotView } = selectedPivot ?? {};
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
            allTablesSelected={allTablesSelected}
            handleDateRangeChange={handleDateRangeChange}
            setIsCustomDateRange={setIsCustomDateRange}
            finalDatesNotFound={finalDatesNotFound}
            detailApi={detailApi}
            detailViewState={detailViewState}
            apiData={apiData}
          />
          <ColumnFilter allTablesSelected={allTablesSelected} isDisabled={isDisabled} />
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
