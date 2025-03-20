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

  //dependent on table props
  const [itemsPerPage, setItemsPerPage] = useState();
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });

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
    console.log(tableProps);
    if (tableProps?.data) {
      console.log('setting props', tableProps.data, perPage, tableProps.shouldPage);
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
    }
  }, [tableProps]);

  // const table = useReactTable({
  //   columns: allColumns,
  //   data: reactTableData.data,
  //   columnResizeMode: 'onChange',
  //   initialState: {
  //     pagination: {
  //       pageIndex: 0,
  //       pageSize: pagingProps.itemsPerPage,
  //     },
  //   },
  //   state: {
  //     columnVisibility,
  //     sorting,
  //   },
  //   onSortingChange: setSorting,
  //   onColumnVisibilityChange: setColumnVisibility,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   manualPagination: manualPagination,
  // });
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
        // table,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};

export default DataTableProvider;
