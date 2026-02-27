import React from 'react';
import SectionContent from '../../section-content/section-content';
import { marginBottom, code } from '../../../../pages/api-documentation/api.module.scss';
import GLOBALS from '../../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Sorting = () => (
  <SectionContent title="Sorting" id="parameters-sorting" headingLevel={3}>
    <div>
      <h4>Parameter:</h4> <code className="inline">sort=</code>
    </div>
    <div>
      <h4>Definition:</h4> The sort parameter allows a user to sort a field in ascending (least to greatest) or descending (greatest to least)
      order.
    </div>
    <div>
      <h4>Accepts:</h4> The sort parameter <code className="inline">sort=</code> accepts a comma-separated list of field names.
    </div>
    <div>
      <h4>Required:</h4> No, sorting is not required to make an API request.
    </div>
    <div>
      <h4>Default:</h4> When no sort parameter is specified, the default is to sort by the first column listed. Most API endpoints are thus
      sorted by date in ascending order (historical to most current).
    </div>
    <div>
      <h4>Notes:</h4> You can nest sorting by passing the <code className="inline">sort=</code> parameter a comma-separated list.
    </div>

    <div>
      <h4>Examples:</h4>
    </div>
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
