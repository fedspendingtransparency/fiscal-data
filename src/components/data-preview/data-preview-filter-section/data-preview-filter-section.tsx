import { FunctionComponent, ReactElement, useContext } from 'react';
import React from 'react';
import DataPreviewDownload from './data-preview-download/data-preview-download';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { filterAndDownloadContainer, filterContainer, toggleDownloadContainer } from './data-preview-filter-section.module.scss';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import ColumnFilter from './column-filter/column-filter';
import { breakpointXl } from '../data-preview.module.scss';
import { withWindowSize } from 'react-fns';
import ChartTableToggle from '../data-preview-chart-table-toggle/chart-table-toggle';
import { differenceInHours } from 'date-fns';
import { DatasetDetailContext } from '../../../contexts/dataset-detail-context';
import { useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../recoil/reactTableFilteredState';

type DataPreviewFilterSectionProps = {
  width?: number;
  children: ReactElement | string;
  dateRange;
  isFiltered;
  selectedTable;
  dataset;
  allTablesSelected: boolean;
  isCustomDateRange: boolean;
  selectedDetailViewFilter;
};

const DataPreviewFilterSection: FunctionComponent<DataPreviewFilterSectionProps> = ({
  width,
  children,
  dateRange,
  isFiltered,
  selectedTable,
  dataset,
  isCustomDateRange,
  selectedDetailViewFilter,
}) => {
  const { allTablesSelected, userFilterSelection: selectedUserFilter, tableColumnSortData, selectedPivot } = useContext(DatasetDetailContext);
  const filteredDateRange = useRecoilValue(reactTableFilteredDateRangeState);

  const { dataDisplays, userFilter } = selectedTable;
  const { pivotView } = selectedPivot ?? {};
  const getChartingInfo = () => {
    const pivotCharting = selectedPivot && pivotView && pivotView.chartType === 'none';
    const dataDisplaysCharting = dataDisplays && dataDisplays.every(dd => dd.chartType === 'none');
    const userFilterCharting = userFilter && !selectedUserFilter?.value;
    const dateRangeCharting = dateRange && dateRange.to && dateRange.from && differenceInHours(dateRange.to, dateRange.from) < 24;
    return !pivotCharting && !dataDisplaysCharting && !allTablesSelected && !userFilterCharting && !dateRangeCharting;
  };

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
