import React, { FunctionComponent, useState, useEffect } from 'react';
import { table, date, headerRow, name, emptyRow } from './generative-reports-table.module.scss';
import GenerativeReportsTableRow from './generative-reports-table-row/generative-reports-table-row';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { IPublishedReportDataJson } from '../../../models/IPublishedReportDataJson';
import TableNotice from '../../data-preview/data-preview-chart-table-display/table-notice/table-notice';

// Exporting here for unit testing purposes

export const GenerativeReportsTable: FunctionComponent<{ reports: IPublishedReportDataJson[]; isDailyReport: boolean; width?: number }> = ({
  reports,
  isDailyReport,
  width,
}) => {
  const [mobileView, setMobileView] = useState(pxToNumber(breakpointLg) > width);

  useEffect(() => {
    setMobileView(pxToNumber(breakpointLg) > width);
  }, [width]);

  const additionalFiltersHeading = 'This table requires additional filters';
  const additionalFiltersBody = 'Select an account in the filter section above to display the reports.';

  return (
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
      {reports && (
        <tbody>
          {reports?.map((report: IPublishedReportDataJson, i: number) => {
            return <GenerativeReportsTableRow reportFile={report} isDailyReport={isDailyReport} mobileView={mobileView} key={i} />;
          })}
        </tbody>
      )}
      {!reports && (
        <>
          <tbody>
            <tr>
              <td className={emptyRow} />
            </tr>
            <tr>
              <td className={emptyRow} />
            </tr>
          </tbody>
          <TableNotice heading={additionalFiltersHeading} bodyText={additionalFiltersBody} />
        </>
      )}
    </table>
  );
};

export default withWindowSize(GenerativeReportsTable);
