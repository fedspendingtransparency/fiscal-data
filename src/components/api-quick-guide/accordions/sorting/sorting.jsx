import React from 'react';
import Accordion from '../../../accordion/accordion';
import {
  list,
  exampleTitle,
  codeBlock,
  exampleParameters
} from '../accordions.module.scss';
import GLOBALS from '../../../../helpers/constants';

const SortingAccordion = ({ selectedTable }) => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;
  const fullUrl = `${baseApiUrl}/${selectedTable.endpoint}`;
  const exampleSortingQuery = `?sort=-${selectedTable.dateField}`;

  return (
    <Accordion title="Sorting">
      <ul className={list}>
        <li>
          <strong>Parameter: </strong><code className="inline">sort=</code>
        </li>
        <li>
          <strong>Definition: </strong>
          <span>
            The sort parameter allows a user to sort a field in ascending (least to
            greatest) or descending (greatest to least) order.
          </span>
        </li>
        <li>
          <strong>Accepts: </strong>
          <span>
            The sort parameter <code className="inline">sort=</code> accepts a
            comma-separated list of field names.
          </span>
        </li>
        <li>
          <strong>Required: </strong>
          <span>No, sorting is not required to make an API request.</span>
        </li>
        <li>
          <strong>Default: </strong>
          <span>
            When no sort parameter is specified, the default is to sort by the first
            column listed. Most API endpoints are thus sorted by date in ascending order
            (historical to most current).
          </span>
        </li>
        <li>
          <strong>Notes: </strong>
          <span>
            You can nest sorting by passing the <code className="inline">sort=</code>{' '}
            parameter a comma-separated list.
          </span>
        </li>
      </ul>
      <div className={exampleTitle}>
        EXAMPLE
      </div>
      <code className={`${codeBlock} large`}>
        <div data-testid="sortingAccordionQuery" className={exampleParameters}>
          {exampleSortingQuery}
        </div>
        <div>
          {fullUrl}{exampleSortingQuery}
        </div>
      </code>
    </Accordion>
  )
};

export default SortingAccordion;
