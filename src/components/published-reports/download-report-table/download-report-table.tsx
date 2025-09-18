import React, { FunctionComponent, useEffect, useState } from 'react';
import { container, date, headerRow, loadingIcon, name, overlay, table } from './download-report-table.module.scss';
import DownloadReportTableRow from './download-report-table-row/download-report-table-row';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { IPublishedReportDataJson } from '../../../models/IPublishedReportDataJson';
import LoadingIndicator from '../../loading-indicator/loading-indicator';
import GenReportDownloadButton from './gen-report-download-button/gen-report-download-button';

// Exporting here for unit testing purposes
export const DownloadReportTable: FunctionComponent<{
  reports?: IPublishedReportDataJson[];
  isDailyReport: boolean;
  width?: number;
  generatedReports?;
  setApiErrorMessage?: (errorState: boolean) => void;
  isLoading?: boolean;
  setIsLoading?: (loadingState: boolean) => void;
}> = ({ reports, isDailyReport, width, generatedReports, setApiErrorMessage, isLoading, setIsLoading }) => {
  const [mobileView, setMobileView] = useState(pxToNumber(breakpointLg) > width);

  useEffect(() => {
    setMobileView(pxToNumber(breakpointLg) > width);
  }, [width]);

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
          {reports?.map((report: IPublishedReportDataJson, i: number) => {
            return (
              <DownloadReportTableRow
                reportFile={report}
                isDailyReport={isDailyReport}
                mobileView={mobileView}
                key={i}
                setApiErrorMessage={setApiErrorMessage}
                setIsLoading={setIsLoading}
              />
            );
          })}
          {generatedReports?.map((report, i: number) => {
            return (
              <GenReportDownloadButton
                generatedReport={report}
                mobileView={mobileView}
                key={i}
                setApiErrorMessage={setApiErrorMessage}
                setIsLoading={setIsLoading}
              />
            );
          })}
        </tbody>
      </table>
      {isLoading && <LoadingIndicator loadingClass={loadingIcon} overlayClass={overlay} />}
    </div>
  );
};

export default withWindowSize(DownloadReportTable);
