import React, { FunctionComponent } from 'react';
import { container, date, emptyRow, headerRow, name, table } from './generative-reports-empty-table.module.scss';
import GenerativeReportsTableNotice from '../generative-reports-table-notice/generative-reports-table-notice';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import DtgTableApiError from '../../dtg-table/dtg-table-api-error/dtg-table-api-error';

const GenerativeReportsEmptyTable: FunctionComponent = ({ width, apiErrorMessage }) => {
  const mobileView = width < pxToNumber(breakpointLg);
  const rowCount = 3;

  // const headerText = apiErrorMessage ? 'Api error header text' : 'This table requires additional filters';
  // const bodyText = apiErrorMessage ? 'Api error body text' : 'Select an account in the filter section above to display the reports.';
  const headerText = 'This table requires additional filters';
  const bodyText = 'Select an account in the filter section above to display the reports.';

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
      {apiErrorMessage && <DtgTableApiError />}
      {!apiErrorMessage && <GenerativeReportsTableNotice heading={headerText} bodyText={bodyText} />}
    </div>
  );
};

export default GenerativeReportsEmptyTable;
