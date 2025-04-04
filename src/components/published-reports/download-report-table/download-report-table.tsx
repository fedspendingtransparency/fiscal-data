import React, { FunctionComponent, useEffect, useState } from 'react';
import { date, headerRow, name, table } from './download-report-table.module.scss';
import DownloadReportTableRow from './download-report-table-row/download-report-table-row';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { IPublishedReportDataJson } from '../../../models/IPublishedReportDataJson';

// Exporting here for unit testing purposes
export const DownloadReportTable: FunctionComponent<{
  reports?: IPublishedReportDataJson[];
  isDailyReport: boolean;
  width?: number;
  generatedReports?;
}> = ({ reports, isDailyReport, width, generatedReports }) => {
  const [mobileView, setMobileView] = useState(pxToNumber(breakpointLg) > width);

  useEffect(() => {
    setMobileView(pxToNumber(breakpointLg) > width);
  }, [width]);

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
      <tbody>
        {reports?.map((report: IPublishedReportDataJson, i: number) => {
          return <DownloadReportTableRow reportFile={report} isDailyReport={isDailyReport} mobileView={mobileView} key={i} />;
        })}
        {generatedReports?.map((report, i: number) => {
          return <DownloadReportTableRow generatedReport={report} isDailyReport={isDailyReport} mobileView={mobileView} key={i} />;
        })}
      </tbody>
    </table>
  );
};

export default withWindowSize(DownloadReportTable);
