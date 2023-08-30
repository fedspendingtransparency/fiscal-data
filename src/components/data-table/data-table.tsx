import React, {FunctionComponent, useState, useEffect} from 'react';
import {
  ColumnDef,
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
} from './data-table.module.scss';
import DataTableHeader from './data-table-header/data-table-header';
import DataTableFooter from './data-table-footer/data-table-footer';
import DataTableBody from './data-table-body/data-table-body';
import ColumnSelect from './column-select/column-select';


type DataTableProps = {
  rawData: any;
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  defaultSelectedColumns: string[];
  setTableColumnSortData: any,
  hasPublishedReports: boolean,
  publishedReports: any[],
  hideCellLinks: boolean,
  shouldPage: boolean,
  showPaginationControls: boolean,
  columnVisibility: any,
  setColumnVisibility: () => void,
  defaultInvisibleColumns: any,
  allColumns: any,
  table: any,
  sorting: any,
}


export const DataTable:FunctionComponent<DataTableProps> = (
  {
    rawData,
    defaultSelectedColumns,
    setTableColumnSortData,
    shouldPage,
    showPaginationControls,
    publishedReports,
    hasPublishedReports,
    hideCellLinks,
    columnVisibility,
    setColumnVisibility,
    defaultInvisibleColumns,
    allColumns,
    table,
    sorting
  }) => {

  // const allColumns = rawData.meta ?
  //   Object.entries(rawData.meta.labels).map(([field, label]) => ({accessorKey: field, header: label} as ColumnDef<any, any>)) : [];
  // const data = rawData.data;

  // POC code to include links in cells and match links to the correct cells based on record date
  if (hasPublishedReports && !hideCellLinks) {
    // Must be able to modify allColumns, thus the ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allColumns[0].cell = ({getValue}) => {
      console.log(publishedReports.find((report) => { return report.report_date.toISOString().split('T')[0] === getValue()}));
      if (publishedReports.find((report) => { return report.report_date.toISOString().split('T')[0] === getValue()}) !== undefined) {
        const path = publishedReports.find((report) => { return report.report_date.toISOString().split('T')[0] === getValue()}).path;
        return (
          <a href={path}>{getValue()}</a>
        )
      }
      else {
        return (
          <span>{getValue()}</span>
        )
      }
    }
  }
  // const [columns] = useState(() => [
  //   ...allColumns,
  // ])

  const dataTypes = rawData.meta.dataTypes;



  // const table = useReactTable({
  //   columns,
  //   data,
  //   columnResizeMode: 'onChange',
  //   initialState: {
  //     pagination: {
  //       pageIndex: 0,
  //       pageSize: pageSize,
  //     },
  //   },
  //   state: {
  //    columnVisibility,
  //    sorting,
  //   },
  //   onSortingChange: setSorting,
  //   onColumnVisibilityChange: setColumnVisibility,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  // });

  const getSortedColumnsData = (table) => {
    const columns = table?.getVisibleFlatColumns();
    const mapped = columns.map(column =>
      ({
        id: column.id,
        sorted: column.getIsSorted(),
        filterValue: column.getFilterValue(),
        rowValues: table?.getFilteredRowModel().flatRows.map(row => row.original[column.id]),
        allColumnsSelected: table?.getIsAllColumnsVisible()
      })
    );
    setTableColumnSortData(mapped);
  }

  useEffect(() => {
    getSortedColumnsData(table);
  }, [sorting, columnVisibility, table?.getFilteredRowModel()]);


  return (
    // apply the table props
    <div className={tableStyle}>
      <ColumnSelect defaultSelectedColumns={defaultSelectedColumns}
                    defaultInvisibleColumns={defaultInvisibleColumns}
                    table={table}
                    setColumnVisibility={setColumnVisibility}
                    allColumns={allColumns}
      />
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
