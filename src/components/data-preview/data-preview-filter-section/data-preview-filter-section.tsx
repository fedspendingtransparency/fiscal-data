import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import determineDateRange, {
  generateAnalyticsEvent,
  generateFormattedDate,
  prepAvailableDates,
} from '../../filter-download-container/range-presets/helpers/helper';
import { addDays, differenceInYears, subQuarters } from 'date-fns';
import { monthNames } from '../../../utils/api-utils';
import { fitDateRangeToTable } from '../../filter-download-container/range-presets/range-presets';
import React from 'react';
import DownloadWrapper from '../../download-wrapper/download-wrapper';
import DataPreviewDownload from './data-preview-download/data-preview-download';
import DateRangeFilter from './date-range-filter/date-range-filter';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { filterAndDownloadContainer, filterContainer } from './data-preview-filter-section.module.scss';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import ColumnFilter from './column-filter/column-filter';
import { breakpointLg } from '../data-preview.module.scss';
import { withWindowSize } from 'react-fns';

type DataPreviewFilterSectionProps = {
  width?: number;
  children: ReactElement | string;  dateRange;
  isFiltered;
  selectedTable;
  dataset;
  allTablesSelected;
  isCustomDateRange;
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
  dataset,
  allTablesSelected,
  isCustomDateRange,
  selectedUserFilter,
  tableColumnSortData,
  filteredDateRange,
  selectedDetailViewFilter,
}) => {
  return (
    <>
      <div className={filterAndDownloadContainer}>
        <div className={filterContainer}>
          <DataPreviewTableFilters />
          <ColumnFilter />
        </div>
        {width >= pxToNumber(breakpointLg) && <DataPreviewDownload
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
        />}
      </div>
      {children}
      {width < pxToNumber(breakpointLg) &&       <DataPreviewDownload
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
      />}

    </>
  );
};

export default withWindowSize(DataPreviewFilterSection);
