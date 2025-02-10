import { FunctionComponent, ReactElement } from 'react';
import React from 'react';
import DataPreviewDownload from './data-preview-download/data-preview-download';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { filterAndDownloadContainer, filterContainer, toggleDownloadContainer } from './data-preview-filter-section.module.scss';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import ColumnFilter from './column-filter/column-filter';
import { breakpointXl } from '../data-preview.module.scss';
import { withWindowSize } from 'react-fns';
import ChartTableToggle from '../data-preview-chart-table-toggle/chart-table-toggle';

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
};

const DataPreviewFilterSection: FunctionComponent<DataPreviewFilterSectionProps> = ({
  width,
  children,
  dateRange,
  isFiltered,
  selectedTable,
  selectedPivot,
  dataset,
  allTablesSelected,
  isCustomDateRange,
  selectedUserFilter,
  tableColumnSortData,
  filteredDateRange,
  selectedDetailViewFilter,
}) => {
  const getChartingInfo = () => {
    return selectedPivot && pivotView && !!pivotView.chartType && pivotView.chartType !== 'none';
  };
  const { pivotView } = selectedPivot ?? {};

  return (
    <>
      <div className={filterAndDownloadContainer}>
        <div className={filterContainer}>
          <DataPreviewTableFilters />
          <ColumnFilter allTablesSelected={allTablesSelected} />
          {width < pxToNumber(breakpointXl) && getChartingInfo() && <ChartTableToggle />}
        </div>
        {width >= pxToNumber(breakpointXl) && (
          <div className={toggleDownloadContainer}>
            {getChartingInfo() && <ChartTableToggle />}
            <DataPreviewDownload
              width={width}
              dateRange={dateRange}
              isFiltered={isFiltered}
              selectedTable={selectedTable}
              dataset={dataset}
              allTablesSelected={allTablesSelected}
              isCustomDateRange={isCustomDateRange}
              selectedUserFilter={selectedUserFilter}
              tableColumnSortData={tableColumnSortData}
              filteredDateRange={filteredDateRange}
              selectedDetailViewFilter={selectedDetailViewFilter}
            />
          </div>
        )}
      </div>
      {children}
      {width < pxToNumber(breakpointXl) && (
        <DataPreviewDownload
          width={width}
          dateRange={dateRange}
          isFiltered={isFiltered}
          selectedTable={selectedTable}
          dataset={dataset}
          allTablesSelected={allTablesSelected}
          isCustomDateRange={isCustomDateRange}
          selectedUserFilter={selectedUserFilter}
          tableColumnSortData={tableColumnSortData}
          filteredDateRange={filteredDateRange}
          selectedDetailViewFilter={selectedDetailViewFilter}
        />
      )}
    </>
  );
};

export default withWindowSize(DataPreviewFilterSection);
