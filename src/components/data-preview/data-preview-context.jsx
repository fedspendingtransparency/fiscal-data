import React, { createContext, useEffect, useState } from 'react';
import { columnsConstructorData } from '../data-table/data-table-helper';

export const DataTableContext = createContext({});

const DataTableProvider = ({ children, config, detailViewState }) => {
  const [tableProps, setTableProps] = useState();
  const [reactTableData, setReactTableData] = useState(null);
  const [configOption, setConfigOption] = useState(tableProps?.columnConfig);
  const [tableState, setTableState] = useState();
  const [additionalColumns, setAdditionalColumns] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [allColumns, setAllColumns] = useState();
  const [defaultSelectedColumns, setDefaultSelectedColumns] = useState();

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

    if (tableProps) {
      const defaultSelection = config?.detailView?.selectColumns && detailViewState ? config.detailView.selectColumns : tableProps.selectColumns;
      setDefaultSelectedColumns(defaultSelection);
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
