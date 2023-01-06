import React from 'react';
import SectionContent from "../../section-content/section-content";

const DataObject = () => (
  <SectionContent
    id="responses-data-object"
    headingLevel={3}
    title="Data Object"
  >
    <p>
      The data object is the section of the response where the requested data will be returned. The
      other objects (e.g., meta object, links object) are sent to enable use of the requested data.
    </p>
    <p>
      The data object beings with <code className="inline">{`{"data":`}</code>
    </p>
  </SectionContent>
);

export default DataObject;
