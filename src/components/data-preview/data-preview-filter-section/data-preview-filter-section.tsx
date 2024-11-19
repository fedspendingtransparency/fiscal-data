import React, { FunctionComponent, ReactElement } from 'react';
import DataPreviewTableFilters from './data-preview-table-filters/data-preview-table-filters';
import ColumnFilter from './column-filter/column-filter';
import { filterContainer, filterAndDownloadContainer } from './data-preview-filter-section.module.scss';
import DataPreviewDownload from './data-preview-download/data-preview-download';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';

interface IDataPreviewFilterSection {
  width?: number;
  children: ReactElement | string;
}

const DataPreviewFilterSection: FunctionComponent<IDataPreviewFilterSection> = ({ children, width }) => {
  return (
    <>
      <div className={filterAndDownloadContainer}>
        <div className={filterContainer}>
          <DataPreviewTableFilters />
          <ColumnFilter />
        </div>
        {width >= pxToNumber(breakpointLg) && <DataPreviewDownload width={width} />}
      </div>
      {children}
      {width < pxToNumber(breakpointLg) && <DataPreviewDownload width={width} />}
    </>
  );
};

export default withWindowSize(DataPreviewFilterSection);
