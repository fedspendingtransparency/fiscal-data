import React from 'react';
import {
  container,
  leftContent,
  rightContent
} from "./filter-download-container.module.scss";
import DownloadWrapper from '../download-wrapper/download-wrapper';

const FilterAndDownload = ({
  children,
  dateRange,
  isFiltered,
  selectedTable,
  dataset,
  allTablesSelected,
  isCustomDateRange,
  selectedUserFilter,
  tableColumnSortData
}) => {
  return (
    <div className={container} data-test-id="filterDownloadContainer">
        <div className={leftContent}>
          {children}
        </div>
        <div className={rightContent}>
          <DownloadWrapper
            dateRange={dateRange}
            isFiltered={isFiltered}
            selectedTable={selectedTable}
            dataset={dataset}
            allTablesSelected={allTablesSelected}
            isCustomDateRange={isCustomDateRange}
            selectedUserFilter={selectedUserFilter}
            tableColumnSortData={tableColumnSortData}
          />
        </div>
    </div>
  )
};

export default FilterAndDownload;
