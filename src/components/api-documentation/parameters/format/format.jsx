import React from 'react';
import SectionContent from '../../section-content/section-content';
import { code, marginBottom } from '../../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Format = () => (
  <SectionContent title="Format" id="parameters-format" headingLevel={3}>
    <dl>
      <div>
        <dt>Parameter:</dt>
        <code className="inline">format=</code>
      </div>
      <div>
        <dt>Definition:</dt>
        The format parameter allows a user to define the output method of the response (CSV, JSON, XML).
      </div>
      <div>
        <dt>Accepts:</dt>
        The <code className="inline">format=</code> parameter accepts <code className="inline">xml</code>,{' '}
        <code className="inline">json</code>, or <code className="inline">csv</code> as an input.
      </div>
      <div>
        <dt>Required:</dt>
        No, format is not required to make an API request.
      </div>
      <div>
        <dt>Default:</dt>
        When no format is specified, the default response format is JSON.
      </div>
      <div>
        <dt>Example:</dt>
      </div>
      <p>Return all data from the Debt to the Penny dataset in JSON format.</p>
      <code className={`${code} ${marginBottom}`}>{baseApiUrl}/v2/accounting/od/debt_to_penny?format=json</code>
    </dl>
  </SectionContent>

);

export default Format;
