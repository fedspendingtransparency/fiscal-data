import React, { FunctionComponent } from 'react';
import { pivotDataContainer } from '../../data-preview-filter-section/data-preview-mobile-data-table-filters/data-preview-mobile-data-table-filters.module.scss';

export interface IMobileFilterList {
  pivotOptions: { name: string }[];
}

const DataPreviewMobileDataTableFilters: FunctionComponent<IMobileFilterList> = ({ pivotOptions }) => {
  return (
    <>
      <div className={pivotDataContainer}>Test</div>
    </>
  );
};

export default DataPreviewMobileDataTableFilters;
