import React, { FunctionComponent } from 'react';
import { container, date, emptyRow, headerRow, name, table } from './reports-empty-table.module.scss';
import ReportsTableNotice from '../reports-table-notice/reports-table-notice';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';

const ReportsEmptyTable: FunctionComponent = ({ width, apiErrorMessage, heading, body }) => {
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
      <ReportsTableNotice heading={heading} bodyText={body} apiErrorMessage={apiErrorMessage} />
    </div>
  );
};

export default ReportsEmptyTable;
