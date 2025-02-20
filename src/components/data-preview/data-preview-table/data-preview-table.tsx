import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../recoil/reactTableFilteredState';
import { loadingTimeout, netLoadingDelay, setColumns } from '../../dtg-table/dtg-table-helper';
import { formatDateForApi, pagedDatatableRequest, REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../../../utils/api-utils';
import moment from 'moment';
import NotShownMessage from '../../dataset-data/table-section-container/not-shown-message/not-shown-message';
import { defaultPerPageOptions } from '../../pagination/pagination-controls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import DtgTableApiError from '../../dtg-table/dtg-table-api-error/dtg-table-api-error';
import { ErrorBoundary } from 'react-error-boundary';
import { overlayContainer, overlay, loadingIcon, overlayContainerNoFooter } from './data-preview-table.module.scss';
import GLOBALS from '../../../helpers/constants';
import DataPreviewDataTable from '../data-preview-data-table/data-preview-data-table';
import { DatasetDetailContext } from '../../../contexts/dataset-detail-context';

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
  tableMeta;
  pivotSelected;
  allowColumnWrap;
  disableDateRangeFilter;
};

const DataPreviewTable: FunctionComponent<DataPreviewTableProps> = ({
  allowColumnWrap,
  disableDateRangeFilter,
  hasDownloadTimestamp,
  datesetName,
}) => {
  const {
    selectedTable,
    selectedPivot: pivotSelected,
    tableProps,
    detailViewState,
    userFilterSelection,
    isLoading,
    setIsLoading,
    tableMeta,
    setPerPage,
    tableColumnSortData,
    itemsPerPage,
    setItemsPerPage,
    tableData,
    setTableData,
    reactTableData,
  } = useContext(DatasetDetailContext);

  const {
    tableName,
    shouldPage,
    excludeCols,
    selectedPivot,
    dateRange,
    config,
    columnConfig,
    detailColumnConfig,
    selectColumns,
    hideColumns,
    hasPublishedReports,
    publishedReports,
    customFormatting,
  } = tableProps;

  const data = tableProps.data !== undefined && tableProps.data !== null ? tableProps.data : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [apiError, setApiError] = useState(tableProps.apiError || false);
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
        filteredDateRange?.from && moment(dateRange.from).diff(filteredDateRange?.from) <= 0
          ? filteredDateRange?.from.format('YYYY-MM-DD')
          : formatDateForApi(dateRange.from);
      const to =
        filteredDateRange?.from && moment(dateRange.to).diff(filteredDateRange?.to) >= 0
          ? filteredDateRange?.to.format('YYYY-MM-DD')
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

  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {!isLoading && !reactTableData && !selectedTable?.apiFilter && (
        <>
          <div data-test-id="loading-overlay" className={overlay} />
          <div className={loadingIcon}>
            <FontAwesomeIcon data-test-id="loading-icon" icon={faSpinner} spin pulse /> Loading...
          </div>
        </>
      )}
      {/* Data Dictionary and Dataset Detail tables */}
      {reactTableData?.data && (
        <div data-test-id="table-content" className={overlayContainerNoFooter}>
          {/* API Error Message */}
          {(apiError || tableProps.apiError) && !emptyDataMessage && (
            <>
              <DtgTableApiError />
            </>
          )}
          {!emptyDataMessage && (
            <ErrorBoundary FallbackComponent={() => <></>}>
              <DataPreviewDataTable
                detailColumnConfig={detailColumnConfig}
                detailViewAPI={detailViewAPIConfig}
                detailView={config?.detailView}
                defaultSelectedColumns={config?.detailView?.selectColumns && detailViewState ? config.detailView.selectColumns : selectColumns}
                hideCellLinks={true}
                shouldPage={shouldPage}
                pagingProps={pagingProps}
                showPaginationControls={showPaginationControls}
                hasPublishedReports={hasPublishedReports}
                publishedReports={publishedReports}
                hideColumns={hideColumns}
                tableName={tableName}
                maxRows={maxRows}
                rowsShowing={rowsShowing}
                columnConfig={columnConfig}
                allowColumnWrap={allowColumnWrap}
                customFormatting={customFormatting}
                setTableSorting={setTableSorting}
                disableDateRangeFilter={disableDateRangeFilter}
                datasetName={datesetName}
                hasDownloadTimestamp={hasDownloadTimestamp}
              />
            </ErrorBoundary>
          )}
        </div>
      )}
    </div>
  );
};

export default DataPreviewTable;
