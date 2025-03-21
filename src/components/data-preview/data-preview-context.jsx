import React, { createContext, useEffect, useState } from 'react';
import { columnsConstructorData } from '../data-table/data-table-helper';
import GLOBALS from '../../helpers/constants';

const DEFAULT_ROWS_PER_PAGE = GLOBALS.dataTable.DEFAULT_ROWS_PER_PAGE;

export const DataTableContext = createContext({});

const DataTableProvider = ({ children, config, detailViewState, pivotSelected }) => {
  const [tableProps, setTableProps] = useState();
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const [reactTableData, setReactTableData] = useState(null);
  const [configOption, setConfigOption] = useState(tableProps?.columnConfig);
  const [allColumns, setAllColumns] = useState();
  const [perPage, setPerPage] = useState(null);
  const [data, setData] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [manualPagination, setManualPagination] = useState(false);
  const [reactTableSorting, setReactTableSort] = useState([]);
  const [tableState, setTableState] = useState();
  const [defaultSelectedColumns, setDefaultSelectedColumns] = useState();

  //dependent on table props
  const [itemsPerPage, setItemsPerPage] = useState();
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });

  // const defaultSelectedColumns = config?.detailView?.selectColumns && detailViewState ? config.detailView.selectColumns : tableProps?.selectColumns;

  const [columnVisibility, setColumnVisibility] = useState();

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

  const handleJump = page => {
    const pageNum = Math.max(1, page);
    setCurrentPage(Math.min(pageNum, maxPage));
  };

  const pagingProps = {
    itemsPerPage,
    handlePerPageChange,
    handleJump,
    maxPage,
    tableName: tableProps?.tableName,
    currentPage,
    maxRows,
  };

  React.useMemo(() => {
    const { hideColumns, tableName, customFormatting } = tableProps ?? {};
    // const hideCols = detailViewState ? detailViewAPI.hideColumns : hideColumns;
    if (reactTableData) {
      const hideCols = hideColumns;
      const baseColumns = columnsConstructorData(reactTableData, hideCols, tableName, configOption, customFormatting);
      setAllColumns(baseColumns);
    }
  }, [reactTableData, configOption, tableProps]);

  useEffect(() => {
    setConfigOption(tableProps?.columnConfig);
    if (tableProps?.data) {
      setData(tableProps.data);
    }
    if (tableProps) {
      setMaxRows(tableProps?.data?.length > 0 ? tableProps?.data.length : 1);

      setItemsPerPage(
        perPage
          ? perPage
          : !tableProps?.shouldPage && tableProps?.data?.length > DEFAULT_ROWS_PER_PAGE
          ? tableProps?.data?.length
          : DEFAULT_ROWS_PER_PAGE
      );
      const defaultSelection = config?.detailView?.selectColumns && detailViewState ? config.detailView.selectColumns : tableProps.selectColumns;
      setDefaultSelectedColumns(defaultSelection);
      const defaultInvisibleColumns = {};
      // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
      if (defaultSelection && allColumns) {
        for (const column of allColumns) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (defaultSelection && !defaultSelection?.includes(column.accessorKey)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            defaultInvisibleColumns[column.accessorKey] = false;
          }
        }
      }

      setColumnVisibility(defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotSelected ? defaultInvisibleColumns : {});
    }
  }, [tableProps]);

  return (
    <DataTableContext.Provider
      value={{
        tableProps,
        setTableProps,
        defaultColumns,
        setDefaultColumns,
        additionalColumns,
        setAdditionalColumns,
        reactTableData,
        setReactTableData,
        allColumns,
        configOption,
        setConfigOption,
        perPage,
        setPerPage,
        pagingProps,
        currentPage,
        setCurrentPage,
        maxRows,
        setMaxRows,
        maxPage,
        setMaxPage,
        itemsPerPage,
        setItemsPerPage,
        rowsShowing,
        setRowsShowing,
        data,
        manualPagination,
        setManualPagination,
        reactTableSorting,
        setReactTableSort,
        columnVisibility,
        setColumnVisibility,
        tableState,
        setTableState,
        defaultSelectedColumns,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};

export default DataTableProvider;
