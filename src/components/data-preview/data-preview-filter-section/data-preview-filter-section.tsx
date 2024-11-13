import { FunctionComponent, useEffect, useState } from 'react';
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

type DataPreviewFilterSectionProps = {
  children;
  dateRange;
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
      <p>Filtering placeholder in DataPreviewFilterSection</p>
      <DataPreviewDownload
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
    </>
  );
};

export default DataPreviewFilterSection;
