import React from 'react';
import SectionContent from '../section-content/section-content';
import { code, marginBottom } from '../../../pages/api-documentation/api.module.scss';
import CustomLink from '../../links/custom-link/custom-link';
import GLOBALS from '../../../helpers/constants';

const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

const Fields = () => (
  <>
    <SectionContent id="fields" headingLevel={3} title="Fields">
      <div>
        <h4>Parameter:</h4> <code className="inline">fields=</code>
      </div>
      <div>
        <h4>Definition:</h4> The fields parameter allows you to select which field(s) should be included in the response.
      </div>
      <div>
        <h4>Accepts:</h4> The <code className="inline">fields=</code> parameter accepts a comma-separated list of field names.
      </div>
      <div>
        <h4>Required:</h4> No, specifying fields is not required to make an API request.
      </div>
      <div>
        <h4>Default:</h4> If desired fields are not specified, all fields will be returned.
      </div>
      <div>
        <h4>Notes:</h4> When a file name passed to the fields parameter is not available for the endpoint accessed, an error will occur. Note
        that omitting fields can result in automatically aggregated and summed data results. For more information, view the{' '}
        <CustomLink url="/api-documentation/#aggregation-sums">full documentation on Aggregation and Sums</CustomLink>.
      </div>
      <div>
        <h4>Examples:</h4>
      </div>
      <p>
        Only return the following fields from a dataset: <code className="inline">country_currency_desc, exchange_rate, and record_date.</code>
      </p>
      <code className={`${code} ${marginBottom}`}>?fields=country_currency_desc,exchange_rate,record_date</code>
      <p>
        Return the following fields from the Treasury Reporting Rates of Exchange dataset:{' '}
        <code className="inline">country_currency_desc, exchange_rate, and record_date.</code>
      </p>
      <code className={code}>
        {baseApiUrl}
        /v1/accounting/od/rates_of_exchange?fields=country_currency_desc,exchange_rate,record_date
      </code>
    </SectionContent>
    <SectionContent id="data-types" headingLevel={4} title="Data Types">
      <p>
        All fields in a response will be <strong>treated as strings</strong> and enclosed in quotation marks (e.g., "field_name"). The data type
        listed in a dataset's data dictionary or Fields table in dataset-specific API documentation indicates what the field is meant to be (e.g.,
        date). <strong>Note: This includes null values,</strong> which will appear as strings ("null") rather than a blank or system-recognized null
        value. This allows you to <strong>convert it to that data type in your language of choice.</strong> For example, the Pandas library for Python
        helps you convert strings to 'datetime objects' and R allows you to convert characters to date objects using as.Date.
      </p>
    </SectionContent>
    <SectionContent id="fields-fields-by-endpoint" headingLevel={4} title="Fields by Endpoint">
      <p>
        To discover what <strong>fields are available within each endpoint,</strong> check out the corresponding dataset's detail page for
        dataset-specific API documentation or refer to its data dictionary.
      </p>
      <p>
        <strong>Looking for field names for a specific dataset?</strong> Jump to the{' '}
        <CustomLink url="/api-documentation/#list-of-endpoints-table">Endpoints by Dataset</CustomLink> section to find your dataset of interest.
        Select any dataset name to view that dataset's details, including metadata, data dictionary, a preview table, graphs, and more!
      </p>
      <p>
        <strong>Not sure which dataset you need?</strong> Head over to our <CustomLink url="/datasets/">Datasets</CustomLink> page to search and
        filter for datasets by topic, dates available, file type, and more.
      </p>
    </SectionContent>
  </>
);
export default Fields;
