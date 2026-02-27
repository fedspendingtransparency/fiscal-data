import React from 'react';
import beautify from 'js-beautify';
import SectionContent from '../../section-content/section-content';
import { beautified } from '../../../../pages/api-documentation/api.module.scss';

const ErrorObject = () => (
  <SectionContent id="responses-error-object" headingLevel={3} title="Error Object">
    <p>
      If something goes wrong while creating the API response, an error object will be returned to the user. The error object will contain the
      following information:
    </p>
    <ul>
      <li>
        <code className="inline">Error:</code> The error name.
      </li>
    </ul>
    <ul>
      <li>
        <code className="inline">Message:</code> A detailed explanation of why the error occurred and how to resolve it.
      </li>
    </ul>
    <div>
      <h4>Example Error Object:</h4>
    </div>
    <code className={`large ${beautified}`}>
      <pre>
        {beautify(
          `{
            "error":"Invalid Query Param",
            "message":"Invalid query parameter 'sorts' with value '[-record_date]'.  For more information please see the documentation."
          }`,
          { indent_size: 2 }
        )}
      </pre>
    </code>
  </SectionContent>
);

export default ErrorObject;
