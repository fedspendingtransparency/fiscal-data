import React, { FunctionComponent } from 'react';
import { table, headerRow, name, date, emptyRow } from './generative-reports-empty-table.module.scss';
import GenerativeReportsTableNotice from '../generative-reports-table-notice/generative-reports-table-notice';
import GenerativeReportsFooter from '../generative-reports-footer/generative-reports-footer';

const GenerativeReportsEmptyTable: FunctionComponent = ({ mobileView }) => {
  const rowCount = mobileView ? 5 : 3;
  const additionalFiltersHeading = 'This table requires additional filters';
  const additionalFiltersBody = 'Select an account in the filter section above to display the reports.';

  return (
    <>
      <table className={table}>
        <thead>
          {!mobileView && (
            <th className={headerRow}>
              <div className={name}>Name</div>
              <div className={date}>Date</div>
              <div>Size</div>
            </th>
          )}
          {mobileView && <th>Name</th>}
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, index) => (
            <tr key={`row-${index}`}>
              <td className={emptyRow} />
            </tr>
          ))}
        </tbody>
        <GenerativeReportsTableNotice heading={additionalFiltersHeading} bodyText={additionalFiltersBody} />
      </table>
      <GenerativeReportsFooter />
    </>
  );
};

export default GenerativeReportsEmptyTable;
