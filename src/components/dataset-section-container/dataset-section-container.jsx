import React from 'react';
import * as styles from './dataset-section-container.module.scss';

const DatasetSectionContainer = ({id, children, title}) => {
  return (
    <section id={id} className={styles.sectionContainer} data-testid="sectionContainer">
      <h2 className={styles.sectionHeader} data-testid="sectionHeader">
        {title}
      </h2>
      <div className={styles.sectionBody} data-testid="sectionBody">
        {children}
      </div>
    </section>
  )
}
export default DatasetSectionContainer;
