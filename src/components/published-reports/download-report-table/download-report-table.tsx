import React, { FunctionComponent, useState, useEffect } from 'react';
import { table } from './download-report-table.module.scss';
import DownloadReportTableRow from './download-report-table-row/download-report-table-row';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';

export const DownloadReportTable: FunctionComponent<{ width?: number }> = ({ width }) => {
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
            <th>Date</th>
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
        {/*map or forEach each row here */}
        <DownloadReportTableRow fileName="Entire.pdf" mobileView={mobileView} />
        <DownloadReportTableRow fileName="Entire.xls" mobileView={mobileView} />
        <DownloadReportTableRow fileName="STRIPS.pdf" mobileView={mobileView} />
        <DownloadReportTableRow fileName="Placeholder.pdf" mobileView={mobileView} />
        <DownloadReportTableRow fileName="An_Extra_Extra_Long_Download_File_Name.pdf" mobileView={mobileView} />
      </tbody>
    </table>
  );
};

export default withWindowSize(DownloadReportTable);
