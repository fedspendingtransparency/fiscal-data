import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DtgTableRow from './dtg-table-row/dtg-table-row';
import { setColumns } from './dtg-table-helper';
import { defaultPerPageOptions } from '../pagination/pagination-controls';
import { overlayContainer, overlayContainerNoFooter } from './dtg-table.module.scss';
import { ErrorBoundary } from 'react-error-boundary';
import DtgTableApiError from './dtg-table-api-error/dtg-table-api-error';
import BasicTable from '../data-table/test/basic-table';

const defaultRowsPerPage = 10;
export default function BasicDtgTable({
  tableProps,
  perPage,
  setPerPage,
  resetFilters,
  setResetFilters,
  allowColumnWrap,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  enableDownload,
}) {
  const { tableName, shouldPage, excludeCols, columnConfig, selectColumns, hideColumns, customFormatting, chartTable } = tableProps;

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
  const [showPaginationControls, setShowPaginationControls] = useState();
  const [tableSorting, setTableSorting] = useState([]);

  let loadCanceled = false;

  let debounce;

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

  const updateTable = resetPage => {
    setApiError(false);
    const ssp = tableProps.serverSidePagination;
    ssp !== undefined && ssp !== null ? getPagedData(resetPage) : getCurrentData();
    return () => {
      loadCanceled = true;
    };
  };

  useEffect(() => {
    populateRows(columns);
  }, [table]);

  useMemo(() => {
    if (data && data.length) {
      setMaxRows(apiError ? 0 : data.length);
    }
  }, [data]);

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
    if (data) {
      setReactTableData({ data: data });
    }
  }, [tableProps.data]);

  return (
    <div className={overlayContainer}>
      {/* Loading Indicator */}
      {/*{!isLoading && !reactTableData && !selectedTable?.apiFilter && <LoadingIndicator loadingClass={loadingIcon} overlayClass={overlay} />}*/}
      {/* Data Dictionary and Dataset Detail tables */}
      {reactTableData?.data && (
        <div className={overlayContainerNoFooter}>
          {/* API Error Message */}
          {(apiError || tableProps.apiError) && <DtgTableApiError />}
          <ErrorBoundary FallbackComponent={() => <></>}>
            <BasicTable
              rawData={reactTableData}
              dateRange={tableProps.dateRange}
              nonRawDataColumns={columnConfig}
              defaultSelectedColumns={selectColumns}
              hideCellLinks={true}
              shouldPage={shouldPage}
              pagingProps={pagingProps}
              showPaginationControls={showPaginationControls}
              resetFilters={resetFilters}
              setResetFilters={setResetFilters}
              hideColumns={hideColumns}
              tableName={tableName}
              maxRows={maxRows}
              rowsShowing={rowsShowing}
              columnConfig={columnConfig}
              allowColumnWrap={allowColumnWrap}
              aria={tableProps.aria}
              customFormatting={customFormatting}
              sorting={sorting}
              setSorting={setSorting}
              allActiveFilters={allActiveFilters}
              setAllActiveFilters={setAllActiveFilters}
              setTableSorting={setTableSorting}
              chartTable={chartTable}
              enableDownload={enableDownload}
            />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

BasicDtgTable.propTypes = {
  tableProps: PropTypes.shape({}),
};

BasicDtgTable.defaultProps = {
  tableProps: {
    columnConfig: {
      property: '',
      name: '',
      type: '',
    },
  },
};
