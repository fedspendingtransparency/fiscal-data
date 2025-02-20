import React, { createContext, useEffect, useState } from 'react';

export const DatasetDetailContext = createContext({});

const DatasetDetailProvider = ({ children }) => {
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

  useEffect(() => {
    console.log('selected table update');
  }, [selectedTable]);

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
      }}
    >
      {children}
    </DatasetDetailContext.Provider>
  );
};

export default DatasetDetailProvider;
