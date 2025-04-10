import React, { FunctionComponent } from 'react';

export interface IMobileFilterList {
  pivotOptions: { name: string }[];
}

const DataPreviewMobileDataTableFilters: FunctionComponent<IMobileFilterList> = ({ pivotOptions }) => {
  return (
    <>
      <p>test</p>
    </>
  );
};

export default DataPreviewMobileDataTableFilters;
