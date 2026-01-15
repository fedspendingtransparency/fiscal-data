import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../recoil/reactTableFilteredState';
import { loadingTimeout, netLoadingDelay } from '../../dtg-table/dtg-table-helper';
import { formatDateForApi, pagedDatatableRequest, REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../../utils/api-utils';
import { format, differenceInMilliseconds } from 'date-fns';
import NotShownMessage from '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import { defaultPerPageOptions } from '../../pagination/pagination-controls';
import DtgTableApiError from '../../dtg-table/dtg-table-api-error/dtg-table-api-error';
import { ErrorBoundary } from 'react-error-boundary';
import { loadingIcon, overlay, overlayContainer, overlayContainerNoFooter } from './data-preview-table.module.scss';
import GLOBALS from '../../../helpers/constants';
import DataPreviewDataTable from '../data-preview-data-table/data-preview-data-table';
import { DataTableContext } from '../data-preview-context';
import LoadingIndicator from '../../loading-indicator/loading-indicator';

const DEFAULT_ROWS_PER_PAGE = GLOBALS.dataTable.DEFAULT_ROWS_PER_PAGE;

interface ITableProps {
  dePaginated;
  rawData;
  data;
  width;
  tableName;
  shouldPage;
  excludeCols;
  selectedTable;
  selectedPivot;
  dateRange;
  config;
  columnConfig;
  detailColumnConfig;
  selectColumns;
  hideColumns;
  hasPublishedReports;
  publishedReports;
  customFormatting;
  apiError;
  aria;
  serverSidePagination;
}

type DataPreviewTableProps = {
  tableProps: ITableProps;
  perPage;
  setPerPage;
  selectColumnPanel;
  setSelectColumnPanel;
  setTableColumnSortData;
  resetFilters;
  setResetFilters;
  tableMeta;
  tableColumnSortData;
  manualPagination;
  setManualPagination;
  pivotSelected;
  allowColumnWrap;
  setDetailViewState;
  detailViewState;
  setSummaryValues;
  setIsLoading;
  isLoading;
  sorting;
  setSorting;
  allActiveFilters;
  setAllActiveFilters;
  userFilterSelection;
  disableDateRangeFilter;
};

const DataPreviewTable: FunctionComponent<DataPreviewTableProps> = ({
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
  hasDownloadTimestamp,
  datesetName,
  apiErrorState,
  perPage,
  setPerPage,
}) => {
  const { tableProps, reactTableData, setReactTableData, allColumns } = useContext(DataTableContext);

  const {
    dePaginated,
    rawData,
    width,
    tableName,
    shouldPage,
    excludeCols,
    selectedTable,
    selectedPivot,
    dateRange,
    config,
    selectColumns,
    hideColumns,
    hasPublishedReports,
    publishedReports,
    customFormatting,
  } = tableProps;

  const data = tableProps.data !== undefined && tableProps.data !== null ? tableProps.data : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : !shouldPage && data.length > DEFAULT_ROWS_PER_PAGE ? data.length : DEFAULT_ROWS_PER_PAGE
  );
  const [tableData, setTableData] = useState(!shouldPage ? data : []);
  const [apiError, setApiError] = useState(tableProps.apiError || apiErrorState || false);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(data.length > 0 ? data.length : 1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
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

  // const dataProperties = {
  //   keys: tableData[0] ? Object.keys(tableData[0]) : [],
  //   excluded: getAllExcludedCols(),
  // };
  // const columns = setColumns(dataProperties, columnConfig);

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
      const from =
        filteredDateRange?.from && differenceInMilliseconds(new Date(dateRange.from), new Date(filteredDateRange?.from)) <= 0
          ? format(new Date(filteredDateRange?.from), 'yyyy-MM-dd')
          : formatDateForApi(dateRange.from);
      const to =
        filteredDateRange?.from && differenceInMilliseconds(new Date(dateRange.to), new Date(filteredDateRange?.to)) >= 0
          ? format(new Date(filteredDateRange?.to), 'yyyy-MM-dd')
          : formatDateForApi(dateRange.to);
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
        userFilterSelection
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

  const isPaginationControlNeeded = () => currentPage >= 1 || (!apiError && !tableProps.apiError && maxRows > defaultPerPageOptions[0]);

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

  useMemo(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      updateSmallFractionDataType();
      setCurrentPage(1);
      updateTable(true);
    }
  }, [tableSorting, filteredDateRange, selectedTable, dateRange, tableMeta]);

  useMemo(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      //prevent hook from triggering twice on pivot selection
      if ((pivotSelected?.pivotValue && !tableProps.serverSidePagination) || !pivotSelected?.pivotValue) {
        updateTable(false);
      }
    }
  }, [tableProps.serverSidePagination, itemsPerPage, currentPage]);

  useMemo(() => {
    if (data && data?.length) {
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
    } else if (userFilterSelection && tableMeta && tableMeta['total-count'] < REACT_TABLE_MAX_NON_PAGINATED_SIZE && dePaginated !== null) {
      // user filter tables <= 20000 rows
      setReactTableData(dePaginated);
      setManualPagination(false);
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
        } else if (dePaginated && !userFilterSelection) {
          setReactTableData(dePaginated);
          setManualPagination(false);
        }
      } else {
        if (!(reactTableData?.pivotApplied && !updatedData(tableData, reactTableData?.data.slice(0, itemsPerPage)))) {
          setReactTableData({ data: tableData, meta: tableMeta });
          setManualPagination(true);
        }
      }
    } else if (tableData && data?.length === 0 && !rawData && tableMeta && tableMeta['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      setReactTableData({ data: tableData, meta: tableMeta });
    }
  }, [tableData, tableMeta, rawData, dePaginated]);

  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {!isLoading && !reactTableData && !selectedTable?.apiFilter && !(apiError || tableProps.apiError) && (
        <LoadingIndicator loadingClass={loadingIcon} overlayClass={overlay} />
      )}
      {/* Data Dictionary and Dataset Detail tables */}
      <div data-test-id="table-content" className={overlayContainerNoFooter}>
        {/* API Error Message */}
        {(apiError || tableProps.apiError) && !emptyDataMessage && (
          <>
            <DtgTableApiError />
          </>
        )}
        {!apiErrorState && reactTableData?.data && allColumns && (
          <ErrorBoundary FallbackComponent={() => <></>}>
            <DataPreviewDataTable
              detailViewState={detailViewState}
              setDetailViewState={setDetailViewState}
              detailViewAPI={detailViewAPIConfig}
              detailView={config?.detailView}
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
              manualPagination={manualPagination}
              rowsShowing={rowsShowing}
              allowColumnWrap={allowColumnWrap}
              aria={tableProps.aria}
              pivotSelected={pivotSelected?.pivotValue}
              setSummaryValues={setSummaryValues}
              sorting={sorting}
              setSorting={setSorting}
              allActiveFilters={allActiveFilters}
              setAllActiveFilters={setAllActiveFilters}
              setTableSorting={setTableSorting}
              disableDateRangeFilter={disableDateRangeFilter}
              datasetName={datesetName}
              dateRange={tableProps.dateRange}
              hasDownloadTimestamp={hasDownloadTimestamp}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default DataPreviewTable;
