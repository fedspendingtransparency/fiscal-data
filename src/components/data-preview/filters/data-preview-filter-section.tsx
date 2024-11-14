import React, { FunctionComponent } from 'react';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import ColumnFilter from './column-filter/column-filter';

const DataPreviewFilterSection: FunctionComponent = () => {
  return (
    <>
      <DataPreviewTableFilters />
      <ColumnFilter />
    </>
  );
};

export default DataPreviewFilterSection;
