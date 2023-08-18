import React, {FunctionComponent, useEffect} from 'react';

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

import {
  colHeader,
  resizer,
  sortArrow,
  tableContainer,
  tableStyle,
  defaultSortArrow,
  colHeaderText,
  defaultSortArrowPill,
  sortArrowPill,
  isResizing,
} from './data-table.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightArrowLeft, faArrowUpShortWide, faArrowDownShortWide} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import PaginationControls from '../pagination/pagination-controls';
import { rowsShowing, tableFooter } from '../dtg-table/dtg-table.module.scss';
import PagingOptionsMenu from '../pagination/paging-options-menu';
import PaginationButtons from './data-table-pagination-buttons';


type DataTableProps = {
  rawData: any;
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  defaultSelectedColumns: string[];
  pageSize: number;
  setTableColumnSortData: any,
  shouldPage: boolean,
  pagingProps: any,
  showPaginationControls: any,
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

export const DataTable:FunctionComponent<DataTableProps> = (
  {
    rawData,
    pageSize,
    defaultSelectedColumns,
    setTableColumnSortData,
    shouldPage,
    pagingProps,
    showPaginationControls,
  }) => {

  const allColumns = rawData.meta ?
    Object.entries(rawData.meta.labels).map(([field, label]) => ({accessorKey: field, header: label} as ColumnDef<any, any>)) : [];
  const data = rawData.data;
  const [columns] = React.useState(() => [
    ...allColumns,
  ])

  const defaultInvisibleColumns = {};
  // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
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
  const [filterRowLength, setFilteredRowLength] = React.useState(null);

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

  useEffect(() => {
    setFilteredRowLength(table.getSortedRowModel().rows.length);
  }, [table.getSortedRowModel()])

  const visibleRows = (table) => {
    const rows = table.getRowModel().flatRows;
    const minRow = Number(rows[0]?.id) + 1;
    const maxRow = Number(rows[rows.length - 1]?.id) + 1;
    return (
      <>
        {`Showing ${minRow} - ${maxRow} rows of ${filterRowLength} rows`}
      </>
    )
  }


  return (
    // apply the table props
    <div className={tableStyle}>
      {/*<div className="inline-block border border-black shadow rounded">*/}
      {/*  <button onClick={() => setColumnVisibility(defaultInvisibleColumns)} data-testid={'reset-button'}>*/}
      {/*    Reset*/}
      {/*  </button>*/}
      {/*  <div className="px-1 border-b border-black">*/}
      {/*    <label>*/}
      {/*      <input*/}
      {/*        {...{*/}
      {/*          type: 'checkbox',*/}
      {/*          checked: table.getIsAllColumnsVisible(),*/}
      {/*          onChange: table.getToggleAllColumnsVisibilityHandler(),*/}
      {/*        }}*/}
      {/*      />{' '}*/}
      {/*      Select All*/}
      {/*    </label>*/}
      {/*  </div>*/}
      {/*  { defaultSelectedColumns ? (*/}
      {/*    <div>*/}
      {/*      <div>*/}
      {/*        <span> Defaults </span>*/}
      {/*        {defaultColumns.map(column => {*/}
      {/*          return (*/}
      {/*            <div key={column.id} className="px-1">*/}
      {/*              <label>*/}
      {/*                <input*/}
      {/*                  {...{*/}
      {/*                    type: 'checkbox',*/}
      {/*                    checked: column.getIsVisible(),*/}
      {/*                    onChange: column.getToggleVisibilityHandler(),*/}
      {/*                  }}*/}
      {/*                />{' '}*/}
      {/*                {column.columnDef.header}*/}
      {/*              </label>*/}
      {/*            </div>*/}
      {/*          )*/}
      {/*        })}*/}
      {/*        <span> ---------------------- </span>*/}
      {/*      </div>*/}
      {/*      <div>*/}
      {/*        <span> Additional </span>*/}
      {/*        {additionalColumns.map(column => {*/}
      {/*          return (*/}
      {/*            <div key={column.id} className="px-1">*/}
      {/*              <label>*/}
      {/*                <input*/}
      {/*                  {...{*/}
      {/*                    type: 'checkbox',*/}
      {/*                    checked: column.getIsVisible(),*/}
      {/*                    onChange: column.getToggleVisibilityHandler(),*/}
      {/*                  }}*/}
      {/*                />{' '}*/}
      {/*                {column.columnDef.header}*/}
      {/*              </label>*/}
      {/*            </div>*/}
      {/*          )*/}
      {/*        })}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <div>*/}
      {/*      {table.getAllLeafColumns().map(column => {*/}
      {/*        return (*/}
      {/*          <div key={column.id} className="px-1">*/}
      {/*            <label>*/}
      {/*              <input*/}
      {/*                {...{*/}
      {/*                  type: 'checkbox',*/}
      {/*                  checked: column.getIsVisible(),*/}
      {/*                  onChange: column.getToggleVisibilityHandler(),*/}
      {/*                }}*/}
      {/*              />{' '}*/}
      {/*              {column.columnDef.header}*/}
      {/*            </label>*/}
      {/*          </div>*/}
      {/*        )*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
      <div data-test-id="table-content" className={tableContainer}>
       <StickyTable height={500} >
        <table>
          <thead>
          {table.getHeaderGroups().map((headerGroup) => {
            console.log(headerGroup.headers);
            return (
              <tr key={headerGroup.id} data-testid='header-row'>
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
                        : (
                          <>
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? `${colHeader}`
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                              data-testid={`header-sorter-${header.id}`}
                            >
                              <div className={colHeaderText}>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </div>
                              {{
                                asc:
                                  <div className={sortArrowPill}>
                                    <FontAwesomeIcon icon={faArrowUpShortWide as IconProp} className={sortArrow} />
                                  </div>,
                                desc:
                                  <div className={sortArrowPill}>
                                    <FontAwesomeIcon icon={faArrowDownShortWide as IconProp} className={sortArrow} />
                                  </div>,
                                false:
                                  <div className={defaultSortArrowPill}>
                                    <FontAwesomeIcon icon={faArrowRightArrowLeft as IconProp} className={defaultSortArrow} rotation={90} />
                                  </div>,
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
                          className: `${resizer} ${header.column.getIsResizing() ? isResizing : ''}`,
                        }}
                      />
                    </th>
                  );
                })}
              </tr>
            );
          })}
          </thead>
          <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={getTrProps(row)} data-testid="row">
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
      {shouldPage &&
        <div data-test-id="table-footer" className={tableFooter}>
          <div data-test-id="rows-showing" className={rowsShowing}>
            {visibleRows(table)}
            {/*{`Showing ${table.getRowModel().flatRows[0].id} - ${table.getRowModel().flatRows[0].id} of x rows`}*/}
            {/*{`Showing ${rowsShowing.begin} - ${rowsShowing.end} ${rowText[0]} of ${maxRows} ${rowText[1]}`}*/}
          </div>
          {showPaginationControls &&
            <PaginationControls
              pagingProps={{
                itemsPerPage: table.getState().pagination.pageSize,
                handlePerPageChange: table.setPageSize,
                handleJump: (x) => table.setPageIndex(x-1),
                maxPage: table.getPageCount(),
                tableName: '',
                currentPage: table.getState().pagination.pageIndex + 1,
                maxRows: filterRowLength,
                table: table,
              }}
            />
          }
        </div>
      }
    </div>
    );

}
