import React from 'react';
import DatasetSectionContainer from '../dataset-section-container/dataset-section-container';
import * as styles from './dataset-about.module.scss';
import DatasetAboutTabs from "../dataset-about-tabs/dataset-about-tabs";

export const title = 'About This Dataset';

const DatasetAbout = ({ config, test }) => {

  return (
    <DatasetSectionContainer title={title} id="about-this-dataset">
      <h3 className={styles.heading}>Description:</h3>
      <p className={styles.description} data-testid="description">
        {config.summaryText}
      </p>
      <DatasetAboutTabs config={config} test={test} />
    </DatasetSectionContainer>
  )
};
export default DatasetAbout;
