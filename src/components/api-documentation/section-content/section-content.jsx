import React from 'react';
import { sectionContainer } from './section-content.module.scss';

const SectionContent = ({ id, children, className, headingLevel, title }) => {
  // applies to headingLevels 2-6, anything else defaults to h2 tag
  const Tag = headingLevel >= 2 && headingLevel <= 6 ? `h${headingLevel}` : 'h2';

  return (
    <section id={id} className={`${sectionContainer} ${className || ''}`} data-testid="section-content">
      <Tag>{title}</Tag>
      {children}
    </section>
  );
};
export default SectionContent;
