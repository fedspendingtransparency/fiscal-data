import React from 'react';
import SectionContent from '../../section-content/section-content';
import { code, marginBottom, spacing } from '../../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Format = () => (
  <SectionContent title="Format" id="parameters-format" headingLevel={3}>
    <dl>
      <div className={spacing}>
        <dt>Parameter:</dt>
        <dd>
          <code className="inline">format=</code>
        </dd>
      </div>
      <div className={spacing}>
        <dt>Definition:</dt>
        <dd>
          The format parameter allows a user to define the output method of the response (CSV, JSON, XML).
        </dd>
      </div>
      <div className={spacing}>
        <dt>Accepts:</dt>
        <dd>
          The <code className="inline">format=</code> parameter accepts <code className="inline">xml</code>,{' '}
          <code className="inline">json</code>, or <code className="inline">csv</code> as an input.
        </dd>
      </div>
      <div className={spacing}>
        <dt>Required:</dt>
        <dd>
          No, format is not required to make an API request.
        </dd>
      </div>
      <div className={spacing}>
        <dt>Default:</dt>
        <dd>
          When no format is specified, the default response format is JSON.
        </dd>
      </div>
    </dl>
    <div className={spacing}>
        <strong>Example:</strong>
      </div>
      <p>Return all data from the Debt to the Penny dataset in JSON format.</p>
      <code className={`${code} ${marginBottom}`}>{baseApiUrl}/v2/accounting/od/debt_to_penny?format=json</code>

  </SectionContent>

);

export default Format;
