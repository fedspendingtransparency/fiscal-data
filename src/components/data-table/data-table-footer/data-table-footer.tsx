import { rowsShowing, tableFooter } from '../../dtg-table/dtg-table.module.scss';
import PaginationControls from '../../pagination/pagination-controls';
import React, { FunctionComponent, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { range } from '../data-table.module.scss';

interface IDataTableFooter {
  table: Table<any>;
  showPaginationControls: boolean;
  pagingProps;
  manualPagination: boolean;
  maxRows: number;
}

const DataTableFooter: FunctionComponent<IDataTableFooter> = ({ table, showPaginationControls, pagingProps, manualPagination, maxRows }) => {
  const [filteredRowLength, setFilteredRowLength] = React.useState(null);
  useEffect(() => {
    console.log(table.getFilteredRowModel());
    setFilteredRowLength(table.getFilteredRowModel().rows.length);
  }, [table.getFilteredRowModel(), pagingProps]);
  useEffect(() => {
    console.log(pagingProps);
  }, pagingProps);

  const visibleRows = table => {
    const rowsVisible = table?.getRowModel().flatRows.length;
    const pageSize = table.getState().pagination.pageSize;
    const pageIndex = table.getState().pagination.pageIndex;
    const minRow = pageIndex * pageSize + 1;
    const maxRow = pageIndex * pageSize + rowsVisible;
    return (
      <>
        Showing{' '}
        <span className={range}>
          {minRow} - {maxRow}
        </span>{' '}
        rows of {manualPagination ? pagingProps.maxRows : filteredRowLength} rows
      </>
    );
  };

  const handlePerPageChange = pageSize => {
    table.setPageSize(pageSize);
    pagingProps?.handlePerPageChange(pageSize);
  };

  // For serverside paginated data (unfiltered datasets > 20000 rows), use paging props
  const tablePagingProps = manualPagination
    ? pagingProps
    : {
        itemsPerPage: pagingProps?.itemsPerPage,
        handlePerPageChange: x => {
          handlePerPageChange(x);
        },
        handleJump: x => {
          table.setPageIndex(x - 1);
        },
        maxPage: table.getPageCount(),
        tableName: '',
        currentPage: table.getState().pagination.pageIndex + 1,
        maxRows: filteredRowLength,
      };

  return (
    <div data-test-id="table-footer" className={tableFooter}>
      <div data-test-id="rows-showing" className={rowsShowing}>
        {visibleRows(table)}
      </div>
      {showPaginationControls && <PaginationControls pagingProps={tablePagingProps} />}
    </div>
  );
};

export default DataTableFooter;
