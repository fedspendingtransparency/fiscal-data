import {
  rowsShowing,
  tableFooter,
} from '../../dtg-table/dtg-table.module.scss';
import PaginationControls from '../../pagination/pagination-controls';
import React, { FunctionComponent, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { range } from '../data-table.module.scss';

interface IDataTableFooter {
  table: Table<any>;
  showPaginationControls: boolean;
}

const DataTableFooter: FunctionComponent<IDataTableFooter> = ({
  table,
  showPaginationControls,
}) => {
  const [filteredRowLength, setFilteredRowLength] = React.useState(null);

  useEffect(() => {
    setFilteredRowLength(table.getSortedRowModel().rows.length);
  }, [table.getSortedRowModel()]);

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
        rows of {filteredRowLength} rows
      </>
    );
  };

  return (
    <div data-test-id="table-footer" className={tableFooter}>
      <div data-test-id="rows-showing" className={rowsShowing}>
        {visibleRows(table)}
      </div>
      {showPaginationControls && (
        <PaginationControls
          pagingProps={{
            itemsPerPage: table.getState().pagination.pageSize,
            handlePerPageChange: table.setPageSize,
            handleJump: x => table.setPageIndex(x - 1),
            maxPage: table.getPageCount(),
            tableName: '',
            currentPage: table.getState().pagination.pageIndex + 1,
            maxRows: filteredRowLength,
            table: table,
          }}
        />
      )}
    </div>
  );
};

export default DataTableFooter;
