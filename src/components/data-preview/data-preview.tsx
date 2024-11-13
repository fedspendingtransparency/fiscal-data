import React, { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import Filters from './filters/filters';

type DataPreviewProp = {
  placeholder: string;
};

const DataPreview: FunctionComponent<DataPreviewProp> = ({ placeholder: string }) => {
  return (
    <DatasetSectionContainer id="data-preview" title="">
      <Filters />
      <p>Data Preview Placeholder</p>
    </DatasetSectionContainer>
  );
};

export default DataPreview;
