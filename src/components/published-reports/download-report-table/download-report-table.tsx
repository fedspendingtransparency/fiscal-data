import React, { FunctionComponent } from 'react';
import { table } from './download-report-table.module.scss';
import DownloadReportTableRow from './download-report-table-row/download-report-table-row';

const DownloadReportTable: FunctionComponent = () => {
  return (
    <table className={table} data-testId="reportsSectionTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Size</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {/*map or forEach each row here */}
        <DownloadReportTableRow fileName="Entire.pdf" />
        <DownloadReportTableRow fileName="Entire.xls" />
        <DownloadReportTableRow fileName="STRIPS.pdf" />
        <DownloadReportTableRow fileName="Placeholder" />
        <DownloadReportTableRow fileName="Balance Sheet.pdf" />
      </tbody>
    </table>
  );
};

export default DownloadReportTable;
