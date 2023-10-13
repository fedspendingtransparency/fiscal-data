import React from 'react';
import { sectionContainer, sectionHeaderContainer, sectionHeader, sectionBodyContainer } from './api-quick-guide.module.scss';

const ApiQuickGuideSection = ({ title, description, children }) => (
  <section className={sectionContainer}>
    <div className={sectionHeaderContainer}>
      <div className={sectionHeader} id={`${title.toLowerCase()}-header`}>
        {title}
      </div>
      {description}
    </div>

    <div className={sectionBodyContainer}>{children}</div>
  </section>
);

export default ApiQuickGuideSection;
