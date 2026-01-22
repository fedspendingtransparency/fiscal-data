import React, { FunctionComponent } from 'react';
import { container, date, emptyRow, headerRow, name, table, loadingIcon, overlay } from './reports-empty-table.module.scss';
import ReportsTableNotice from '../reports-table-notice/reports-table-notice';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const ReportsEmptyTable: FunctionComponent = ({ width, apiErrorMessage, heading, body, isLoading }) => {
  const mobileView = width < pxToNumber(breakpointLg);
  const rowCount = 3;

  return (
    <div className={container}>
      <table className={table}>
        <thead>
          {!mobileView && (
            <tr>
              <th className={headerRow}>
                <div className={name}>Name</div>
                <div className={date}>Date</div>
                <div>Size</div>
              </th>
            </tr>
          )}
          {mobileView && (
            <tr>
              <th>Name</th>
            </tr>
          )}
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, index) => (
            <tr key={`row-${index}`}>
              <td className={emptyRow} />
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading ? (
        <>
          <div data-test-id="loading-overlay" className={overlay} />
          <div data-testid="loadingSection" className={loadingIcon}>
            <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner as IconProp} spin pulse />
            Loading...
          </div>
        </>
      ) : (
        <ReportsTableNotice heading={heading} bodyText={body} apiErrorMessage={apiErrorMessage} />
      )}
    </div>
  );
};

export default ReportsEmptyTable;
