import React, { FunctionComponent, useState, useEffect } from 'react';
import { table, date } from './download-report-table.module.scss';
import DownloadReportTableRow from './download-report-table-row/download-report-table-row';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { getDateLabelForReport } from '../../../helpers/dataset-detail/report-helpers';

export const DownloadReportTable: FunctionComponent<{ reports; isDailyReport: boolean; width?: number }> = ({ reports, isDailyReport, width }) => {
  console.log(reports);
  const [mobileView, setMobileView] = useState(pxToNumber(breakpointLg) > width);

  useEffect(() => {
    setMobileView(pxToNumber(breakpointLg) > width);
  }, [width]);

  return (
    <table className={table} data-testid="reportsSectionTable">
      <thead>
        {!mobileView && (
          <tr>
            <th>Name</th>
            <th className={date}>Date</th>
            <th>Size</th>
            <th></th>
          </tr>
        )}
        {mobileView && (
          <tr>
            <th>Name</th>
          </tr>
        )}
      </thead>
      <tbody>
        {reports?.map((report, i) => {
          return (
            <DownloadReportTableRow
              fileName={report.report_group_desc}
              date={getDateLabelForReport(report, isDailyReport)}
              mobileView={mobileView}
              path={report.path}
              key={i}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default withWindowSize(DownloadReportTable);
