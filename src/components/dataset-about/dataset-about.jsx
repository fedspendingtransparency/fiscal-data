import React from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DatasetAboutTabs from '../dataset-properties-tabs/dataset-properties-tabs';

export const title = 'Dataset Properties';

const DatasetAbout = ({ config, test }) => {
  return (
    <DatasetSectionContainer title={title} id="dataset-properties">
      <DatasetAboutTabs config={config} test={test} />
    </DatasetSectionContainer>
  );
};
export default DatasetAbout;
