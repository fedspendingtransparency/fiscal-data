import React from 'react';
import { sectionContainer, sectionHeader, sectionBody } from './dataset-section-container.module.scss';

const DatasetSectionContainer = ({ id, children, title }) => {
  return (
    <section id={id} className={sectionContainer} data-testid="sectionContainer">
      <h2 className={sectionHeader} data-testid="sectionHeader">
        {title}
      </h2>
      <div className={sectionBody} data-testid="sectionBody">
        {children}
      </div>
    </section>
  );
};
export default DatasetSectionContainer;
