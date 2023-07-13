import React, {FunctionComponent} from 'react';
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
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";

// TODO: Add unit tests and then delete comment below
/* istanbul ignore file */


type DataTableProps = {
  rawData: any;
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  defaultSelectedColumns: string[];
}

const getTrProps = (rowInfo) => {
  if (rowInfo.id === 0 || rowInfo.id % 2 === 0) {
    console.log(rowInfo);
    return {
        background:'lightgrey',
        color: 'black'
    }
  }
  else {
    return {
        background:'white',
        color: 'black'
    }
  }
}

export const DataTable:FunctionComponent<DataTableProps> = ({ rawData, defaultSelectedColumns }) => {

  const allColumns = rawData.meta ? Object.entries(rawData.meta.labels).map(([field, label]) => ({accessorKey: field, header: label} as ColumnDef<any, any>)) : [];
  const data = rawData.data;
  const [columns] = React.useState(() => [
    ...allColumns,
  ])
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    // apply the table props
    <div className={styles.tableStyle}>
      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Toggle All
          </label>
        </div>
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
      <div data-test-id="table-content" className={styles.tableContainer}>
       <StickyTable height={500} >
        <table>
          <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <FontAwesomeIcon icon={faArrowUp} className={styles.sortArrow} />,
                              desc: <FontAwesomeIcon icon={faArrowDown} className={styles.sortArrow} />,
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
            <tr key={row.id} style={getTrProps(row)}>
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
