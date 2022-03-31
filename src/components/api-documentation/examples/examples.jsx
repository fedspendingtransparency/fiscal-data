import React from 'react';
import SectionContent from '../section-content/section-content';
import GLOBALS from '../../../helpers/constants';

const Examples = () => {

  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

  return (
    <>
      <SectionContent
        title="Examples and Code Snippets"
        id="examples-code-snippets"
        headingLevel={2}
      />
      <SectionContent
        title="Fields"
        id="examples-fields"
        headingLevel={3}
      >
        <span>For the Treasury Reporting Rates of Exchange dataset,</span>
        <ul>
          <li>
            Return only the following fields:
            <code className="inline">country_currency_desc</code>,
            <code className="inline">exchange_rate</code>,
            and <code className="inline">record_date</code>
          </li>
        </ul>
        <code className="large">
          {baseApiUrl}
          /v1/accounting/od/rates_of_exchange?fields=country_currency_desc,exchange_rate,record_date
        </code>
      </SectionContent>
      <SectionContent
        title="Filters"
        id="examples-filters"
        headingLevel={3}
      >
        <span>For the Treasury Reporting Rates of Exchange dataset,</span>
        <ul>
          <li>
            return the following fields:
            <code className="inline">country_currency_desc</code>,
            <code className="inline">exchange_rate</code>,
            and <code className="inline">record_date</code>
          </li>
          <li>
            return data only for the Canadian Dollar and Mexican Peso
          </li>
          <li>
            return data only if the date is on or after January 1, 2020.
          </li>
        </ul>
        <code className="large">
          {baseApiUrl}
          /v1/accounting/od/rates_of_exchange?fields=country_currency_desc,exchange_rate,
          record_date&filter=country_currency_desc:in:(Canada-Dollar,Mexico-Peso),
          record_date:gte:2020-01-01
        </code>
      </SectionContent>
      <SectionContent
        title="Sorting"
        id="examples-sorting"
        headingLevel={3}
      >
        <span>For the Debt to the Penny dataset,</span>
        <ul>
          <li>
            return the following fields:
            <code className="inline">record_calendar_year</code>,
            <code className="inline">record_calendar_month</code>
          </li>
          <li>
            return the most recent data first , i.e., return data sorted by year (descending order)
            and then month (descending order)
          </li>
        </ul>
        <code className="large">
          {baseApiUrl}/v2/accounting/od/debt_to_penny?fields=record_calendar_year,
          record_calendar_month&sort=-record_calendar_year,-record_calendar_month
        </code>
      </SectionContent>
      <SectionContent
        title="Format"
        id="examples-format"
        headingLevel={3}
      >
        <span>For the Debt to the Penny dataset,</span>
        <ul>
          <li>
            return all of the data
          </li>
          <li>
            return the data in a JSON format
          </li>
        </ul>
        <code className="large">{baseApiUrl}/v2/accounting/od/debt_to_penny?format=json</code>
      </SectionContent>
      <SectionContent
        title="Pagination"
        id="examples-pagination"
        headingLevel={3}
      >
        <span>For the Treasury Offset Program dataset,</span>
        <ul>
          <li>
            return the data on the 10th page, and each page returns 50 records of data
          </li>
        </ul>
        <code className="large">
          {baseApiUrl}/v1/debt/top/top_state?page[number]=10&page[size]=50
        </code>
      </SectionContent>
      <SectionContent
        title="Aggregation"
        id="examples-aggregation"
        headingLevel={3}
      >
        <span>More documentation is expected to be added about aggregation.</span>
      </SectionContent>
      <SectionContent
        title="Pivoting"
        id="examples-pivoting"
        headingLevel={3}
      >
        <span>More documentation is expected to be added about pivoting.</span>
      </SectionContent>
      <SectionContent
        title="Multi-dimension Datasets"
        id="examples-multi-dimension-datasets"
        headingLevel={3}
      >
        <span>More documentation is expected to be added about multi-dimension datasets.</span>
      </SectionContent>
    </>
  )
};
export default Examples;
