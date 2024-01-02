import React from 'react';
import SectionContent from '../../section-content/section-content';
import { marginBottom, code } from '../../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Sorting = () => (
  <SectionContent title="Sorting" id="parameters-sorting" headingLevel={3}>
    <p>
      <strong>Parameter:</strong> <code className="inline">sort=</code>
    </p>
    <p>
      <strong>Definition:</strong> The sort parameter allows a user to sort a field in ascending (least to greatest) or descending (greatest to least)
      order.
    </p>
    <p>
      <strong>Accepts:</strong> The sort parameter <code className="inline">sort=</code> accepts a comma-separated list of field names.
    </p>
    <p>
      <strong>Required:</strong> No, sorting is not required to make an API request.
    </p>
    <p>
      <strong>Default:</strong> When no sort parameter is specified, the default is to sort by the first column listed. Most API endpoints are thus
      sorted by date in ascending order (historical to most current).
    </p>
    <p>
      <strong>Notes:</strong> You can nest sorting by passing the <code className="inline">sort=</code> parameter a comma-separated list.
    </p>

    <p>
      <strong>Examples:</strong>
    </p>
    <p>
      Sort the records returned by date in descending order, i.e. starting with the most recent date.{' '}
      <code className="inline">?sort=-record_date</code>
    </p>
    <p>Sort the Treasury Report on Receivables dataset by the Funding Type ID field in ascending order i.e., least to greatest.</p>
    <code className={`${code} ${marginBottom}`}>{baseApiUrl}/v2/debt/tror?sort=funding_type_id</code>
    <p>Nested sorting (year, then month).</p>
    <code className={`${code} ${marginBottom}`}>
      {baseApiUrl}/v2/accounting/od/debt_to_penny?fields=record_calendar_year,record_calendar_month&sort=-record_calendar_year,-record_calendar_month
    </code>
  </SectionContent>
);

export default Sorting;
