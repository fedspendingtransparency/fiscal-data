import React from 'react';
import SectionContent from '../section-content/section-content';
import CustomLink from '../../links/custom-link/custom-link';
import * as styles from '../../dtg-table/dtg-table.module.scss';
import MetaObject from './meta-object/meta-object';
import LinksObject from './links-object/links-object';
import DataObject from './data-object/data-object';
import ErrorObject from './error-object/error-object';
import PaginationHeader from './pagination-header/pagination-header';

const Responses = () => {
  const tableData = [
    {
      responseCode: '200',
      description: 'OK - Response to a successful GET request',
    },
    {
      responseCode: '304',
      description: 'Not modified - Cached response',
    },
    {
      responseCode: '400',
      description: 'Bad Request - Request was malformed',
    },
    {
      responseCode: '403',
      description: 'Forbidden - API Key is not valid',
    },
    {
      responseCode: '404',
      description: 'Not Found - When a non-existent resource is requested',
    },
    {
      responseCode: '405',
      description: 'Method Not Allowed - Attempting anything other than a GET request',
    },
    {
      responseCode: '429',
      description: 'Too Many Requests - Request failed due to rate limiting',
    },
    {
      responseCode: '500',
      description: 'Internal Server Error - The server failed to fulfill a request',
    },
  ];
  return (
    <>
      <SectionContent id="responses-response-objects" headingLevel={2} title="Responses & Response Objects">
        <p>
          The response will be formatted according to the format input parameter specified in the{' '}
          <CustomLink url="/api-documentation/#parameters-format">Format</CustomLink> section and will be json, xml or csv. When format is not
          specified, the default response will be JSON. The response will be utf-8 and will have gzip support.
        </p>
      </SectionContent>
      <SectionContent id="responses-response-codes" headingLevel={3} title="Response Codes">
        <p id="response-codes-id">The following response codes may be returned:</p>
        <div className={styles.wrapper}>
          <table aria-describedby="response-codes-id">
            <caption className="sr-only">Table of response codes with two columns: response code and description.</caption>
            <tbody>
              <tr>
                <th scope="col">Response Code</th>
                <th scope="col">Description</th>
              </tr>
              {tableData.map(obj => {
                return (
                  <tr key={obj.responseCode}>
                    <td>{obj.responseCode}</td>
                    <td>{obj.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionContent>
      <MetaObject />
      <LinksObject />
      <DataObject />
      <ErrorObject />
      <PaginationHeader />
    </>
  );
};
export default Responses;
