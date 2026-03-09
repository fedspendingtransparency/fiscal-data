import React from 'react';
import SectionContent from '../../section-content/section-content';
import { marginBottom, code, spacing } from '../../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Sorting = () => (
  <SectionContent title="Sorting" id="parameters-sorting" headingLevel={3}>
    <dl>
      <div className={spacing}>
        <dt>Parameter:</dt>
        <dd>
          <code className="inline">sort=</code>
        </dd>
      </div>
      <div className={spacing}>
        <dt>Definition:</dt>
        <dd>
          The sort parameter allows a user to sort a field in ascending (least to greatest) or descending (greatest to
          least)
          order.
        </dd>
      </div>
      <div className={spacing}>
        <dt>Accepts:</dt>
        <dd>
          The sort parameter <code className="inline">sort=</code> accepts a comma-separated list of field names.
        </dd>
      </div>
      <div className={spacing}>
        <dt>Required:</dt>
        <dd>
          No, sorting is not required to make an API request.
        </dd>
      </div>
      <div className={spacing}>
        <dt>Default:</dt>
        <dd>
          When no sort parameter is specified, the default is to sort by the first column listed. Most API endpoints are
          thus
          sorted by date in ascending order (historical to most current).
        </dd>
      </div>
      <div className={spacing}>
        <dt>Notes:</dt>
        <dd>
          You can nest sorting by passing the <code className="inline">sort=</code> parameter a comma-separated list.
        </dd>
      </div>
    </dl>
    <div className={spacing}>
        <strong>Examples:</strong>
      </div>
      <p>
        Sort the records returned by date in descending order, i.e. starting with the most recent date.{' '}
        <code className="inline">?sort=-record_date</code>
      </p>
      <p>Sort the Treasury Report on Receivables dataset by the Funding Type ID field in ascending order i.e., least to
        greatest.</p>
      <code className={`${code} ${marginBottom}`}>{baseApiUrl}/v2/debt/tror?sort=funding_type_id</code>
      <p>Nested sorting (year, then month).</p>
      <code className={`${code} ${marginBottom}`}>
        {baseApiUrl}/v2/accounting/od/debt_to_penny?fields=record_calendar_year,record_calendar_month&sort=-record_calendar_year,
        -record_calendar_month
      </code>
  </SectionContent>

);

export default Sorting;
