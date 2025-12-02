import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DtgTableHeading from './dtg-table-heading/dtg-table-heading';
import DtgTableRow from './dtg-table-row/dtg-table-row';
import { loadingTimeout, netLoadingDelay, setColumns } from './dtg-table-helper';
import PaginationControls, { defaultPerPageOptions } from '../pagination/pagination-controls';
import { formatDateForApi, pagedDatatableRequest, REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../utils/api-utils';
import NotShownMessage from '../dataset-data/table-section-container/not-shown-message/not-shown-message';
import {
  loadingIcon,
  noBorderStyle,
  overlay,
  overlayContainer,
  overlayContainerNoFooter,
  rowsShowingStyle,
  selectColumnsWrapper,
  tableFooter,
  wrapper,
} from './dtg-table.module.scss';
import DataTable from '../data-table/data-table';
import { useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../recoil/reactTableFilteredState';
import moment from 'moment/moment';
import { ErrorBoundary } from 'react-error-boundary';
import DtgTableApiError from './dtg-table-api-error/dtg-table-api-error';
import LoadingIndicator from '../loading-indicator/loading-indicator';

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
  tableMeta,
  tableColumnSortData,
  manualPagination,
  setManualPagination,
  pivotSelected,
  reactTable,
  rawDataTable,
  allowColumnWrap,
  setDetailViewState,
  detailViewState,
  setSummaryValues,
  setIsLoading,
  isLoading,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  userFilterSelection,
  disableDateRangeFilter,
  datasetName,
  hasDownloadTimestamp,
  enableDownload,
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
    customFormatting,
    chartTable,
  } = tableProps;

  const [reactTableData, setReactTableData] = useState(null);
  const data = tableProps.data !== undefined && tableProps.data !== null ? tableProps.data : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : !shouldPage && data.length > defaultRowsPerPage ? data.length : defaultRowsPerPage
  );
  const [tableData, setTableData] = useState(!shouldPage ? data : []);
  const [table, setTable] = useState(!shouldPage ? data : []);
  const [apiError, setApiError] = useState(tableProps.apiError || false);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(data.length > 0 ? data.length : 1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
  const [rows, setRows] = useState([]);
  const [emptyDataMessage, setEmptyDataMessage] = useState();
  const [showPaginationControls, setShowPaginationControls] = useState();
  const filteredDateRange = useRecoilValue(reactTableFilteredDateRangeState);
  const detailViewAPIConfig = config?.detailView ? config.apis.find(api => api.apiId === config.detailView.apiId) : null;
  const [tableSorting, setTableSorting] = useState([]);

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
  const isPaginationControlNeeded = () => currentPage >= 1 || (!apiError && !tableProps.apiError && maxRows > defaultPerPageOptions[0]);

  const rowData = Array.isArray(tableData) ? tableData : tableData?.data || [];

  const dataProperties = {
    keys: rowData[0] ? Object.keys(rowData[0]) : [],
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

  const getDateFilters = () => {
    let from, to;
    const recordDateColumnFilter = filteredDateRange?.find(date => date?.fieldName === 'record_date');
    if (recordDateColumnFilter) {
      from =
        recordDateColumnFilter?.from && moment(dateRange.from).diff(recordDateColumnFilter?.from) <= 0
          ? recordDateColumnFilter?.from.format('YYYY-MM-DD')
          : formatDateForApi(dateRange.from);
      to =
        recordDateColumnFilter?.from && moment(dateRange.to).diff(recordDateColumnFilter?.to) >= 0
          ? recordDateColumnFilter?.to.format('YYYY-MM-DD')
          : formatDateForApi(dateRange.to);
    } else {
      from = formatDateForApi(dateRange.from);
      to = formatDateForApi(dateRange.to);
    }
    return { from, to };
  };

  const makePagedRequest = async resetPage => {
    if (
      selectedTable &&
      selectedTable.endpoint &&
      !loadCanceled &&
      (!selectedTable?.apiFilter ||
        ((selectedTable?.apiFilter?.displayDefaultData || userFilterSelection) &&
          tableMeta &&
          tableMeta['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE))
    ) {
      loadTimer = setTimeout(() => loadingTimeout(loadCanceled, setIsLoading), netLoadingDelay);
      const { from, to } = getDateFilters();
      const startPage = resetPage ? 1 : currentPage;
      pagedDatatableRequest(
        selectedTable,
        from,
        to,
        selectedPivot,
        startPage,
        itemsPerPage,
        tableColumnSortData,
        selectedTable?.apiFilter?.field,
        userFilterSelection,
        filteredDateRange
      )
        .then(res => {
          if (!loadCanceled) {
            setEmptyDataMessage(null);
            if (res.data.length < 1) {
              setIsLoading(false);
              clearTimeout(loadTimer);
              setEmptyDataMessage(
                <NotShownMessage
                  heading="Change selections in order to preview data"
                  bodyText="With the current Date Range selected we are unable to render a preview at this time."
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
            setTableData(res);
            setTable(res.data);
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
      setTable(data.slice(start, stop));
    }
  };

  const handleJump = page => {
    const pageNum = Math.max(1, page);
    setCurrentPage(Math.min(pageNum, maxPage));
  };

  const populateRows = currentColumns => {
    const tableRows = [];
    table.forEach((row, index) => {
      tableRows.push(<DtgTableRow columns={currentColumns} data={row} key={index} tableName={tableName} />);
    });
    setRows(tableRows);
  };

  const updateSmallFractionDataType = () => {
    //Overwrite type for special case number format handling
    if (selectedTable && selectedTable.apiId === 178) {
      selectedTable.fields[2].dataType = 'SMALL_FRACTION';
    }
  };

  const updateTable = resetPage => {
    setApiError(false);
    const ssp = tableProps.serverSidePagination;
    ssp !== undefined && ssp !== null ? getPagedData(resetPage) : getCurrentData();
    return () => {
      loadCanceled = true;
    };
  };

  useEffect(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE || !reactTable || !rawDataTable) {
      updateSmallFractionDataType();
      setCurrentPage(1);
      updateTable(true);
    }
  }, [tableSorting, dateRange, selectedTable, tableMeta]);

  useMemo(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      updateSmallFractionDataType();
      setCurrentPage(1);

      updateTable(true);
    }
  }, [filteredDateRange]);

  useMemo(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE || !reactTable || !rawDataTable) {
      //prevent hook from triggering twice on pivot selection
      if ((pivotSelected?.pivotValue && !tableProps.serverSidePagination) || !pivotSelected?.pivotValue) {
        updateTable(false);
      }
    }
  }, [tableProps.serverSidePagination, itemsPerPage, currentPage]);

  useEffect(() => {
    populateRows(columns);
  }, [table]);

  useMemo(() => {
    if (data && data.length) {
      setMaxRows(apiError ? 0 : data.length);
    }
  }, [data]);

  console.log('zaaaa: ', tableData.data);

  useEffect(() => {
    if (!tableProps.data) {
      setCurrentPage(1);
    }
    if (tableProps.chartTable === false) {
      updateTable(tableProps.data);
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
        setIsLoading(false);
      } else if (rawData !== null && rawData.hasOwnProperty('data')) {
        if (detailViewState && detailViewState?.secondary !== null && config?.detailView) {
          const detailViewFilteredData = rawData.data.filter(row => row[config?.detailView.secondaryField] === detailViewState?.secondary);
          setReactTableData({ data: detailViewFilteredData, meta: rawData.meta });
        } else {
          setReactTableData(rawData);
        }
        setManualPagination(false);
      }
    } else if (data && !rawDataTable) {
      setReactTableData({ data: data });
    } else if (userFilterSelection && tableMeta && tableMeta['total-count'] < REACT_TABLE_MAX_NON_PAGINATED_SIZE && dePaginated !== null) {
      // user filter tables <= 20000 rows
      setReactTableData(dePaginated);
      setManualPagination(false);
      setMaxRows(dePaginated.data.length);
      setIsLoading(false);
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
      tableData.data?.length > 0 &&
      selectedTable.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE &&
      !pivotSelected?.pivotValue &&
      !rawData?.pivotApplied
    ) {
      if (tableData?.meta['total-count'] <= REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
        // data with current date range < 20000
        if (!(reactTableData?.pivotApplied && !updatedData(tableData.data, reactTableData?.data.slice(0, itemsPerPage)))) {
          setReactTableData(dePaginated);
          setManualPagination(false);
          if (
            (!reactTableData ||
              JSON.stringify(tableData?.data) !== JSON.stringify(reactTableData?.data) ||
              tableData?.meta['total-count'] !== reactTableData?.meta['total-count']) &&
            dePaginated === undefined
          ) {
            setReactTableData(tableData);
            setManualPagination(false);
          }
        }
      } else if (tableData.data && !rawData && !dePaginated) {
        setReactTableData(tableData);
        setManualPagination(true);
      }
    } else if (data && !rawDataTable && !rawData) {
      setReactTableData({ data: data });
    } else if (tableData.data && data.length === 0 && !rawData) {
      setReactTableData(tableData);
    }
  }, [tableData]);

  useMemo(() => {
    if (
      tableData.data?.length > 0 &&
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
        }
      }
    }
  }, [rawData]);

  useMemo(() => {
    if (
      tableData.data?.length > 0 &&
      tableMeta &&
      selectedTable.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE &&
      !pivotSelected?.pivotValue &&
      !rawData?.pivotApplied
    ) {
      if (tableMeta['total-count'] <= REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
        // data with current date range < 20000
        if (!rawData && dePaginated && !userFilterSelection) {
          setReactTableData(dePaginated);
          setManualPagination(false);
        }
      }
    }
  }, [dePaginated]);

  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {!isLoading && reactTable && !reactTableData && !selectedTable?.apiFilter && (
        <LoadingIndicator loadingClass={loadingIcon} overlayClass={overlay} />
      )}
      {/* Data Dictionary and Dataset Detail tables */}
      {reactTable && reactTableData?.data && (
        <div className={overlayContainerNoFooter}>
          {/* API Error Message */}
          {(apiError || tableProps.apiError) && !emptyDataMessage && (
            <>
              <DtgTableApiError />
            </>
          )}
          <ErrorBoundary FallbackComponent={() => <></>}>
            <DataTable
              rawData={reactTableData}
              dateRange={tableProps.dateRange}
              detailViewState={detailViewState}
              setDetailViewState={setDetailViewState}
              nonRawDataColumns={!rawDataTable ? columnConfig : null}
              detailColumnConfig={detailColumnConfig}
              detailViewAPI={detailViewAPIConfig}
              detailView={config?.detailView}
              defaultSelectedColumns={config?.detailView?.selectColumns && detailViewState ? config.detailView.selectColumns : selectColumns}
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
              hideColumns={hideColumns}
              tableName={tableName}
              manualPagination={manualPagination}
              maxRows={maxRows}
              rowsShowing={rowsShowing}
              columnConfig={columnConfig}
              allowColumnWrap={allowColumnWrap}
              aria={tableProps.aria}
              pivotSelected={pivotSelected?.pivotValue}
              setSummaryValues={setSummaryValues}
              customFormatting={customFormatting}
              sorting={sorting}
              setSorting={setSorting}
              allActiveFilters={allActiveFilters}
              setAllActiveFilters={setAllActiveFilters}
              setTableSorting={setTableSorting}
              disableDateRangeFilter={disableDateRangeFilter}
              datasetName={datasetName}
              hasDownloadTimestamp={hasDownloadTimestamp}
              chartTable={chartTable}
              enableDownload={enableDownload}
            />
          </ErrorBoundary>
        </div>
      )}
      {/*Endpoints and Fields tables*/}
      {!reactTable && (
        <>
          <div data-testid="table-content" className={overlayContainerNoFooter}>
            {/* API Error Message */}
            {(apiError || tableProps.apiError) && !emptyDataMessage && <DtgTableApiError />}

            <div className={selectColumnsWrapper}>
              {/* Table Wrapper */}
              <div data-testid="table-wrapper" className={noBorder ? [wrapper, noBorderStyle].join(' ') : wrapper}>
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
            <div data-testid="table-footer" className={tableFooter}>
              <div data-testid="rows-showing" className={rowsShowingStyle}>
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
