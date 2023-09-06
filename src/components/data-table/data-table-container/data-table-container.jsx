import { DataTable } from '../data-table';
import React, { useEffect, useState } from 'react';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import DataTableColumnSelector from '../column-select/data-table-column-selector';
import DataTableFooter from '../data-table-footer/data-table-footer';

import {
  overlayContainerNoFooter,
  selectColumnPanelActive,
  selectColumnPanelInactive,
  selectColumnsWrapper,
} from './data-table-container.module.scss';

const DataTableContainer = ({
  rawData,
  defaultSelectedColumns,
  setTableColumnSortData,
  shouldPage,
  pagingProps,
  showPaginationControls,
  publishedReports,
  hasPublishedReports,
  columnVisibility,
  setColumnVisibility,
  defaultInvisibleColumns,
  selectColumns,
  setSelectColumnPanel,
  selectColumnPanel,
  resetFilters,
  setResetFilters,
}) => {
  // React table
  const [sorting, setSorting] = useState([]);
  const pageSize = 10;

  const allColumns = rawData?.meta
    ? Object.entries(rawData.meta.labels).map(([field, label]) => ({
        accessorKey: field,
        header: label,
      }))
    : [];
  const data = rawData.data;

  const [columns] = useState(() => [...allColumns]);

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

  useEffect(() => {
    if (resetFilters) {
      table.resetColumnFilters();
      table.resetSorting();
      setResetFilters(false);
    }
  }, [resetFilters]);

  return (
    <>
      <div data-test-id="table-content" className={overlayContainerNoFooter}>
        <div className={selectColumnsWrapper}>
          <DataTable
            setTableColumnSortData={setTableColumnSortData}
            hasPublishedReports={hasPublishedReports}
            publishedReports={publishedReports}
            hideCellLinks={true}
            columnVisibility={columnVisibility}
            allColumns={allColumns}
            table={table}
            sorting={sorting}
            resetFilters={resetFilters}
            dataTypes={rawData.meta.dataTypes}
          />
          <div className={selectColumnPanel ? selectColumnPanelActive : selectColumnPanelInactive} data-testid="selectColumnsMainContainer">
            {selectColumns && (
              <DataTableColumnSelector
                fields={allColumns}
                resetToDefault={() => setColumnVisibility(defaultInvisibleColumns)}
                setSelectColumnPanel={setSelectColumnPanel}
                defaultSelectedColumns={defaultSelectedColumns}
                defaultInvisibleColumns={defaultInvisibleColumns}
                table={table}
              />
            )}
          </div>
        </div>
      </div>
      {shouldPage && <DataTableFooter table={table} showPaginationControls={showPaginationControls} />}
    </>
  );
};

export default DataTableContainer;
