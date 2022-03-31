import React from 'react';
import SectionContent from '../../section-content/section-content';
import * as apiStyles from "../../../../pages/api-documentation/api.module.scss";
import * as styles from "./pagination.module.scss";
import GLOBALS from '../../../../helpers/constants';

const Pagination = () => {
  const baseApiUrl = GLOBALS.PROD_API_BASE_URL;

  return (
    <SectionContent
      title="Pagination"
      id="parameters-pagination"
      headingLevel={3}
    >
      <p>
        <strong>Parameter:</strong> <code className="inline">page[size]=</code> and{' '}
        <code className="inline">page[number]=</code>
      </p>
      <p>
        <strong>Definition:</strong> The page size will set the number of rows that are returned on
        a request, and page number will set the index for the pagination, starting at 1. This allows
        the user to paginate through the records returned from an API request.
      </p>
      <p>
        <strong>Accepts:</strong> The <code className="inline">page[number]=</code> and{' '}
        <code className="inline">page[size]=</code> parameters both accept integers.
      </p>
      <p>
        <strong>Required:</strong> No, neither pagination parameters are required to make an API
        request.
      </p>
      <p>
        <strong>Default:</strong> When no sort parameter is specified, the default is to sort by the
        first column listed. Most API endpoints are thus sorted by date in ascending order
        (historical to most current).
      </p>
      <p>
        <strong>Notes:</strong> When no page number or page size parameter is specified, the default
        response is
      </p>
      <ul className={styles.list}>
        <li>Page number: 1</li>
        <li>Page size: 100</li>
      </ul>

      <p><strong>Example:</strong></p>
      <p>
        From the Treasury Offset Program dataset, return data with 50 records per page, and return
        the 10th page of data.
      </p>
      <code className={`${apiStyles.code} ${apiStyles.marginBottom}`}>
        {baseApiUrl}/v1/debt/top/top_state?page[number]=10&page[size]=50
      </code>
    </SectionContent>
  )
};

export default Pagination;
