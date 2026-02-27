import React from 'react';
import SectionContent from '../../section-content/section-content';
import { marginBottom, code } from '../../../../pages/api-documentation/api.module.scss';
import { list } from './pagination.module.scss';
import GLOBALS from '../../../../helpers/constants';

const Pagination = () => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

  return (
    <SectionContent title="Pagination" id="parameters-pagination" headingLevel={3}>
      <div>
        <h4>Parameter:</h4> <code className="inline">page[size]=</code> and <code className="inline">page[number]=</code>
      </div>
      <div>
        <h4>Definition:</h4> The page size will set the number of rows that are returned on a request, and page number will set the index for
        the pagination, starting at 1. This allows the user to paginate through the records returned from an API request.
      </div>
      <div>
        <h4>Accepts:</h4> The <code className="inline">page[number]=</code> and <code className="inline">page[size]=</code> parameters both
        accept integers.
      </div>
      <div>
        <h4>Required:</h4> No, neither pagination parameters are required to make an API request.
      </div>
      <div>
        <h4>Default:</h4> When no sort parameter is specified, the default is to sort by the first column listed. As a result, most API
        endpoints are sorted by date in ascending order (historical to most current).
      </div>
      <div>
        <h4>Notes:</h4> When no page number or page size parameter is specified, the default response is
      </div>
      <ul className={list}>
        <li>Page number: 1</li>
        <li>Page size: 100</li>
      </ul>

      <div>
        <h4>Example:</h4>
      </div>
      <p>From the Treasury Offset Program dataset, return data with 50 records per page, and return the 10th page of data.</p>
      <code className={`${code} ${marginBottom}`}>{baseApiUrl}/v1/debt/top/top_state?page[number]=10&page[size]=50</code>
    </SectionContent>
  );
};

export default Pagination;
