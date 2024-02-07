import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import DtgTableHeading from './dtg-table-heading/dtg-table-heading';
import DtgTableRow from './dtg-table-row/dtg-table-row';
import { loadingTimeout, netLoadingDelay, setColumns } from './dtg-table-helper';
import PaginationControls, { defaultPerPageOptions } from '../pagination/pagination-controls';
import { pagedDatatableRequest, formatDateForApi, REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../utils/api-utils';
import NotShownMessage from '../dataset-data/table-section-container/not-shown-message/not-shown-message';

import {
  overlayContainer,
  overlay,
  loadingIcon,
  overlayContainerNoFooter,
  apiErrorStyle,
  selectColumnsWrapper,
  wrapper,
  noBorderStyle,
  tableFooter,
  rowsShowingStyle,
} from './dtg-table.module.scss';
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
  rawDataTable,
  allowColumnWrap,
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
    config,
    columnConfig,
    detailColumnConfig,
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
  const detailViewAPIConfig = config?.detailView ? config.apis.find(api => api.apiId === config.detailView.apiId) : null;

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

  useMemo(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE || !reactTable || !rawDataTable) {
      updateSmallFractionDataType();
      setCurrentPage(1);
      setApiError(false);
      const ssp = tableProps.serverSidePagination;
      ssp !== undefined && ssp !== null ? getPagedData(true) : getCurrentData();
      return () => {
        loadCanceled = true;
      };
    }
  }, [sorting, filteredDateRange, selectedTable, dateRange]);

  useMemo(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE || !reactTable || !rawDataTable) {
      //prevent hook from triggering twice on pivot selection
      if ((pivotSelected?.pivotValue && !tableProps.serverSidePagination) || !pivotSelected?.pivotValue) {
        setApiError(false);
        const ssp = tableProps.serverSidePagination;
        ssp !== undefined && ssp !== null ? getPagedData(false) : getCurrentData();
        return () => {
          loadCanceled = true;
        };
      }
    }
  }, [tableProps.serverSidePagination, itemsPerPage, currentPage]);

  useEffect(() => {
    populateRows(columns);
  }, [tableData]);

  useMemo(() => {
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

  useMemo(() => {
    if (tableProps && selectedTable?.rowCount <= REACT_TABLE_MAX_NON_PAGINATED_SIZE && !pivotSelected?.pivotValue) {
      if (dePaginated !== null && dePaginated !== undefined) {
        // large dataset tables <= 20000 rows
        setReactTableData(dePaginated);
        setManualPagination(false);
      } else if (rawData !== null && rawData.hasOwnProperty('data')) {
        setReactTableData(rawData);
        setManualPagination(false);
      }
    } else if (data && !rawDataTable) {
      setReactTableData({ data: data });
    }
  }, [rawData, dePaginated]);

  const activePivot = (data, pivot) => {
    return data?.pivotApplied?.includes(pivot?.pivotValue?.columnName) && data?.pivotApplied?.includes(pivot.pivotView?.title);
  };

  const updatedData = (newData, currentData) => {
    return JSON.stringify(newData) !== JSON.stringify(currentData);
  };

  useMemo(() => {
    if (tableProps) {
      // Pivot data
      if (rawData !== null && rawData?.hasOwnProperty('data') && activePivot(rawData, pivotSelected)) {
        setReactTableData(rawData);
        if (setManualPagination) {
          setManualPagination(false);
        }
      } else if (data && !rawDataTable) {
        setReactTableData({ data: data });
      }
    }
  }, [pivotSelected, rawData]);

  useMemo(() => {
    if (
      tableData.length > 0 &&
      tableMeta &&
      selectedTable.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE &&
      !pivotSelected?.pivotValue &&
      !rawData?.pivotApplied
    ) {
      if (tableMeta['total-count'] <= REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
        // data with current date range < 20000
        if (rawData) {
          setReactTableData(rawData);
          setManualPagination(false);
        } else if (dePaginated) {
          setReactTableData(dePaginated);
          setManualPagination(false);
        }
      } else {
        if (!(reactTableData?.pivotApplied && !updatedData(tableData, reactTableData?.data.slice(0, itemsPerPage)))) {
          setReactTableData({ data: tableData, meta: tableMeta });
          setManualPagination(true);
        }
      }
    } else if (data && !rawDataTable && !rawData) {
      setReactTableData({ data: data });
    }
  }, [tableData, tableMeta, rawData, dePaginated]);

  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {(isLoading || (reactTable && !reactTableData)) && (
        <>
          <div data-test-id="loading-overlay" className={overlay} />
          <div className={loadingIcon}>
            <FontAwesomeIcon data-test-id="loading-icon" icon={faSpinner} spin pulse /> Loading...
          </div>
        </>
      )}
      {reactTable && reactTableData?.data && (
        <div data-test-id="table-content" className={overlayContainerNoFooter}>
          {/* API Error Message */}
          {(apiError || tableProps.apiError) && !emptyDataMessage && (
            <>
              <div data-test-id="error-overlay" className={overlay} />
              <div data-test-id="api-error" className={apiErrorStyle}>
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
              nonRawDataColumns={!rawDataTable ? columnConfig : null}
              detailColumnConfig={detailColumnConfig}
              detailViewAPI={detailViewAPIConfig}
              detailView={config?.detailView}
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
              allowColumnWrap={allowColumnWrap}
              aria={tableProps.aria}
              pivotSelected={pivotSelected?.pivotValue}
            />
          </ErrorBoundary>
        </div>
      )}
      {!reactTable && (
        <>
          <div data-test-id="table-content" className={overlayContainerNoFooter}>
            {/* API Error Message */}
            {(apiError || tableProps.apiError) && !emptyDataMessage && (
              <>
                <div data-test-id="error-overlay" className={overlay} />
                <div data-test-id="api-error" className={apiErrorStyle}>
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

            <div className={selectColumnsWrapper}>
              {/* Table Wrapper */}
              <div className={noBorder ? [wrapper, noBorderStyle].join(' ') : wrapper}>
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
            <div data-test-id="table-footer" className={tableFooter}>
              <div data-test-id="rows-showing" className={rowsShowingStyle}>
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
