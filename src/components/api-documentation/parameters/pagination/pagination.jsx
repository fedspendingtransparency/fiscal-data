import React from 'react';
import SectionContent from '../../section-content/section-content';
import { marginBottom, code } from '../../../../pages/api-documentation/api.module.scss';
import { list } from './pagination.module.scss';
import GLOBALS from '../../../../helpers/constants';

const Pagination = () => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

  return (
    <SectionContent title="Pagination" id="parameters-pagination" headingLevel={3}>
      <dl>
        <div>
          <dt>Parameter:</dt>
          <code className="inline">page[size]=</code> and <code className="inline">page[number]=</code>
        </div>
        <div>
          <dt>Definition:</dt>
          The page size will set the number of rows that are returned on a request, and page number will set the index
          for
          the pagination, starting at 1. This allows the user to paginate through the records returned from an API
          request.
        </div>
        <div>
          <dt>Accepts:</dt>
          The <code className="inline">page[number]=</code> and <code className="inline">page[size]=</code> parameters
          both
          accept integers.
        </div>
        <div>
          <dt>Required:</dt>
          No, neither pagination parameters are required to make an API request.
        </div>
        <div>
          <dt>Default:</dt>
          When no sort parameter is specified, the default is to sort by the first column listed. As a result, most API
          endpoints are sorted by date in ascending order (historical to most current).
        </div>
        <div>
          <dt>Notes:</dt>
          When no page number or page size parameter is specified, the default response is
        </div>
        <div>
        <ul className={list}>
          <li>Page number: 1</li>
          <li>Page size: 100</li>
        </ul>
        </div>
        <div>
          <dt>Example:</dt>
        </div>
        <p>From the Treasury Offset Program dataset, return data with 50 records per page, and return the 10th page of
          data.
        </p>
        <code
          className={`${code} ${marginBottom}`}>{baseApiUrl}/v1/debt/top/top_state?page[number]=10&page[size]=50</code>
      </dl>
    </SectionContent>
  );
};

export default Pagination;
