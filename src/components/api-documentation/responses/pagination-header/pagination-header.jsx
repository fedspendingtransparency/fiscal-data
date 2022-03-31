import React from 'react';
import SectionContent from "../../section-content/section-content";

const PaginationHeader = () => (
  <SectionContent
  id="responses-pagination-header"
  headingLevel={3}
  title="Pagination Header"
  >
    <p>
      The pagination header will contain the link: header and allows a user to navigate pagination
      using just the APIs.
    </p>
    <p>
      Link <code className="inline">{`<url first>`}</code>; rel="first",{' '}
      <code className="inline">{`<url prev>`}</code>; rel="prev";{' '}
      <code className="inline">{`<url next>`}</code>; rel="next";{' '}
      <code className="inline">{`<url last>`}</code>; rel="last"
    </p>
  </SectionContent>
);

export default PaginationHeader;
