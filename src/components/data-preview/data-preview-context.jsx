import React, { createContext, useState } from 'react';
import { columnsConstructorData } from '../data-table/data-table-helper';

export const DataTableContext = createContext({});

const DataTableProvider = ({ children, config, detailViewState }) => {
  const [tableProps, setTableProps] = useState(null);
  const [reactTableData, setReactTableData] = useState(null);
  const [configOption, setConfigOption] = useState();
  const [tableState, setTableState] = useState();
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [allColumns, setAllColumns] = useState();
  const [defaultSelectedColumns, setDefaultSelectedColumns] = useState();
  const [appliedFilters, setAppliedFilters] = useState([]);

  React.useMemo(() => {
    const { hideColumns, tableName, customFormatting } = tableProps ?? {};
    const colConfig = detailViewState ? tableProps?.detailColumnConfig : tableProps?.columnConfig;
    if (reactTableData) {
      const detailViewAPI = config?.detailView ? config.apis.find(api => api.apiId === config.detailView.apiId) : null;
      const hideCols = detailViewState ? detailViewAPI.hideColumns : hideColumns;
      const baseColumns = columnsConstructorData(reactTableData, hideCols, tableName, colConfig, customFormatting);
      setAllColumns(baseColumns);
    }
    if (tableProps) {
      const colConfig = detailViewState ? tableProps?.detailColumnConfig : tableProps?.columnConfig;
      setConfigOption(colConfig);
      const defaultSelection = config?.detailView?.selectColumns && detailViewState ? config.detailView.selectColumns : tableProps.selectColumns;
      setDefaultSelectedColumns(defaultSelection);
    }
  }, [tableProps, reactTableData]);

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
        tableState,
        setTableState,
        defaultSelectedColumns,
        appliedFilters,
        setAppliedFilters,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};

export default DataTableProvider;
