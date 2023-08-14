import React, {FunctionComponent, useEffect, useState} from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  SortingState,
} from '@tanstack/react-table';

import {Filter} from "./data-table-helper";

import StickyTable from "react-sticky-table-thead";

import * as styles from './data-table.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp, faSort} from "@fortawesome/free-solid-svg-icons";


type DataTableProps = {
  rawData: any;
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  defaultSelectedColumns: string[];
  pageSize: number;
  setTableColumnSortData: any,
}

const getTrProps = (rowInfo) => {
  if (rowInfo.id === 0 || rowInfo.id % 2 === 0) {
    return {
        background:'#f1f1f1',
        color: '#555555'
    }
  }
  else {
    return {
        background:'white',
        color: '#555555'
    }
  }
}

export const DataTable:FunctionComponent<DataTableProps> = ({ rawData, pageSize, defaultSelectedColumns, setTableColumnSortData }) => {

  const allColumns = rawData.meta ? Object.entries(rawData.meta.labels).map(([field, label]) => ({accessorKey: field, header: label} as ColumnDef<any, any>)) : [];
  const data = rawData.data;
  const [columns] = React.useState(() => [
    ...allColumns,
  ])

  const defaultInvisibleColumns = {};
  if (defaultSelectedColumns) {
    for (const column of allColumns) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!defaultSelectedColumns.includes(column.accessorKey)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultInvisibleColumns[column.accessorKey] = false;
      }
    }
  }

  const [columnVisibility, setColumnVisibility] = React.useState(defaultSelectedColumns ? defaultInvisibleColumns : {});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [defaultColumns, setDefaultColumns] = React.useState([]);
  const [additionalColumns, setAdditionalColumns] = React.useState([]);


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

  const getSortedColumnsData = (table) => {
    const columns = table.getVisibleFlatColumns();
    const mapped = columns.map(column =>
      ({
        id: column.id,
        sorted: column.getIsSorted(),
        filterValue: column.getFilterValue(),
        rowValues: table.getFilteredRowModel().flatRows.map(row => row.original[column.id]),
        allColumnsSelected: table.getIsAllColumnsVisible()
      })
    );
    setTableColumnSortData(mapped);
  }

  const constructDefaultColumnsFromTableData = () => {
    const constructedDefaultColumns = [];
    const constructedAdditionalColumns = [];
    for (const column of table.getAllLeafColumns()) {
      if (defaultSelectedColumns.includes(column.id)) {
        constructedDefaultColumns.push(column);
      }
      else if (!defaultSelectedColumns.includes(column.id)) {
        constructedAdditionalColumns.push(column);
      }
    }
    constructedAdditionalColumns.sort((a, b) => {
      return a.id.localeCompare(b.id);
    })
    setDefaultColumns(constructedDefaultColumns);
    setAdditionalColumns(constructedAdditionalColumns);
  }

  useEffect(() => {
    getSortedColumnsData(table);
  }, [sorting, columnVisibility, table.getFilteredRowModel()]);

  useEffect(() => {
    if (defaultSelectedColumns) {
      constructDefaultColumnsFromTableData();
    }
  }, []);


  return (
    // apply the table props
    <div className={styles.tableStyle}>
      <div className="inline-block border border-black shadow rounded">
        <button onClick={() => setColumnVisibility(defaultInvisibleColumns)} data-testid={'reset-button'}>
          Reset
        </button>
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Select All
          </label>
        </div>
        { defaultSelectedColumns ? (
          <div>
            <div>
              <span> Defaults </span>
              {defaultColumns.map(column => {
                return (
                  <div key={column.id} className="px-1">
                    <label>
                      <input
                        {...{
                          type: 'checkbox',
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />{' '}
                      {column.columnDef.header}
                    </label>
                  </div>
                )
              })}
              <span> ---------------------- </span>
            </div>
            <div>
              <span> Additional </span>
              {additionalColumns.map(column => {
                return (
                  <div key={column.id} className="px-1">
                    <label>
                      <input
                        {...{
                          type: 'checkbox',
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />{' '}
                      {column.columnDef.header}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            {table.getAllLeafColumns().map(column => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input
                      {...{
                        type: 'checkbox',
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{' '}
                    {column.columnDef.header}
                  </label>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div data-test-id="table-content" className={styles.tableContainer}>
       <StickyTable height={500} >
        <table>
          <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} data-testid={'header-row'}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        minWidth: header.getSize(),
                      },
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      :  (
                        <>
                          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? `${styles.colHeader}`
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                            data-testid={`header-sorter-${header.id}`}
                          >

                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <FontAwesomeIcon icon={faArrowUp} className={styles.sortArrow} />,
                              desc: <FontAwesomeIcon icon={faArrowDown} className={styles.sortArrow} />,
                              false: <FontAwesomeIcon icon={faSort} className={styles.sortArrow} />
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </>
                      )}
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `${styles.resizer} ${header.column.getIsResizing() ? styles.isResizing : ''}`,
                        }}
                    />
                  </th>
              )})}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={getTrProps(row)} data-testid={'row'}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {
                    cell.getValue() === 'null' ? (
                      <div />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )
                  }
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
     </StickyTable>
    </div>
    <div className="h-2" />
    <div className="flex items-center gap-2">
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </strong>
              </span>
      <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  data-testid={'pagination-text-input'}
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={e => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50, 100, 250, 500, 1000].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
    </div>
    );

}
