import React from 'react';
import Accordion from '../../../accordion/accordion';
import {
  list,
  exampleTitle,
  exampleParameters,
  codeBlock
} from "../accordions.module.scss";
import GLOBALS from '../../../../helpers/constants';

const FormatAccordion = ({ selectedTable }) => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
  const formatExample = '?format=csv';
  let fullUrl = '';
  if (selectedTable && selectedTable.endpoint) {
    fullUrl = `${baseApiUrl}/${selectedTable.endpoint}${formatExample}`;
  }

  return(
    <Accordion title='Format'>
      <ul className={list}>
        <li>
          <strong>Parameter: </strong><code className='inline'>format=</code>
        </li>
        <li>
          <strong>Definition: </strong>
          <span>
            The format parameter allows a user to define the output method of the
            response (CSV, JSON, XML).
          </span>
        </li>
        <li>
          <strong>Accepts: </strong>
          <span>
            The <code className='inline'>format=</code> parameter accepts{' '}
            <code className='inline'>xml</code>, <code className='inline'>json</code>,
            or <code className='inline'>csv</code> as an input.
          </span>
        </li>
        <li>
          <strong>Required: </strong>
          <span>No, the format parameter is not required to make an API request.</span>
        </li>
        <li>
          <strong>Default: </strong>
          <span>When no format is specified, the default response format is JSON.</span>
        </li>
      </ul>
      <div className={exampleTitle}>
        EXAMPLE
      </div>
      <code className={`${codeBlock} large`}>
        <div className={exampleParameters}>
          {formatExample}
        </div>
        <div data-testid='fullUrl'>
          {fullUrl}
        </div>
      </code>
    </Accordion>
  )
};

export default FormatAccordion;
