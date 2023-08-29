import React from 'react';
import SectionContent from '../section-content/section-content';
import * as apiStyles from '../../../pages/api-documentation/api.module.scss';
import * as sectionStyles from '../section-content/section-content.module.scss';
import * as styles from './filters.module.scss';
import GLOBALS from '../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
const urlPath = '/v1/accounting/od/rates_of_exchange';
const urlFieldParam = '?fields=country_currency_desc,exchange_rate,record_date';
const urlFilterParam = '&filter=country_currency_desc:in:(Canada-Dollar,Mexico-Peso),record_date:gte:2020-01-01'

const Filters = () => (
  <div className={apiStyles.sectionBreak}>
    <SectionContent
      id="filters"
      headingLevel={3}
      title="Filters"
    >
      <p><strong>Parameter:</strong> <code className="inline">filter=</code></p>
      <p>
        <strong>Definition:</strong> Filters are used to view a subset of the data based on specific
        criteria. For example, you may want to find data that falls within a certain date range, or
        only show records which contain a value larger than a certain threshold.
      </p>
      <p>
        <strong>Accepts:</strong> The filter parameter <code className="inline">filter=</code>{' '}
        accepts filters from the list below, as well as specified filter criteria. Use a colon at
        the end of a filter parameter to pass a value or list of values. For lists passed as filter
        criteria, use a comma-separated list within parentheses. Filter for specific dates using the
        format <code className="inline">YYYY-MM-DD</code>.
      </p>
      <p><strong>Required:</strong> No, filters are not required to make an API request.</p>
      <p>
        <strong>Default:</strong> When no filters are provided, the default response{' '}
        <strong>will return all fields and all data.</strong>
      </p>
      <p className={sectionStyles.listHeading}>
        The filter parameter <strong>accepts the following filters:</strong>
      </p>
      <ul className={styles.list}>
        <li><code className="inline">lt=</code> Less than</li>
        <li><code className="inline">lte=</code> Less than or equal to</li>
        <li><code className="inline">gt=</code> Greater than</li>
        <li><code className="inline">gte=</code> Greater than or equal to</li>
        <li><code className="inline">eq=</code> Equal to</li>
        <li><code className="inline">in=</code> Contained in a given set</li>
      </ul>
      <p><strong>Examples:</strong></p>
      <p>Return data if the fiscal year falls between 2007-2010.</p>
      <code className={`${apiStyles.code} ${apiStyles.marginBottom}`}>
        ?filter=reporting_fiscal_year:in:(2007,2008,2009,2010)
      </code>
      <p>Return data if the funding type ID is 202.</p>
      <code className={`${apiStyles.code} ${apiStyles.marginBottom}`}>
        ?filter=funding_type_id:eq:202
      </code>
      <p className={sectionStyles.listHeading}>
        From the Treasury Reporting Rates of Exchange dataset,
      </p>
      <ul className={styles.list}>
        <li>only return specific fields (country_currency_desc, exchange_rate, record_date),</li>
        <li>only return data on the Canadian Dollar and Mexican Peso, and</li>
        <li>only return data that falls between January 1, 2020 and the present.</li>
      </ul>
        <code className={apiStyles.code}>
          {`${baseApiUrl}${urlPath}${urlFieldParam}${urlFilterParam}`}
        </code>
    </SectionContent>
  </div>
);

export default Filters;
