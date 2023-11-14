import React from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import DatasetAboutTabs from '../dataset-about-tabs/dataset-about-tabs';

export const title = 'About This Dataset';

const DatasetAbout = ({ config, test }) => {
  return (
    <DatasetSectionContainer title={title} id="about-this-dataset">
      <DatasetAboutTabs config={config} test={test} />
    </DatasetSectionContainer>
  );
};
export default DatasetAbout;
