import React from 'react';
import SectionContent from '../../section-content/section-content';
import * as apiStyles from '../../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Format = () => (
  <SectionContent
    title="Format"
    id="parameters-format"
    headingLevel={3}
  >
    <p><strong>Parameter:</strong> <code className="inline">format=</code></p>
    <p>
      <strong>Definition:</strong> The format parameter allows a user to define the output method
      of the response (CSV, JSON, XML).
    </p>
    <p>
      <strong>Accepts:</strong> The <code className="inline">format=</code> parameter accepts{' '}
      <code className="inline">xml</code>, <code className="inline">json</code>, or{' '}
      <code className="inline">csv</code> as an input.
    </p>
    <p>
      <strong>Required:</strong> No, format is not required to make an API request.
    </p>
    <p>
      <strong>Default:</strong> When no format is specified, the default response format is JSON.
    </p>
    <p>
      <strong>Example:</strong>
    </p>
    <p>Return all of the data from the Debt to the Penny dataset in a JSON format.</p>
    <code className={`${apiStyles.code} ${apiStyles.marginBottom}`}>
      {baseApiUrl}/v2/accounting/od/debt_to_penny?format=json
    </code>
  </SectionContent>
);

export default Format;
