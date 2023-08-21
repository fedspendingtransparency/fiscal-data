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


import StickyTable from "react-sticky-table-thead";

import {
  tableContainer,
  tableStyle,
  rightAlignText,
} from './data-table.module.scss';
import PaginationControls from '../pagination/pagination-controls';
import { rowsShowing, tableFooter } from '../dtg-table/dtg-table.module.scss';
import PagingOptionsMenu from '../pagination/paging-options-menu';
import PaginationButtons from './data-table-pagination-buttons';
import DataTableHeader from './data-table-header/data-table-header';
import { getTdProps, getTrProps, rightAlign } from './data-table-helper';
import DataTableFooter from './data-table-footer/data-table-footer';
import DataTableBody from './data-table-body/data-table-body';


type DataTableProps = {
  rawData: any;
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  defaultSelectedColumns: string[];
  pageSize: number;
  setTableColumnSortData: any,
  shouldPage: boolean,
  showPaginationControls: any,
}



export const DataTable:FunctionComponent<DataTableProps> = (
  {
    rawData,
    pageSize,
    defaultSelectedColumns,
    setTableColumnSortData,
    shouldPage,
    showPaginationControls,
  }) => {

  const allColumns = rawData.meta ?
    Object.entries(rawData.meta.labels).map(([field, label]) => ({accessorKey: field, header: label} as ColumnDef<any, any>)) : [];
  const data = rawData.data;
  const [columns] = React.useState(() => [
    ...allColumns,
  ])

  const dataTypes = rawData.meta.dataTypes;

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
    <div className={tableStyle}>
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
      <div data-test-id="table-content" className={tableContainer}>
        <StickyTable height={521} >
          <table>
            <DataTableHeader table={table} dataTypes={dataTypes} />
            <DataTableBody table={table} dataTypes={dataTypes} />
          </table>
        </StickyTable>
      </div>
      <DataTableFooter
        shouldPage={shouldPage}
        table={table}
        showPaginationControls={showPaginationControls}
      />
    </div>
    );

}
