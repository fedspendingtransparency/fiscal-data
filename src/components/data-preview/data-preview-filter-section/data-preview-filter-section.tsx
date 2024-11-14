import React, { FunctionComponent } from 'react';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import ColumnFilter from './column-filter/column-filter';
import { filterContainer } from './data-preview-filter-section.module.scss';

const DataPreviewFilterSection: FunctionComponent = () => {
  return (
    <div className={filterContainer}>
      <DataPreviewTableFilters />
      <ColumnFilter />
    </div>
  );
};

export default DataPreviewFilterSection;
