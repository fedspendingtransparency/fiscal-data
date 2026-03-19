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
import { columnsConstructorData, getSortedColumnsData } from '../data-table/data-table-helper';
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
import {
  smallTableDownloadDataCSV,
  smallTableDownloadDataJSON,
  smallTableDownloadDataXML,
  tableRowLengthState,
} from '../../recoil/smallTableDownloadData';
import { getDownloadData, getDownloadHeaders, setCsvDownload, setXmlDownload } from '../table-components/helpers/data-download-helper';

const defaultRowsPerPage = 10;
export default function DtgTable({
  tableProps,
  selectColumnPanel,
  setSelectColumnPanel,
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
  const [itemsPerPage, setItemsPerPage] = useState(defaultRowsPerPage);
  const [apiError, setApiError] = useState(tableProps.apiError || false);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(rawData?.data?.length > 0 ? rawData?.data.length : 1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
  const [emptyDataMessage, setEmptyDataMessage] = useState();
  const [showPaginationControls, setShowPaginationControls] = useState();
  const filteredDateRange = useRecoilValue(reactTableFilteredDateRangeState);
  const { detailView } = config;
  const detailViewAPIConfig = detailView ? config.apis.find(api => api.apiId === detailView.apiId) : null;
  const [allColumns, setAllColumns] = useState([]);

  const defaultInvisibleColumns = {};
  const defaultSelectedColumns = detailView?.selectColumns && detailViewState ? detailView.selectColumns : selectColumns;
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const setTableRowSizeData = useSetRecoilState(tableRowLengthState);
  const setSmallTableCSVData = useSetRecoilState(smallTableDownloadDataCSV);
  const setSmallTableJSONData = useSetRecoilState(smallTableDownloadDataJSON);
  const setSmallTableXMLData = useSetRecoilState(smallTableDownloadDataXML);

  const [columnVisibility, setColumnVisibility] = useState(
    defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotSelected ? defaultInvisibleColumns : {}
  );
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
    const pagedUserFilterRequest = selectedTable?.apiFilter?.displayDefaultData || userFilterSelection;
    if (selectedTable?.endpoint && !loadCanceled && (!selectedTable?.apiFilter || pagedUserFilterRequest) && shouldUsePaginatedResponse()) {
      loadTimer = setTimeout(() => loadingTimeout(loadCanceled, setIsLoading), netLoadingDelay);
      const { from, to } = getDateFilters(filteredDateRange, dateRange);
      const startPage = resetPage ? 1 : currentPage;
      console.log(table, reactTableData);
      let sortData;
      if (reactTableData?.meta && table && table?.getAllLeafColumns()?.length > 0) {
        console.log(table?.getFilteredRowModel());
        sortData = table && reactTableData?.data?.length > 0 ? getSortedColumnsData(table, hideColumns, reactTableData.meta.dataTypes) : [];
      } else {
        sortData = [];
      }
      pagedDatatableRequest(
        selectedTable,
        from,
        to,
        selectedPivot,
        startPage,
        itemsPerPage,
        sortData,
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
            if (noPivotApplied() && shouldUsePaginatedResponse()) {
              updateTableData(res, true);
            }
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

  const updateTable = resetPage => {
    setApiError(false);
    const ssp = tableProps.serverSidePagination;
    ssp !== undefined && ssp !== null && getPagedData(resetPage);
    return () => {
      loadCanceled = true;
    };
  };

  useMemo(() => {
    if (tableMeta?.table === selectedTable?.tableName && tableMeta?.meta?.['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      setCurrentPage(1);
      updateTable(true);
    }
  }, [sorting, tableMeta, filteredDateRange]);

  useMemo(() => {
    if (tableMeta?.table === selectedTable?.tableName && tableMeta?.meta?.['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
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
  const shouldUsePaginatedResponse = () => tableMeta && tableMeta?.meta?.['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE;

  const updateTableData = (data, serverPagination = false, detailViewConfig = false) => {
    setReactTableData(data);
    setManualPagination(serverPagination);
    const activeConfig = detailViewConfig ? detailColumnConfig : columnConfig;
    if (data?.data) {
      let hiddenCols = hideColumns;
      if (detailViewState) {
        setColumnVisibility(defaultInvisibleColumns);
        hiddenCols = detailViewAPIConfig.hideColumns;
      }
      const col = columnsConstructorData(data, hiddenCols, tableName, activeConfig, customFormatting);
      setAllColumns(col);
      // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
      if (defaultSelectedColumns?.length > 0) {
        for (const column of col) {
          if (!defaultSelectedColumns?.includes(column.accessorKey)) {
            defaultInvisibleColumns[column.accessorKey] = false;
          }
        }
        setColumnVisibility(defaultInvisibleColumns);
      }
      if (pivotSelected?.pivotValue) {
        setColumnVisibility({});
      }
    }
  };

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

  useMemo(() => {
    if (tableProps && rawData?.hasOwnProperty('data')) {
      if (detailViewState && detailView) {
        if (detailViewState?.secondary !== null) {
          // Nested table detail view with secondary filter --> ex. Buybacks
          const detailViewFilteredData = rawData.data.filter(row => row[detailView.secondaryField] === detailViewState?.secondary);
          updateTableData({ data: detailViewFilteredData, meta: rawData.meta }, false, true);
        } else {
          updateTableData(rawData, false, true);
        }
      } else {
        updateTableData(rawData);
      }
    } else {
      setReactTableData(null);
    }
  }, [rawData]);

  useEffect(() => {
    if (defaultSelectedColumns?.length > 0 && !pivotSelected?.pivotValue && defaultColumns.length === 0) {
      const { defaults, additional } = constructDefaultColumnsFromTableData(table, defaultSelectedColumns);
      setDefaultColumns(defaults);
      setAdditionalColumns(additional);
    } else if (pivotSelected?.pivotValue) {
      setDefaultColumns([]);
      setAdditionalColumns([]);
    }
  }, [table?.getAllLeafColumns()]);

  useEffect(() => {
    if (!!reactTableData?.meta?.dataTypes && table && table?.getAllLeafColumns()?.length > 0) {
      const { downloadHeaders, downloadHeaderKeys } = getDownloadHeaders(table.getHeaderGroups()[0].headers);
      const downloadData = getDownloadData(table.getSortedRowModel(), downloadHeaderKeys);
      setSmallTableJSONData(JSON.stringify({ data: downloadData }));
      setXmlDownload(downloadData, setSmallTableXMLData);
      setCsvDownload(downloadData, downloadHeaders, setSmallTableCSVData, hasDownloadTimestamp, datasetName, dateRange);
    }
  }, [columnVisibility, sorting]);

  // useEffect(() => {
  //   if (reactTableData?.meta && table && table?.getAllLeafColumns()?.length > 0) {
  //     setTableColumnSortData(getSortedColumnsData(table, hideColumns, reactTableData.meta.dataTypes));
  //   }
  // }, [sorting]);

  useEffect(() => {
    if (resetFilters && table) {
      table.resetColumnFilters();
      table.resetSorting();
      setResetFilters(false);
      setAllActiveFilters([]);
    }
  }, [resetFilters]);

  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {!isLoading && !reactTableData && !selectedTable?.apiFilter && <LoadingIndicator loadingClass={loadingIcon} overlayClass={overlay} />}
      {/* Data Dictionary and Dataset Detail tables */}
      {reactTableData?.data && (
        <div data-testid="table-content">
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
                          detailViewConfig={config?.detailView}
                          setDetailViewState={setDetailViewState}
                          setSummaryValues={setSummaryValues}
                        />
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <DataTableFooter
                table={table}
                showPaginationControls={showPaginationControls}
                pagingProps={pagingProps}
                manualPagination={manualPagination}
                rowsShowing={rowsShowing}
                setTableDownload={setTableRowSizeData}
              />
            </>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
