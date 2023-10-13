import React, { useEffect, useState } from 'react';
import Accordion from '../../../accordion/accordion';
import { list, exampleTitle, codeBlock, exampleParameters } from '../accordions.module.scss';
import GLOBALS from '../../../../helpers/constants';
import CustomLink from '../../../links/custom-link/custom-link';

const FieldsAccordion = ({ selectedTable, numberOfFields = 5 }) => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
  const [fields, setFields] = useState('');
  const [url, setUrl] = useState('');

  const getFirstNFields = arrayOfObjs => {
    return arrayOfObjs
      .slice(0, numberOfFields)
      .map(obj => obj.columnName)
      .join(',');
  };

  useEffect(() => {
    if (selectedTable) {
      if (selectedTable.fields) {
        setFields(getFirstNFields(selectedTable.fields));
      }
      if (selectedTable.endpoint) {
        setUrl(`${baseApiUrl}/${selectedTable.endpoint}?fields=`);
      }
    }
  }, [numberOfFields, selectedTable]);

  return (
    <Accordion title="Fields" defaultOpen>
      <ul className={list}>
        <li>
          <strong>Parameter: </strong>
          <code className="inline">fields=</code>
        </li>
        <li>
          <strong>Definition: </strong>
          <span>The fields parameter allows you to select which field(s) should be included in the response.</span>
        </li>
        <li>
          <strong>Accepts: </strong>
          <span>
            The <code className="inline">fields=</code> parameter accepts a comma-separated list of field names (no parentheses).
          </span>
        </li>
        <li>
          <strong>Required: </strong>
          <span>No, specifying fields is not required to make an API request.</span>
        </li>
        <li>
          <strong>Default: </strong>
          <span>If desired fields are not specified, all fields will be returned.</span>
        </li>
        <li>
          <strong>Notes: </strong>
          <span>
            When a field named passed to the <code className="inline">fields=</code> parameter is not available for the endpoint accessed, an error
            will occur. Note that omitting fields can result in automatically aggregated and summed data results. For more information, view the{' '}
            <CustomLink url="/api-documentation/#aggregation-sums">full documentation on Aggregation and Sums.</CustomLink>
          </span>
        </li>
      </ul>
      <div className={exampleTitle}>EXAMPLE</div>
      <code className={`${codeBlock} large`}>
        <div className={exampleParameters} data-testid="fields-short">
          ?fields={fields}
        </div>
        <div data-testid="fields-long">
          {url}
          {fields}
        </div>
      </code>
    </Accordion>
  );
};

export default FieldsAccordion;
