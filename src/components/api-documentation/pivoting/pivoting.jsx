import React from 'react';
import SectionContent from '../section-content/section-content';

const Pivoting = () => (
  <SectionContent
    title='Pivoting'
    id='pivoting'
    headingLevel={2}
  >
    <p>
      A pivoted table takes all of the unique values in a column (e.g., categories) and turns those
      values into column headings, “rotating” the table. You then must select another column to
      indicate which values you would like to aggregate (e.g., sum). The pivot table will then
      combine all the rows falling under each category and show one value (the total) for the field
      selected.
    </p>
    <p>
      More documentation is expected to be added about pivoting.
    </p>
  </SectionContent>
);

export default Pivoting;
