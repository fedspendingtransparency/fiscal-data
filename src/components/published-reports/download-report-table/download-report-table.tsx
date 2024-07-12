import React, { FunctionComponent } from 'react';
import { table } from './download-report-table.module.scss';
import DownloadReportTableRow from './download-report-table-row/download-report-table-row';

const DownloadReportTable: FunctionComponent = () => {
  return (
    <table className={table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Size</th>
          <th></th>
        </tr>
      </thead>

      {/*map or forEach each row here */}
      <DownloadReportTableRow fileName="pdf" />
      <DownloadReportTableRow fileName="pdf" />
      <DownloadReportTableRow fileName="pdf" />
    </table>
  );
};

export default DownloadReportTable;
