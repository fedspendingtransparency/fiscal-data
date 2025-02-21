import React, { createContext, useEffect, useMemo, useState } from 'react';
import { REACT_TABLE_MAX_NON_PAGINATED_SIZE } from '../utils/api-utils';
import GLOBALS from '../helpers/constants';

export const DatasetDetailContext = createContext({});
const DEFAULT_ROWS_PER_PAGE = GLOBALS.dataTable.DEFAULT_ROWS_PER_PAGE;

const DatasetDetailProvider = ({ pageConfig, children }) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableProps, setTableProps] = useState();
  const [selectedPivot, setSelectedPivot] = useState();
  const [detailViewState, setDetailViewState] = useState();
  const [manualPagination, setManualPagination] = useState(false);
  const [perPage, setPerPage] = useState(null);
  const [selectColumnPanel, setSelectColumnPanel] = useState(false);
  const [allTablesSelected, setAllTablesSelected] = useState(false);
  const [tableColumnSortData, setTableColumnSortData] = useState([]);
  const [userFilterSelection, setUserFilterSelection] = useState(null);
  const [allActiveFilters, setAllActiveFilters] = useState([]);
  const [summaryValues, setSummaryValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetFilters, setResetFilters] = useState(false);
  const [reactTableSorting, setReactTableSort] = useState([]);
  const [tableMeta, setTableMeta] = useState(null);
  const [dateRange, setDateRange] = useState(); // TODO: remove this... using before hooking date picker to table
  const [reactTableData, setReactTableData] = useState(null);

  const { dePaginated, rawData, shouldPage } = tableProps || {};
  const data = tableProps?.data !== undefined && tableProps?.data !== null ? tableProps?.data : [];
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : !shouldPage && data.length > DEFAULT_ROWS_PER_PAGE ? data.length : DEFAULT_ROWS_PER_PAGE
  );

  const [tableData, setTableData] = useState(!shouldPage ? data : []);

  const activePivot = (data, pivot) => {
    return data?.pivotApplied?.includes(pivot?.pivotValue?.columnName) && data?.pivotApplied?.includes(pivot.pivotView?.title);
  };

  const updatedData = (newData, currentData) => {
    return JSON.stringify(newData) !== JSON.stringify(currentData);
  };

  /*
  actions: depaginated, rawData, tableData
   */

  useMemo(() => {
    if (tableProps && selectedTable?.rowCount <= REACT_TABLE_MAX_NON_PAGINATED_SIZE && !selectedPivot?.pivotValue) {
      if (dePaginated !== null && dePaginated !== undefined) {
        console.log('setting data here');
        // large dataset tables <= 20000 rows
        setReactTableData(dePaginated);
        setManualPagination(false);
        setIsLoading(false);
      } else if (rawData !== null && rawData.hasOwnProperty('data')) {
        if (detailViewState && detailViewState?.secondary !== null && pageConfig?.detailView) {
          const detailViewFilteredData = rawData.data.filter(row => row[pageConfig?.detailView.secondaryField] === detailViewState?.secondary);
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

  useMemo(() => {
    if (tableProps) {
      // Pivot data
      if (rawData !== null && rawData?.hasOwnProperty('data') && activePivot(rawData, selectedPivot)) {
        setReactTableData(rawData);
        if (setManualPagination) {
          setManualPagination(false);
        }
      }
    }
  }, [selectedPivot, rawData]);

  useMemo(() => {
    if (
      tableData.length > 0 &&
      tableMeta &&
      selectedTable.rowCount > REACT_TABLE_MAX_NON_PAGINATED_SIZE &&
      !selectedPivot?.pivotValue &&
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
    } else if (tableData && data.length === 0 && !rawData && tableMeta && tableMeta['total-count'] > REACT_TABLE_MAX_NON_PAGINATED_SIZE) {
      setReactTableData({ data: tableData, meta: tableMeta });
    }
  }, [tableData, tableMeta, rawData, dePaginated]);
  return (
    <DatasetDetailContext.Provider
      value={{
        selectedTable,
        setSelectedTable,
        tableProps,
        setTableProps,
        selectedPivot,
        setSelectedPivot,
        detailViewState,
        setDetailViewState,
        manualPagination,
        setManualPagination,
        perPage,
        setPerPage,
        selectColumnPanel,
        setSelectColumnPanel,
        allTablesSelected,
        setAllTablesSelected,
        tableColumnSortData,
        setTableColumnSortData,
        userFilterSelection,
        setUserFilterSelection,
        allActiveFilters,
        setAllActiveFilters,
        summaryValues,
        setSummaryValues,
        isLoading,
        setIsLoading,
        resetFilters,
        setResetFilters,
        reactTableSorting,
        setReactTableSort,
        tableMeta,
        setTableMeta,
        dateRange,
        setDateRange,
        pageConfig,
        reactTableData,
        setReactTableData,
        itemsPerPage,
        setItemsPerPage,
        tableData,
        setTableData,
      }}
    >
      {children}
    </DatasetDetailContext.Provider>
  );
};

export default DatasetDetailProvider;
