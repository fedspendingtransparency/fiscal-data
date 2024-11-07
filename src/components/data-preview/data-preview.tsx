import React, { FunctionComponent } from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';

type DataPreviewProp = {
  placeholder;
};

const DataPreview: FunctionComponent<DataPreviewProp> = ({ placeholder }) => {
  return (
    <DatasetSectionContainer>
      <p>Data Preview Placeholder</p>
    </DatasetSectionContainer>
  );
};

export default DataPreview;
