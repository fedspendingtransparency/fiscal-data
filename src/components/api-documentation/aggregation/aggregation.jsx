import React from 'react';
import SectionContent from '../section-content/section-content';
import * as apiStyles from "../../../pages/api-documentation/api.module.scss";
import GLOBALS from "../../../helpers/constants";

const Aggregation = () => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

  return (
  <SectionContent
    title="Aggregation & Sums"
    id="aggregation-sums"
    headingLevel={2}
  >
    <p>
      In some cases, using a field list that excludes some of an endpoint’s available fields will
      trigger automatic aggregation of non-unique rows and summing of their numeric values, etc.
      You should use this when searching for the sum total of a specific field.
    </p>
    <p>
      For example, the API call for the sum total of the opening monthly balance within the Daily
      Treasury Statement dataset would read as:
    </p>
    <code className={`${apiStyles.code} ${apiStyles.marginBottom}`}>
      {baseApiUrl}/v1/accounting/dts/dts_table_2?fields=record_date,transaction_today_amt
    </code>
    <p>
      Running this API call will yield a sum of all the totals in the selected field. In this case,
      the call yields the total sum of all opening monthly balances over the course of all dates
      available in the dataset.
    </p>
  </SectionContent>
  )
};
export default Aggregation;
