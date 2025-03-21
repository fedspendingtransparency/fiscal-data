import { rowsShowing, tableFooter, tableFooterChart } from '../../dtg-table/dtg-table.module.scss';
import PaginationControls from '../../pagination/pagination-controls';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { range } from '../data-table.module.scss';
import { DataTableContext } from '../../data-preview/data-preview-context';

interface IDataTableFooter {
  table: Table<Record<string, unknown>>;
  showPaginationControls: boolean;
  pagingProps;
  manualPagination: boolean;
  rowsShowing: { begin: number; end: number };
  setTableDownload?: (rowCount: number) => void;
  chartTable?: boolean;
}

const DataTableFooter: FunctionComponent<IDataTableFooter> = ({
  table,
  showPaginationControls,
  // pagingProps,
  manualPagination,
  rowsShowing: rowRange,
  setTableDownload,
  chartTable,
}) => {
  const [filteredRowLength, setFilteredRowLength] = React.useState(null);
  const { pagingProps: idk, itemsPerPage, maxPage, currentPage, maxRows } = useContext(DataTableContext);
  const pagingProps = {
    itemsPerPage,
    handlePerPageChange: idk?.handlePerPageChange,
    handleJump: idk?.handleJump,
    maxPage,
    tableName: idk?.tableName,
    currentPage,
    maxRows,
  };
  const visibleRows = table => {
    let minRow;
    let maxRow;
    let totalRows;
    if (manualPagination) {
      minRow = rowRange.begin;
      maxRow = rowRange.end;
      totalRows = pagingProps.maxRows;
    } else if (table) {
      console.log('table', table.getState());
      const rowsVisible = table?.getRowModel().flatRows.length;
      const pageSize = table.getState().pagination.pageSize;
      const pageIndex = table.getState().pagination.pageIndex;
      minRow = pageIndex * pageSize + 1;
      maxRow = pageIndex * pageSize + rowsVisible;
      totalRows = filteredRowLength;
    }
    const rowText = totalRows === 1 ? '' : 'rows';
    const totalRowText = totalRows === 1 ? 'row' : 'rows';
    const rangeText = totalRows === 0 ? '0' : `${minRow} - ${maxRow}`;

    return (
      <>
        Showing <span className={range}>{rangeText}</span> {rowText} of {totalRows} {totalRowText}
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

  useEffect(() => {
    if (table) {
      setFilteredRowLength(table.getFilteredRowModel().rows.length);
    }
    if (setTableDownload) {
      setTableDownload(manualPagination ? null : table.getFilteredRowModel().rows.length);
    }
  }, [table?.getFilteredRowModel(), pagingProps]);

  return (
    <div data-test-id="table-footer" className={`${chartTable} ? ${tableFooter} : ${tableFooterChart} ${tableFooter}`}>
      <div data-test-id="rows-showing" className={rowsShowing}>
        {visibleRows(table)}
      </div>
      {showPaginationControls && <PaginationControls pagingProps={tablePagingProps} />}
    </div>
  );
};

export default DataTableFooter;
