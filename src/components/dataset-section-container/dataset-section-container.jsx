import React from 'react';
import { sectionBody, sectionContainer, sectionHeader } from './dataset-section-container.module.scss';

const DatasetSectionContainer = ({ id, children, title }) => {
  return (
    <section id={id} className={sectionContainer} data-testid="sectionContainer">
      <div>
        {title && (
          <h2 className={sectionHeader} data-testid="sectionHeader">
            {title}
          </h2>
        )}
      </div>
      <div className={sectionBody} data-testid="sectionBody">
        {children}
      </div>
    </section>
  );
};
export default DatasetSectionContainer;
