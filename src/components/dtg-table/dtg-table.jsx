import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import DtgTableHeading from './dtg-table-heading/dtg-table-heading';
import DtgTableRow from './dtg-table-row/dtg-table-row';
import { loadingTimeout, netLoadingDelay, setColumns } from './dtg-table-helper';
import PaginationControls, { defaultPerPageOptions } from '../pagination/pagination-controls';
import { pagedDatatableRequest, formatDateForApi, REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../utils/api-utils';
import NotShownMessage from '../dataset-data/table-section-container/not-shown-message/not-shown-message';

import * as styles from './dtg-table.module.scss';
import CustomLink from '../links/custom-link/custom-link';
import DataTable from '../data-table/data-table';
import { useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState, reactTableSortingState } from '../../recoil/reactTableFilteredState';
import moment from 'moment/moment';
import { ErrorBoundary } from 'react-error-boundary';

const defaultRowsPerPage = 10;
export default function DtgTable({
  tableProps,
  perPage,
  setPerPage,
  selectColumnPanel,
  setSelectColumnPanel,
  setTableColumnSortData,
  resetFilters,
  setResetFilters,
  setFiltersActive,
  tableMeta,
  tableColumnSortData,
  manualPagination,
  setManualPagination,
  pivotSelected,
  reactTable,
}) {
  const {
    dePaginated,
    rawData,
    width,
    noBorder,
    tableName,
    shouldPage,
    excludeCols,
    selectedTable,
    selectedPivot,
    dateRange,
    columnConfig,
    caption,
    selectColumns,
    hideColumns,
    hasPublishedReports,
    publishedReports,
  } = tableProps;

  const [reactTableData, setReactTableData] = useState(null);

  const data = tableProps.data !== undefined && tableProps.data !== null ? tableProps.data : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : !shouldPage && data.length > defaultRowsPerPage ? data.length : defaultRowsPerPage
  );
  const [tableData, setTableData] = useState(!shouldPage ? data : []);
  const [apiError, setApiError] = useState(tableProps.apiError || false);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(data.length > 0 ? data.length : 1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [emptyDataMessage, setEmptyDataMessage] = useState();
  const [showPaginationControls, setShowPaginationControls] = useState();
  const filteredDateRange = useRecoilValue(reactTableFilteredDateRangeState);
  const sorting = useRecoilValue(reactTableSortingState);

  let loadCanceled = false;

  let debounce;
  let loadTimer;

  const rowText = ['rows', 'rows'];

  const tableWidth = width ? (isNaN(width) ? width : `${width}px`) : 'auto';

  const getAllExcludedCols = () => {
    const allCols = [];

    if (excludeCols !== undefined) {
      allCols.push(...excludeCols);
    }
    if (hideColumns) {
      allCols.push(...hideColumns);
    }
    return allCols;
  };

  const dataProperties = {
    keys: tableData[0] ? Object.keys(tableData[0]) : [],
    excluded: getAllExcludedCols(),
  };
  const columns = setColumns(dataProperties, columnConfig);

  const handlePerPageChange = numRows => {
    const numItems = numRows >= maxRows ? maxRows : numRows;
    setItemsPerPage(numItems);
    setRowsShowing({
      begin: 1,
      end: numItems,
    });
    setCurrentPage(1);
    if (setPerPage) {
      setPerPage(numRows);
    }
  };

  const getPagedData = resetPage => {
    console.log('getPagedData');
    if (debounce || loadCanceled) {
      clearTimeout(debounce);
    }
    if (!loadCanceled) {
      debounce = setTimeout(() => {
        makePagedRequest(resetPage);
      }, 400);
    }
  };

  const makePagedRequest = async resetPage => {
    if (selectedTable && selectedTable.endpoint && !loadCanceled) {
      loadTimer = setTimeout(() => loadingTimeout(loadCanceled, setIsLoading), netLoadingDelay);

      const from =
        filteredDateRange?.from && moment(dateRange.from).diff(filteredDateRange?.from) <= 0
          ? filteredDateRange?.from.format('YYYY-MM-DD')
          : formatDateForApi(dateRange.from);
      const to =
        filteredDateRange?.from && moment(dateRange.to).diff(filteredDateRange?.to) >= 0
          ? filteredDateRange?.to.format('YYYY-MM-DD')
          : formatDateForApi(dateRange.to);
      const startPage = resetPage ? 1 : currentPage;

      pagedDatatableRequest(selectedTable, from, to, selectedPivot, startPage, itemsPerPage, tableColumnSortData)
        .then(res => {
          if (!loadCanceled) {
            setEmptyDataMessage(null);
            if (res.data.length < 1) {
              setIsLoading(false);
              clearTimeout(loadTimer);
              setEmptyDataMessage(
                <NotShownMessage
                  heading="Change selections in order to preview data"
                  bodyText={`With the current Date Range selected we are unable to render a
                    preview at this time.`}
                />
              );
            }
            const totalCount = res.meta['total-count'];
            const start = startPage === 1 ? 0 : (startPage - 1) * itemsPerPage;
            const rowsToShow = start + itemsPerPage;
            const stop = rowsToShow > totalCount ? totalCount : rowsToShow;
            setRowsShowing({
              begin: start + 1,
              end: stop,
            });
            setMaxPage(res.meta['total-pages']);
            if (maxRows !== totalCount) setMaxRows(totalCount);
            setTableData(res.data);
          }
        })
        .catch(err => {
          if (startPage === 1) {
            setRowsShowing({ begin: 0, end: 0 });
            setMaxRows(0);
          }
          console.error(err);
          if (!loadCanceled) {
            setApiError(err);
          }
        })
        .finally(() => {
          if (!loadCanceled) {
            setIsLoading(false);
            clearTimeout(loadTimer);
          }
        });
    }
  };

  const getCurrentData = () => {
    if (tableProps.apiError && currentPage === 1) {
      setRowsShowing({ begin: 0, end: 0 });
      setMaxRows(0);
    } else {
      const start = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
      const rowsToShow = start + itemsPerPage;
      const stop = rowsToShow > data.length ? data.length : rowsToShow;
      setRowsShowing({ begin: start + 1, end: stop });
      setMaxPage(Math.ceil(data.length / itemsPerPage));
      setTableData(data.slice(start, stop));
    }
  };

  const handleJump = page => {
    const pageNum = Math.max(1, page);
    setCurrentPage(Math.min(pageNum, maxPage));
  };

  const populateRows = currentColumns => {
    const tableRows = [];
    tableData.forEach((row, index) => {
      tableRows.push(<DtgTableRow columns={currentColumns} data={row} key={index} tableName={tableName} />);
    });
    setRows(tableRows);
  };

  const isPaginationControlNeeded = () => currentPage >= 1 || (!apiError && !tableProps.apiError && maxRows > defaultPerPageOptions[0]);

  const updateSmallFractionDataType = () => {
    //Overwrite type for special case number format handling
    if (selectedTable && selectedTable.apiId === 178) {
      selectedTable.fields[2].dataType = 'SMALL_FRACTION';
    }
  };

  useEffect(() => {
    if ((tableMeta && tableMeta['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE) || !reactTable) {
      console.log(13);
      updateSmallFractionDataType();
      setCurrentPage(1);
      setApiError(false);
      const ssp = tableProps.serverSidePagination;
      ssp !== undefined && ssp !== null ? getPagedData(true) : getCurrentData();
      return () => {
        loadCanceled = true;
      };
    }
  }, [selectedTable, dateRange]);

  useEffect(() => {
    if ((tableMeta && tableMeta['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE) || !reactTable) {
      console.log(12);

      updateSmallFractionDataType();
      setCurrentPage(1);
      setApiError(false);
      const ssp = tableProps.serverSidePagination;
      ssp !== undefined && ssp !== null ? getPagedData(true) : getCurrentData();
      return () => {
        loadCanceled = true;
      };
    }
  }, [sorting, filteredDateRange]);

  useEffect(() => {
    if ((tableMeta && selectedTable.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE) || !reactTable) {
      console.log(11);
      setApiError(false);
      const ssp = tableProps.serverSidePagination;
      ssp !== undefined && ssp !== null ? getPagedData(false) : getCurrentData();
      return () => {
        loadCanceled = true;
      };
    }
  }, [tableProps.data, tableProps.serverSidePagination, itemsPerPage, currentPage]);

  useEffect(() => {
    populateRows(columns);
  }, [tableData]);

  useEffect(() => {
    if (data && data.length) {
      setMaxRows(apiError ? 0 : data.length);
    }
  }, [data]);

  useEffect(() => {
    if (!tableProps.data) {
      setCurrentPage(1);
    }
  }, [tableProps.data]);

  useEffect(() => {
    setShowPaginationControls(isPaginationControlNeeded());
  }, [maxRows]);

  if (maxRows === 1) {
    rowText[0] = '';
    rowText[1] = 'row';
  }
  const pagingProps = {
    itemsPerPage,
    handlePerPageChange,
    handleJump,
    maxPage,
    tableName,
    currentPage,
    maxRows,
  };

  useEffect(() => {
    if (tableProps && dePaginated !== undefined && selectedTable.rowCount <= REACT_TABLE_MAX_NON_PAGINATED_SIZE && !pivotSelected?.pivotValue) {
      if (dePaginated !== null) {
        console.log(1);
        // large dataset tables <= 20000 rows
        setReactTableData(dePaginated);
        setManualPagination(false);
      } else if (rawData !== null && rawData.hasOwnProperty('data')) {
        console.log(2);
        setReactTableData(rawData);
        setManualPagination(false);
        setIsLoading(false);
      }
    }
  }, [rawData, dePaginated]);

  const activePivot = (data, pivot) =>
    data?.pivotApplied?.includes(pivot.pivotValue?.columnName) && data?.pivotApplied?.includes(pivot.pivotView?.title);

  useEffect(() => {
    if (tableProps) {
      // Pivot data
      if (rawData !== null && rawData?.hasOwnProperty('data') && activePivot(rawData, pivotSelected)) {
        setReactTableData(rawData);
        setManualPagination(false);
        setIsLoading(false);
      }
    }
  }, [pivotSelected, rawData]);

  useEffect(() => {
    if (tableData.length > 0 && tableMeta && selectedTable.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE && !pivotSelected?.pivotValue) {
      if (tableMeta['total-count'] <= REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
        if (rawData) {
          console.log(3, tableMeta['total-count']);
          setReactTableData(rawData);
          setManualPagination(false);
        } else {
          console.log(4);
          setReactTableData(dePaginated);
          setManualPagination(false);
        }
      } else {
        console.log(5);
        // Data tables > 20000 rows, will use server side paginated data
        setReactTableData({ data: tableData, meta: tableMeta });
        setManualPagination(true);
      }
    }
  }, [tableData, tableMeta]);

  return (
    <div className={styles.overlayContainer}>
      {/* Loading Indicator */}
      {(isLoading || (reactTable && !reactTableData)) && (
        <div className={reactTable ? styles.overlayContainerReactTableHeight : undefined}>
          <div data-test-id="loading-overlay" className={styles.overlay} />
          <div className={styles.loadingIcon}>
            <FontAwesomeIcon data-test-id="loading-icon" icon={faSpinner} spin pulse /> Loading...
          </div>
        </div>
      )}
      {reactTable && reactTableData?.data && (
        <div data-test-id="table-content" className={styles.overlayContainerNoFooter}>
          {/* API Error Message */}
          {(apiError || tableProps.apiError) && !emptyDataMessage && (
            <>
              <div data-test-id="error-overlay" className={styles.overlay} />
              <div data-test-id="api-error" className={styles.apiError}>
                <p>
                  <strong>Table failed to load.</strong>
                </p>
                <p>
                  There was an error with our API and we are unable to load this table. Please try your request again or{' '}
                  <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">contact us</CustomLink> for assistance.
                </p>
              </div>
            </>
          )}
          <ErrorBoundary FallbackComponent={() => <></>}>
            <DataTable
              rawData={reactTableData}
              defaultSelectedColumns={selectColumns}
              setTableColumnSortData={setTableColumnSortData}
              hideCellLinks={true}
              shouldPage={shouldPage}
              pagingProps={pagingProps}
              showPaginationControls={showPaginationControls}
              hasPublishedReports={hasPublishedReports}
              publishedReports={publishedReports}
              setSelectColumnPanel={setSelectColumnPanel}
              selectColumnPanel={selectColumnPanel}
              resetFilters={resetFilters}
              setResetFilters={setResetFilters}
              setFiltersActive={setFiltersActive}
              hideColumns={hideColumns}
              tableName={tableName}
              manualPagination={manualPagination}
              maxRows={maxRows}
              rowsShowing={rowsShowing}
              columnConfig={columnConfig}
            />
          </ErrorBoundary>
        </div>
      )}
      {!reactTable && (
        <>
          <div data-test-id="table-content" className={styles.overlayContainerNoFooter}>
            {/* API Error Message */}
            {(apiError || tableProps.apiError) && !emptyDataMessage && (
              <>
                <div data-test-id="error-overlay" className={styles.overlay} />
                <div data-test-id="api-error" className={styles.apiError}>
                  <p>
                    <strong>Table failed to load.</strong>
                  </p>
                  <p>
                    There was an error with our API and we are unable to load this table. Please try your request again or{' '}
                    <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov?subject=Contact Us">contact us</CustomLink> for assistance.
                  </p>
                </div>
              </>
            )}

            <div className={styles.selectColumnsWrapper}>
              {/* Table Wrapper */}
              <div className={noBorder ? [styles.wrapper, styles.noBorder].join(' ') : styles.wrapper}>
                {/* Empty Data Message */}
                {emptyDataMessage && emptyDataMessage}
                {/* Table */}
                {!emptyDataMessage && (
                  <table {...tableProps.aria} style={{ width: tableWidth }}>
                    {caption !== undefined && <caption className="sr-only">{caption}</caption>}
                    <DtgTableHeading columns={columns} />
                    <tbody>{rows}</tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          {/* Table Footer */}
          {shouldPage && (
            <div data-test-id="table-footer" className={styles.tableFooter}>
              <div data-test-id="rows-showing" className={styles.rowsShowing}>
                {`Showing ${rowsShowing.begin} - ${rowsShowing.end} ${rowText[0]} of ${maxRows} ${rowText[1]}`}
              </div>
              {showPaginationControls && <PaginationControls pagingProps={pagingProps} />}
            </div>
          )}
        </>
      )}
    </div>
  );
}

DtgTable.propTypes = {
  tableProps: PropTypes.shape({}),
};

DtgTable.defaultProps = {
  tableProps: {
    columnConfig: {
      property: '',
      name: '',
      type: '',
    },
  },
};
