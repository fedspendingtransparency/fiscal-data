import React, { FunctionComponent, useEffect, useState } from 'react';
import { container, date, headerRow, loadingIcon, name, overlay, table, tableBorder, tableFooter } from './download-report-table.module.scss';
import DownloadReportTableRow from './download-report-table-row/download-report-table-row';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { IPublishedReportDataJson } from '../../../models/IPublishedReportDataJson';
import LoadingIndicator from '../../loading-indicator/loading-indicator';
import GenReportDownloadTableRow from './gen-report-download-table-row/gen-report-download-table-row';
import PaginationControls from '../../pagination/pagination-controls';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(reports?.length > 0 ? reports?.length : 1);
  const [displayReports, setDisplayReports] = useState([]);
  const [perPage, setPerPage] = useState(5);
  const showPaginationControls = true;
  const rowText = ['rows', 'rows'];

  const handleJump = page => {
    const pageNum = Math.max(1, page);
    setCurrentPage(Math.min(pageNum, maxPage));
  };

  const getCurrentData = () => {
    if (reports?.length) {
      const start = currentPage === 1 ? 0 : (currentPage - 1) * perPage;
      const rowsToShow = start + perPage;
      const stop = rowsToShow > reports?.length ? reports?.length : rowsToShow;
      setRowsShowing({ begin: start + 1, end: stop });
      setMaxPage(Math.ceil(reports.length / perPage));
      setMaxRows(reports.length);
      setDisplayReports(reports.slice(start, stop));
    }
  };

  useEffect(() => {
    getCurrentData();
    setCurrentPage(1);
  }, [reports, perPage]);

  useEffect(() => {
    getCurrentData();
  }, [currentPage]);

  const tablePagingProps = {
    itemsPerPage: perPage,
    handlePerPageChange: setPerPage,
    handleJump: handleJump,
    maxPage: maxPage,
    tableName: 'published-report-table',
    currentPage: currentPage,
    maxRows: maxRows,
    disablePerPage: false,
    showWhenEmpty: true,
  };

  useEffect(() => {
    setMobileView(pxToNumber(breakpointLg) > width);
  }, [width]);

  return (
    <>
      <div className={tableBorder}>
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
              {displayReports?.map((report: IPublishedReportDataJson, i: number) => {
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
                  <GenReportDownloadTableRow
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
      </div>
      <div className={tableFooter}>
        <div data-testid="rows-showing">{`Showing ${rowsShowing.begin} - ${rowsShowing.end} ${rowText[0]} of ${maxRows} ${rowText[1]}`}</div>
        {showPaginationControls && <PaginationControls pagingProps={tablePagingProps} />}
      </div>
    </>
  );
};

export default withWindowSize(DownloadReportTable);
