import React from 'react';
import SectionContent from '../section-content/section-content';

const MultiDimensionDatasets = () => (
  <SectionContent
    title="Multi-Dimension Datasets"
    id="multidimension-datasets"
    headingLevel={2}
  >
    <p>
      For some API endpoints, users may benefit from isolating a specific dimension of the data
      contained within a field. The data can be rearranged to give greater visibility and insight
      into the chosen dimension using a data reporting technique commonly referred to as “pivoting.”
      Using some of the parameters (as detailed below) in a request for an endpoint’s data can help
      shape the data response so that it is more suitable for use in a pivoted/dimensional view.
      Below are some examples.
    </p>
    <p>
      More documentation is expected to be added about multi-dimension datasets.
    </p>
  </SectionContent>
);

export default MultiDimensionDatasets;
