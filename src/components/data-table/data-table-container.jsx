import { DataTable } from './data-table';
import React, { useState } from 'react';
import {
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';


const DataTableContainer = (
  {
    rawData,
    defaultSelectedColumns,
    setTableColumnSortData,
    shouldPage,
    showPaginationControls,
    publishedReports,
    hasPublishedReports,
    columnVisibility,
    setColumnVisibility,
    defaultInvisibleColumns,
    pagingProps
  }) => {

  const [sorting, setSorting] = useState([]);
  const pageSize = 10;

  const allColumns = rawData?.meta ?
    Object.entries(rawData.meta.labels).map(([field, label]) => ({accessorKey: field, header: label})) : [];
  const data = rawData.data;

  const [columns] = useState(() => [
    ...allColumns,
  ])



  const table = useReactTable({
    columns,
    data,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
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
  });


  return (
    <>
      <DataTable
        rawData={rawData}
        defaultSelectedColumns={defaultSelectedColumns}
        setTableColumnSortData={setTableColumnSortData}
        hasPublishedReports={hasPublishedReports}
        publishedReports={publishedReports}
        hideCellLinks={true}
        shouldPage={shouldPage}
        pagingProps={pagingProps}
        showPaginationControls={showPaginationControls}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        defaultInvisibleColumns={defaultInvisibleColumns}
        allColumns={allColumns}
        table={table}
        sorting={sorting}
      />
    </>
  )
}

export default DataTableContainer;
