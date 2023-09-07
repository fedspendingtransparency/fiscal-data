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
import { tableContainer, tableStyle } from '../data-table.module.scss';
import DataTableHeader from '../data-table-header/data-table-header';
import DataTableBody from '../data-table-body/data-table-body';
import StickyTable from 'react-sticky-table-thead';

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
  setSelectColumnPanel,
  selectColumnPanel,
  resetFilters,
  setResetFilters,
  hideCellLinks,
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

  if (hasPublishedReports && !hideCellLinks) {
    // Must be able to modify allColumns, thus the ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allColumns[0].cell = ({ getValue }) => {
      if (
        publishedReports.find(report => {
          return report.report_date.toISOString().split('T')[0] === getValue();
        }) !== undefined
      ) {
        const path = publishedReports.find(report => {
          return report.report_date.toISOString().split('T')[0] === getValue();
        }).path;
        return <a href={path}>{getValue()}</a>;
      } else {
        return <span>{getValue()}</span>;
      }
    };
  }

  const getSortedColumnsData = table => {
    const columns = table.getVisibleFlatColumns();
    console.log(columns);
    const mapped = columns.map(column => ({
      id: column.id,
      sorted: column.getIsSorted(),
      filterValue: column.getFilterValue(),
      rowValues: table.getFilteredRowModel().flatRows.map(row => row.original[column.id]),
      allColumnsSelected: table.getIsAllColumnsVisible(),
    }));
    setTableColumnSortData(mapped);
  };

  useEffect(() => {
    getSortedColumnsData(table);
  }, [sorting, columnVisibility, table.getFilteredRowModel()]);

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
          <div className={tableStyle}>
            <div data-test-id="table-content" className={tableContainer}>
              <StickyTable height={521}>
                <table>
                  <DataTableHeader table={table} dataTypes={rawData.meta.dataTypes} resetFilters={resetFilters} />
                  <DataTableBody table={table} dataTypes={rawData.meta.dataTypes} />
                </table>
              </StickyTable>
            </div>
          </div>
          <div className={selectColumnPanel ? selectColumnPanelActive : selectColumnPanelInactive} data-testid="selectColumnsMainContainer">
            {defaultSelectedColumns && (
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
