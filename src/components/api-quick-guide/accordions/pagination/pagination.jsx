import React from 'react';
import Accordion from '../../../accordion/accordion';
import {
  list,
  exampleTitle,
  codeBlock
} from '../accordions.module.scss';
import GLOBALS from '../../../../helpers/constants'

const PaginationAccordion = ({ selectedTable }) => {
  const prodUrl = GLOBALS.PROD_API_BASE_URL;
  const exampleParameter = '?page[number]=1&page[size]=3';
  let fullUrl = '';
  if (selectedTable && selectedTable.endpoint) {
    fullUrl = `${prodUrl}/${selectedTable.endpoint}${exampleParameter}`;
  }
  return (
    <Accordion title='Pagination'>
      <ul className={list}>
        <li>
          <strong>Parameter: </strong>
          <code className='inline'>page[size]=</code> and{' '}
          <code className='inline'>page[number]=</code>
        </li>
        <li>
          <strong>Definition: </strong>
          <span>The page size will set the number of rows that are returned on a request, and
            page number will set the index for the pagination, starting at 1. This allows the
            user to paginate through the records returned from an API request.
          </span>
        </li>
        <li>
          <strong>Accepts: </strong>
          <span>
            The <code className='inline'>page[number]=</code> and{' '}
            <code className='inline'>page[size]=</code> parameters
            both accept integers.
          </span>
        </li>
        <li>
          <strong>Required: </strong>
          <span>No, neither pagination parameters are required to make an API request.</span>
        </li>
        <li>
          <strong>Default: </strong>
          <span>
            When no page number or page size parameter is specified, the default response is
          </span>
          <ul>
            <li>
              Page number: 1
            </li>
            <li>
              Page size: 100
            </li>
          </ul>
        </li>
      </ul>
      <div className={exampleTitle}>
        EXAMPLE
      </div>
      <code className={`${codeBlock} large`}>
        <div data-testid='fullUrl'>
          {fullUrl}
        </div>
      </code>
    </Accordion>
  )
};

export default PaginationAccordion;
