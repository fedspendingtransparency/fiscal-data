import React from 'react';
import SectionContent from '../../section-content/section-content';
import beautify from 'js-beautify';
import { beautified } from '../../../../pages/api-documentation/api.module.scss';

const MetaObject = () => (
  <SectionContent id="responses-meta-object" headingLevel={3} title="Meta Object">
    <p>The meta object provides metadata about the resulting payload from your API request. The object will contain the following:</p>
    <ul>
      <li>
        <code className="inline">count:</code> Record count for the response.
      </li>
      <li>
        <code className="inline">labels:</code> Mapping from result field to logical field names.
      </li>
      <li>
        <code className="inline">dataTypes:</code> Data type for each returned field.
      </li>
      <li>
        <code className="inline">dataFormats:</code> Size or format for each returned field.
      </li>
      <li>
        <code className="inline">total-count:</code> Total number of rows available in the dataset.
      </li>
      <li>
        <code className="inline">total-pages:</code> Total number of pages of data available based on the page size in the meta count response.
      </li>
    </ul>
    <div>
      <h4>Example Meta Object:</h4>
    </div>
    <code className={`large ${beautified}`}>
      <pre>
        {beautify(
          `"meta":{
            "count":3790,
            "labels":{
              "country_currency_desc":"Country - Currency Description",
              "exchange_rate":"Exchange Rate",
              "record_date":"Record Date"
            },
            "dataTypes":{
              "country_currency_desc":"STRING",
              "exchange_rate":"NUMBER",
              "record_date":"DATE"
            },
            "dataFormats":{
              "country_currency_desc":"String",
              "exchange_rate":"10.2",
              "record_date":"YYYY-MM-DD"
            },
            "total-count":3790,
            "total-pages":1
          }`,
          { indent_size: 2 }
        )}
      </pre>
    </code>
  </SectionContent>
);

export default MetaObject;
