import React from 'react';
import SectionContent from '../section-content/section-content';
import { code, marginBottom } from '../../../pages/api-documentation/api.module.scss';
import { apiEndpointFirstParagraph, codeTitle, paragraphList, pill, pills, pillSpacing } from './getting-started.module.scss';
import { Link } from 'gatsby';
import GLOBALS from '../../../helpers/constants';
import CustomLink from '../../links/custom-link/custom-link';

const GettingStarted = () => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
  const urlPath = '/v1/accounting/od/rates_of_exchange';
  const urlFieldParam = '?fields=country_currency_desc,exchange_rate,record_date';
  const urlFilterParam = '&filter=country_currency_desc:in:(Canada-Dollar,Mexico-Peso),record_date:gte:2024-01-01';

  const mtsT9UrlPath = '/v1/accounting/mts/mts_table_9';
  const mtsT9UrlFilterParam = '?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1';
  const mtsT1UrlPath = '/v1/accounting/mts/mts_table_1';
  const mtsT1UrlFilterParam = '&filter=record_date:eq:2023-05-31';
  const mtsT1UrlFieldParam = '?fields=record_date,parent_id,classification_id,classification_desc,current_month_gross_rcpt_amt';

  return (
    <>
      <SectionContent id="getting-started" headingLevel={2} title="Getting Started">
        <p>
          The U.S. Department of the Treasury is building a suite of open-source tools to deliver standardized information about federal finances to
          the public. We are working to centralize publicly available financial data, and this website will include datasets from the Fiscal Service
          on topics including debt, revenue, spending, interest rates, and savings bonds.
        </p>
        <p>
          Our API is based on Representational State Transfer, otherwise known as a RESTful API. Our API accepts GET requests, returns JSON responses,
          and uses standard HTTP response codes. Each endpoint on this site is accessible through unique URLs that respond with data values and
          metadata from a single database table.
        </p>
      </SectionContent>

      <SectionContent id="what-is-an-api" headingLevel={3} title="What is an API?">
        <p>
          API stands for <strong>Application Programming Interface</strong>. APIs make it easy for computer programs to request and receive
          information in a useable format.
        </p>
        <p className={paragraphList}>
          If you're looking for federal financial data that's designed to be read by humans rather than computers, head to{' '}
          <Link className="primary" to="/">
            our website
          </Link>{' '}
          to search for data (available in CSV, JSON, and XML formats) or visit our partner site,{' '}
          <CustomLink url={'https://www.usaspending.gov/'}>USAspending</CustomLink> ‒ the official source for spending data for the U.S. Government.
          There, you can follow the money from congressional appropriations to federal agencies down to local communities and businesses. For more
          general information, visit{' '}
          <CustomLink url={'/americas-finance-guide/'} external={false}>
            Your Guide to America's Finances
          </CustomLink>
          , where Fiscal Data breaks down complex government finance concepts into easy-to-understand terms.
        </p>
      </SectionContent>
      <SectionContent id="what-is-a-dataset" headingLevel={3} title="What is a Dataset?">
        <p>
          We present data to you in collections called datasets. We define a dataset as a group of data that has historically been published together
          as one report. In some cases, datasets consist of multiple tables, which correspond to sections of reports. When this is the case, datasets
          are powered by more than one API. For example, the Monthly Treasury Statement (MTS) dataset contains multiple APIs, corresponding with
          information on federal government spending, revenue, debt, and more.
        </p>
        <p>
          <CustomLink url="/datasets/">Search and filter</CustomLink> our datasets to explore more.
        </p>
      </SectionContent>
      <SectionContent id="api-endpoint-url-structure" headingLevel={3} title="API Endpoint URL Structure">
        <p className={apiEndpointFirstParagraph}>
          For simplicity and consistency, endpoint URLs are formatted with all lower case characters. Underscores are used as word separators.
          Endpoints use names in singular case.
        </p>
        <div>
          The components that make up a <strong>full API request</strong> are below.
        </div>
        <div className={pills}>
          <span className={pill}>Base URL</span>
          <span className={pillSpacing}>+</span>
          <span className={pill}>Endpoint</span>
          <span className={pillSpacing}>+</span>
          <span className={pill}>Parameters and Filters (optional)</span>
        </div>
        <div className={codeTitle}>BASE URL EXAMPLE:</div>
        <code className={`${code} ${marginBottom}`}>https://api.fiscaldata.treasury.gov/services/api/fiscal_service/</code>
        <div className={codeTitle}>ENDPOINT EXAMPLE:</div>
        <code className={`${code} ${marginBottom}`}>v1/accounting/od/rates_of_exchange</code>
        <div className={codeTitle}>PARAMETERS AND FILTERS EXAMPLE:</div>
        <code className={`${code} ${marginBottom}`}>?fields=country_currency_desc,exchange_rate,record_date&filter=record_date:gte:2015-01-01</code>
        <div className={codeTitle}>FULL API REQUEST EXAMPLE:</div>
        <code className={code}>
          {baseApiUrl}
          /v1/accounting/od/rates_of_exchange?fields=country_currency_desc,exchange_rate,record_date&filter=record_date:gte:2015-01-01
        </code>
      </SectionContent>
      <SectionContent id="how-to-access-our-api" headingLevel={3} title="How to Access our API">
        <p>
          Our API is open, meaning that it does not require a user account or registration for a token. To begin using our API, you can type the GET,
          R, or Python request below directly into a web browser (or script in a data analysis tool), which will return a JSON-formatted response. You
          can also request CSV- or XML-formatted data by using the format filter.
        </p>
        <p>
          Check out this short <CustomLink url={'https://www.youtube.com/watch?v=bMr4OFJ8H2Q/'}>tutorial video</CustomLink> to help you get started,
          where we take you step-by-step through using a dataset’s API endpoint to connect to the data.
        </p>
        <div className={codeTitle}>EXAMPLE API REQUEST USING GET:</div>
        <code className={code}>{`${baseApiUrl}${urlPath}${urlFieldParam}${urlFilterParam}`}</code>
        <div className={codeTitle}>EXAMPLE RESPONSE:</div>
        <code className={code}>
          {`{"data":[{"country_currency_desc":"Canada-Dollar",`}
          <br />
          {`"exchange_rate":"1.426","record_date":"2020-03-31"},`}
          <br />
          {`{"country_currency_desc":"Canada-Dollar",`}
          <br />
          {`"exchange_rate":"1.26","record_date":"2021-03-31"},`}
          <br />
          {`{"country_currency_desc":"Canada-Dollar",`}
          <br />
          {`"exchange_rate":"1.275","record_date":"2020-12-31"},`}
          <br />
          {`{"country_currency_desc":"Canada-Dollar",`}
          <br />
          {`"exchange_rate":"1.368","record_date":"2020-06-30"},`}
          <br />
          {`{"country_currency_desc":"Canada-Dollar",`}
          <br />
          {`"exchange_rate":"1.239","record_date":"2021-06-30"},`}
          <br />
          {`{"country_currency_desc":"Canada-Dollar",`}
          <br />
          {`"exchange_rate":"1.338","record_date":"2020-09-30"},`}
          <br />
          {`{"country_currency_desc":"Mexico-Peso",`}
          <br />
          {`"exchange_rate":"19.913","record_date":"2020-12-31"},`}
          <br />
          {`{"country_currency_desc":"Mexico-Peso",`}
          <br />
          {`"exchange_rate":"23.791","record_date":"2020-03-31"},`}
          <br />
          {`{"country_currency_desc":"Mexico-Peso",`}
          <br />
          {`"exchange_rate":"23.164","record_date":"2020-06-30"},`}
          <br />
          {`{"country_currency_desc":"Mexico-Peso",`}
          <br />
          {`"exchange_rate":"20.067","record_date":"2020-09-30"},`}
          <br />
          {`{"country_currency_desc":"Mexico-Peso",`}
          <br />
          {`"exchange_rate":"20.518","record_date":"2021-03-31"},`}
          <br />
          {`{"country_currency_desc":"Mexico-Peso",`}
          <br />
          {`"exchange_rate":"19.838","record_date":"2021-06-30"}],`}
          <br />
          {`"meta":{"count":12,"labels":{`}
          <br />
          {`"country_currency_desc":"Country-CurrencyDescription",`}
          <br />
          {`"exchange_rate":"ExchangeRate","record_date":"RecordDate"},`}
          <br />
          {`"dataTypes":{"country_currency_desc":"STRING","exchange_rate":"NUMBER",
          "record_date":"DATE"},`}
          <br />
          {`"dataFormats":{"country_currency_desc":"String","exchange_rate":"10.2",
          "record_date":"YYYY-MM-DD"},`}
          <br />
          {`"total-count":12,"total-pages":1},`}
          <br />
          {`"links":{"self":"&page%5Bnumber%5D=1&page%5Bsize%5D=100",`}
          <br />
          {`"first":"&page%5Bnumber%5D=1&page%5Bsize%5D=100","prev":null,`}
          <br />
          {`"next":null,"last":"&page%5Bnumber%5D=1&page%5Bsize%5D=100"}}`}
          <br />
        </code>
        <div className={codeTitle}>EXAMPLE API REQUEST USING R:</div>
        <code className={code}>
          library(httr)
          <br />
          library(jsonlite)
          <br />
          request="{baseApiUrl}
          {mtsT9UrlPath}
          {mtsT9UrlFilterParam}"
          <br />
          response=GET(request)
          <br />
          out=fromJSON(rawToChar(response$content))
          <br />
          data=out$data
          <br />
          head(data)
        </code>
        <div className={codeTitle}>EXAMPLE API REQUEST USING PYTHON:</div>
        <code className={code}>
          # MTS Table 1 API - JSON Format
          <br />
          # Import necessary packages
          <br />
          import requests
          <br />
          import pandas as pd
          <br />
          # Create API variables
          <br />
          baseUrl = '{baseApiUrl}'
          <br />
          endpoint = '{mtsT1UrlPath}'
          <br />
          fields = '{mtsT1UrlFieldParam}'
          <br />
          filter = '{mtsT1UrlFilterParam}'
          <br />
          sort = '&sort=-record_date'
          <br />
          format = '&format=json'
          <br />
          pagination = '&page[number]=1&page[size]=3'
          <br />
          {`API = f'{baseUrl}{endpoint}{fields}{filter}{sort}{format}{pagination}'`}
          <br />
          # Call API and load into a pandas dataframe
          <br />
          data = requests.get(API).json()
          <br />
          pd.DataFrame(data['data'])
        </code>
      </SectionContent>
      <SectionContent id="license-and-authorization" headingLevel={3} title="License and Authorization">
        <p>
          The U.S. Department of the Treasury, Bureau of the Fiscal Service is committed to providing open data as part of its mission to promote the
          financial integrity and operational efficiency of the federal government. The data is offered free, without restriction, and available to
          copy, adapt, redistribute, or otherwise use for non-commercial or commercial purposes.
        </p>
      </SectionContent>
      <SectionContent id="api-versioning" headingLevel={3} title="API Versioning">
        <p>
          Our APIs are currently in v1.0.0 or v2.0.0. To determine which version the API is in, please refer to the specific dataset detail page and
          navigate to the API Quick Guide > Endpoint section.
        </p>
      </SectionContent>
    </>
  );
};

export default GettingStarted;
