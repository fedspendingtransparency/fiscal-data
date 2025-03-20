import React, { createContext, useState } from 'react';

export const DataTableContext = createContext({});

const DataTableProvider = ({ children, config, detailViewState, pivotSelected }) => {
  const [tableProps, setTableProps] = useState();

  return (
    <DataTableContext.Provider
      value={{
        tableProps,
        setTableProps,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
};

export default DataTableProvider;
