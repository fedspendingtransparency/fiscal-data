import React from 'react';
import SectionContent from '../section-content/section-content';
import { code, marginBottom } from '../../../pages/api-documentation/api.module.scss';
import { listHeading } from '../section-content/section-content.module.scss';
import { list } from './filters.module.scss';
import GLOBALS from '../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
const urlPath = '/v1/accounting/od/rates_of_exchange';
const urlFieldParam = '?fields=country_currency_desc,exchange_rate,record_date';
const urlFilterParam = '&filter=country_currency_desc:in:(Canada-Dollar,Mexico-Peso),record_date:gte:2020-01-01';

const Filters = () => (
  <>
    <SectionContent id="filters" headingLevel={3} title="Filters">
      <div>
        <h4>Parameter:</h4> <code className="inline">filter=</code>
      </div>
      <div>
        <h4>Definition:</h4> Filters are used to view a subset of the data based on specific criteria. For example, you may want to find data
        that falls within a certain date range, or only show records which contain a value larger than a certain threshold.
      </div>
      <div>
        <h4>Accepts:</h4> The filter parameter <code className="inline">filter=</code> accepts filters from the list below, as well as
        specified filter criteria. Use a colon at the end of a filter parameter to pass a value or list of values. For lists passed as filter
        criteria, use a comma-separated list within parentheses. Filter for specific dates using the format <code className="inline">YYYY-MM-DD</code>
        . To filter by multiple fields in a single request, do not repeat a filter call. Instead, apply an additional field to include in the filter
        separated by a comma, as shown in the following template: <code className="inline">&filter=field:prm:value,field:prm:value</code>
      </div>
      <div>
        <h4>Required:</h4> No, filters are not required to make an API request.
      </div>
      <div>
        <h4>Default:</h4> When no filters are provided, the default response <strong>will return all fields and all data.</strong>
      </div>
      <p className={listHeading}>
        The filter parameter <strong>accepts the following filters:</strong>
      </p>
      <ul className={list}>
        <li>
          <code className="inline">lt=</code> Less than
        </li>
        <li>
          <code className="inline">lte=</code> Less than or equal to
        </li>
        <li>
          <code className="inline">gt=</code> Greater than
        </li>
        <li>
          <code className="inline">gte=</code> Greater than or equal to
        </li>
        <li>
          <code className="inline">eq=</code> Equal to
        </li>
        <li>
          <code className="inline">in=</code> Contained in a given set
        </li>
      </ul>
      <div>
        <h4>Examples:</h4>
      </div>
      <p>Return data if the fiscal year falls between 2007-2010.</p>
      <code className={`${code} ${marginBottom}`}>?filter=reporting_fiscal_year:in:(2007,2008,2009,2010)</code>
      <p>Return data if the funding type ID is 202.</p>
      <code className={`${code} ${marginBottom}`}>?filter=funding_type_id:eq:202</code>
      <p className={listHeading}>From the Treasury Reporting Rates of Exchange dataset,</p>
      <ul className={list}>
        <li>only return specific fields (country_currency_desc, exchange_rate, record_date),</li>
        <li>only return data on the Canadian Dollar and Mexican Peso, and</li>
        <li>only return data that falls between January 1, 2020 and the present.</li>
      </ul>
      <code className={code}>{`${baseApiUrl}${urlPath}${urlFieldParam}${urlFilterParam}`}</code>
    </SectionContent>
  </>
);

export default Filters;
