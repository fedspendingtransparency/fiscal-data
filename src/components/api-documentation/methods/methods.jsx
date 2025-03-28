import React from 'react';
import SectionContent from '../section-content/section-content';

const Methods = () => (
  <>
    <SectionContent id="methods" headingLevel={2} title="Methods">
      <p>
        <strong>All requests will be HTTP GET requests</strong>. Our APIs accept the GET method, one of the most common HTTP methods. The GET method
        is used to request data only (not modify). Note that GET requests can be cached, remain in browser history, be bookmarked, and have length
        restrictions.
      </p>
    </SectionContent>
  </>
);
export default Methods;
