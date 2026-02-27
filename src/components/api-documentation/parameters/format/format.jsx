import React from 'react';
import SectionContent from '../../section-content/section-content';
import { code, marginBottom } from '../../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Format = () => (
  <SectionContent title="Format" id="parameters-format" headingLevel={3}>
    <div>
      <h4>Parameter:</h4> <code className="inline">format=</code>
    </div>
    <div>
      <h4>Definition:</h4> The format parameter allows a user to define the output method of the response (CSV, JSON, XML).
    </div>
    <div>
      <h4>Accepts:</h4> The <code className="inline">format=</code> parameter accepts <code className="inline">xml</code>,{' '}
      <code className="inline">json</code>, or <code className="inline">csv</code> as an input.
    </div>
    <div>
      <h4>Required:</h4> No, format is not required to make an API request.
    </div>
    <div>
      <h4>Default:</h4> When no format is specified, the default response format is JSON.
    </div>
    <div>
      <h4>Example:</h4>
    </div>
    <p>Return all data from the Debt to the Penny dataset in JSON format.</p>
    <code className={`${code} ${marginBottom}`}>{baseApiUrl}/v2/accounting/od/debt_to_penny?format=json</code>
  </SectionContent>
);

export default Format;
