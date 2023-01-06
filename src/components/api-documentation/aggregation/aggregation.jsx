import React from 'react';
import SectionContent from '../section-content/section-content';

const Aggregation = () => (
  <SectionContent
    title="Aggregation & Sums"
    id="aggregation-sums"
    headingLevel={2}
  >
    <p>
      In some cases, using a field list that excludes some of an endpoint’s available fields will
      trigger automatic aggregation of non-unique rows and summing of their numeric values, etc.
    </p>
    <p>
      More documentation is expected to be added about aggregation and sums.
    </p>
  </SectionContent>
);
export default Aggregation;
