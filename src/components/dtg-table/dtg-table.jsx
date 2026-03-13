import React, { useEffect, useMemo, useState } from 'react';
import { loadingTimeout, netLoadingDelay } from './dtg-table-helper';
import { defaultPerPageOptions } from '../pagination/pagination-controls';
import { pagedDatatableRequest, REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../utils/api-utils';
import NotShownMessage from '../dataset-data/table-section-container/not-shown-message/not-shown-message';
import { loadingIcon, overlay, overlayContainer, overlayContainerNoFooter } from './dtg-table.module.scss';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../recoil/reactTableFilteredState';
import { ErrorBoundary } from 'react-error-boundary';
import DtgTableApiError from './dtg-table-api-error/dtg-table-api-error';
import LoadingIndicator from '../loading-indicator/loading-indicator';
import { constructDefaultColumnsFromTableData, getDateFilters, getPaginationValues } from './helper';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { columnsConstructorData } from '../data-table/data-table-helper';
import DataTableBody from '../data-table/data-table-body/data-table-body';
import {
  rawDataTableContainer,
  selectColumnPanelActive,
  selectColumnPanelInactive,
  selectColumnsWrapper,
  tableStyle,
} from '../data-table/data-table.module.scss';
import DataTableColumnSelector from '../data-table/column-select/data-table-column-selector';
import DataTableHeader from '../data-table/data-table-header/data-table-header';
import DataTableFooter from '../data-table/data-table-footer/data-table-footer';
import { tableRowLengthState } from '../../recoil/smallTableDownloadData';

const defaultRowsPerPage = 10;
export default function DtgTable({
  tableProps,
  selectColumnPanel,
  setSelectColumnPanel,
  tableColumnSortData,
  setTableColumnSortData,
  detailViewState,
  setDetailViewState,
  setSummaryValues,
  pivotSelected,
  resetFilters,
  setResetFilters,
  tableMeta,
  manualPagination,
  setManualPagination,
  datasetName,
  userFilterSelection,
  setIsLoading,
  isLoading,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  disableDateRangeFilter,
  hasDownloadTimestamp,
}) {
  const {
    rawData,
    tableName,
    shouldPage,
    selectedTable,
    selectedPivot,
    dateRange,
    config,
    detailColumnConfig,
    selectColumns,
    hideColumns,
    columnConfig,
    customFormatting,
  } = tableProps;

  const [reactTableData, setReactTableData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    !shouldPage && rawData?.data?.length > defaultRowsPerPage ? rawData?.data?.length : defaultRowsPerPage
  );
  const [tableData, setTableData] = useState([]);
  const [apiError, setApiError] = useState(tableProps.apiError || false);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(rawData?.data?.length > 0 ? rawData?.data.length : 1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
  const [emptyDataMessage, setEmptyDataMessage] = useState();
  const [showPaginationControls, setShowPaginationControls] = useState();
  const filteredDateRange = useRecoilValue(reactTableFilteredDateRangeState);
  const { detailView } = config;
  const detailViewAPIConfig = detailView ? config.apis.find(api => api.apiId === detailView.apiId) : null;
  const [tableSorting, setTableSorting] = useState([]);
  const [configOption, setConfigOption] = useState(columnConfig);
  const [allColumns, setAllColumns] = useState([]);

  const defaultInvisibleColumns = {};
  const defaultSelectedColumns = detailView?.selectColumns && detailViewState ? detailView.selectColumns : selectColumns;
  const [columnVisibility, setColumnVisibility] = useState(
    defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotSelected ? defaultInvisibleColumns : {}
  );
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const setTableRowSizeData = useSetRecoilState(tableRowLengthState);

  let loadCanceled = false;
  let debounce;
  let loadTimer;

  const rowText = ['rows', 'rows'];

  const isPaginationControlNeeded = () => currentPage >= 1 || (!apiError && !tableProps.apiError && maxRows > defaultPerPageOptions[0]);

  const handlePerPageChange = numRows => {
    const numItems = numRows >= maxRows ? maxRows : numRows;
    setItemsPerPage(numItems);
    setRowsShowing({
      begin: 1,
      end: numItems,
    });
    setCurrentPage(1);
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
      selectedTable?.endpoint &&
      !loadCanceled &&
      (!selectedTable?.apiFilter || selectedTable?.apiFilter?.displayDefaultData || userFilterSelection) &&
      tableMeta &&
      tableMeta['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE
    ) {
      loadTimer = setTimeout(() => loadingTimeout(loadCanceled, setIsLoading), netLoadingDelay);
      const { from, to } = getDateFilters(filteredDateRange, dateRange);
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
            const paginationValues = getPaginationValues(res, startPage, itemsPerPage);
            setRowsShowing(paginationValues.rowsShowing);
            setMaxPage(paginationValues.maxPage);
            if (maxRows !== paginationValues.maxRows) setMaxRows(paginationValues.maxRows);
            setTableData(res);
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

  const handleJump = page => {
    const pageNum = Math.max(1, page);
    setCurrentPage(Math.min(pageNum, maxPage));
  };

  //TODO: move to metadataTransform ?
  const updateSmallFractionDataType = () => {
    //Overwrite type for special case number format handling
    if (selectedTable && selectedTable.apiId === 178) {
      selectedTable.fields[2].dataType = 'SMALL_FRACTION';
    }
  };

  const updateTable = resetPage => {
    setApiError(false);
    const ssp = tableProps.serverSidePagination;
    ssp !== undefined && ssp !== null && getPagedData(resetPage);
    return () => {
      loadCanceled = true;
    };
  };

  useEffect(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      updateSmallFractionDataType();
      setCurrentPage(1);
      updateTable(true);
    }
  }, [tableSorting, dateRange, selectedTable, tableMeta, filteredDateRange]);

  useMemo(() => {
    if (selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      //prevent hook from triggering twice on pivot selection
      if ((pivotSelected?.pivotValue && !tableProps.serverSidePagination) || !pivotSelected?.pivotValue) {
        updateTable(false);
      }
    }
  }, [tableProps.serverSidePagination, itemsPerPage, currentPage]);

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

  const noPivotApplied = () => !pivotSelected?.pivotValue && !rawData?.pivotApplied;
  const isLargeTable = () => selectedTable?.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE;
  const isDepaginatedSize = () => tableMeta && tableMeta['total-count'] <= REACT_TABLE_MAX_NON_PAGINATED_SIZE;

  const updateTableData = (data, serverPagination = false, detailViewConfig = false) => {
    setReactTableData(data);
    setManualPagination(serverPagination);
    const activeConfig = detailViewConfig ? detailColumnConfig : columnConfig;
    setConfigOption(activeConfig);
    console.log('??', configOption, data);
    if (data?.data) {
      let hiddenCols = hideColumns;
      if (detailViewState) {
        setColumnVisibility(defaultInvisibleColumns);
        hiddenCols = detailView.hideColumns;
      }
      const col = columnsConstructorData(data, hiddenCols, tableName, activeConfig, customFormatting);
      console.log('allColumns', col);
      setAllColumns(col);
    }
  };

  useMemo(() => {
    if (tableProps && rawData?.hasOwnProperty('data')) {
      if (detailViewState && detailViewState?.secondary !== null && detailView) {
        // Nested table detail view with secondary filter --> ex. Buybacks
        const detailViewFilteredData = rawData.data.filter(row => row[detailView.secondaryField] === detailViewState?.secondary);
        updateTableData({ data: detailViewFilteredData, meta: rawData.meta }, false, true);
      } else {
        console.log('rawData:', rawData);
        updateTableData(rawData);
      }
    }
  }, [pivotSelected, rawData]);

  useMemo(() => {
    // Serverside paginated data (results > 20000)
    const shouldUseTableData = tableData.data?.length > 0 && !rawData;
    if (shouldUseTableData && isLargeTable() && noPivotApplied() && !isDepaginatedSize()) {
      console.log('tableData:', tableData);
      updateTableData(tableData, true);
    }
  }, [tableData]);

  const table = useReactTable({
    columns: allColumns,
    data: reactTableData?.data,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pagingProps.itemsPerPage,
      },
    },
    state: {
      columnVisibility,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: manualPagination,
  });

  useEffect(() => {
    if (!!defaultSelectedColumns && !pivotSelected?.pivotValue) {
      const { defaults, additional } = constructDefaultColumnsFromTableData(table, defaultSelectedColumns);
      console.log('default and additional columns:', defaults, additional);
      setDefaultColumns(defaults);
      setAdditionalColumns(additional);
    }
  }, [table?.getAllLeafColumns()]);

  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {!isLoading && !reactTableData && !selectedTable?.apiFilter && <LoadingIndicator loadingClass={loadingIcon} overlayClass={overlay} />}
      {/* Data Dictionary and Dataset Detail tables */}
      {reactTableData?.data && (
        <div className={overlayContainerNoFooter}>
          {/* API Error Message */}
          {(apiError || tableProps.apiError) && !emptyDataMessage && (
            <>
              <DtgTableApiError />
            </>
          )}
          <ErrorBoundary FallbackComponent={() => <></>}>
            <>
              <div data-testid="table-content" className={overlayContainerNoFooter}>
                <div className={selectColumnsWrapper}>
                  {defaultSelectedColumns && (
                    <div className={selectColumnPanel ? selectColumnPanelActive : selectColumnPanelInactive} data-testid="selectColumnsMainContainer">
                      <DataTableColumnSelector
                        selectColumnPanel={selectColumnPanel}
                        fields={allColumns}
                        resetToDefault={() => setColumnVisibility(defaultSelectedColumns?.length > 0 ? defaultInvisibleColumns : {})}
                        setSelectColumnPanel={setSelectColumnPanel}
                        defaultSelectedColumns={defaultSelectedColumns}
                        table={table}
                        additionalColumns={additionalColumns}
                        defaultColumns={defaultColumns}
                      />
                    </div>
                  )}
                  <div className={tableStyle}>
                    <div data-test-id="table-content" className={rawDataTableContainer}>
                      <table {...tableProps.aria}>
                        <DataTableHeader
                          table={table}
                          dataTypes={reactTableData.meta.dataTypes}
                          resetFilters={resetFilters}
                          manualPagination={manualPagination}
                          allActiveFilters={allActiveFilters}
                          setAllActiveFilters={setAllActiveFilters}
                          disableDateRangeFilter={disableDateRangeFilter}
                        />
                        <DataTableBody
                          table={table}
                          dataTypes={reactTableData.meta.dataTypes}
                          // detailViewConfig={detailView}
                          setDetailViewState={setDetailViewState}
                          setSummaryValues={setSummaryValues}
                        />
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {shouldPage && (
                <DataTableFooter
                  table={table}
                  showPaginationControls={showPaginationControls}
                  pagingProps={pagingProps}
                  manualPagination={manualPagination}
                  rowsShowing={rowsShowing}
                  setTableDownload={setTableRowSizeData}
                />
              )}
            </>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
