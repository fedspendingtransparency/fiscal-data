import React, { FunctionComponent } from 'react';
import { container, date, emptyRow, headerRow, name, table } from './generative-reports-empty-table.module.scss';
import GenerativeReportsTableNotice from '../generative-reports-table-notice/generative-reports-table-notice';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';

const GenerativeReportsEmptyTable: FunctionComponent = ({ width }) => {
  const mobileView = width < pxToNumber(breakpointLg);
  const rowCount = 3;
  const additionalFiltersHeading = 'This table requires additional filters';
  const additionalFiltersBody = 'Select an account in the filter section above to display the reports.';

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
      <GenerativeReportsTableNotice heading={additionalFiltersHeading} bodyText={additionalFiltersBody} />
    </div>
  );
};

export default GenerativeReportsEmptyTable;
