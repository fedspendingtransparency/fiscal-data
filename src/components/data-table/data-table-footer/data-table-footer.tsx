import { rowsShowing, tableFooter } from '../../dtg-table/dtg-table.module.scss';
import PaginationControls from '../../pagination/pagination-controls';
import React, { FunctionComponent, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { range } from '../data-table.module.scss';
import { useSetRecoilState } from 'recoil';
import { reactTablePageState } from '../../../recoil/reactTableDataState';

interface IDataTableFooter {
  table: Table<any>;
  showPaginationControls: boolean;
  pagingProps;
}

const DataTableFooter: FunctionComponent<IDataTableFooter> = ({ table, showPaginationControls, pagingProps }) => {
  const [filteredRowLength, setFilteredRowLength] = React.useState(null);
  const setPageValue = useSetRecoilState(reactTablePageState);
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

  const handlePerPageChange = pageSize => {
    table.setPageSize(pageSize);
    pagingProps?.handlePerPageChange(pageSize);
  };

  const paging = {
    itemsPerPage: pagingProps?.itemsPerPage,
    handlePerPageChange: x => {
      handlePerPageChange(x);
    },
    handleJump: x => {
      table.setPageIndex(x - 1);
    },
    maxPage: pagingProps?.maxPage, //table.getPageCount(),
    tableName: '',
    currentPage: table.getState().pagination.pageIndex + 1,
    maxRows: filteredRowLength,
  };

  useEffect(() => {
    // console.log(pagingProps?.maxPage);
    // console.log(table.getState().pagination.pageIndex + 1);

    setPageValue(table.getState().pagination.pageIndex + 1);

    if (table.getState().pagination.pageIndex + 1 > 15700) {
      table.setPageIndex(1999);
    }
  }, [table.getState().pagination.pageIndex]);

  return (
    <div data-test-id="table-footer" className={tableFooter}>
      <div data-test-id="rows-showing" className={rowsShowing}>
        {visibleRows(table)}
      </div>
      {showPaginationControls && <PaginationControls pagingProps={paging} />}
      <button onClick={() => table.setPageIndex(1999)}> Click to go to row 2000</button>
    </div>
  );
};

export default DataTableFooter;
