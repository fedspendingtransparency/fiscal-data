import React, { useEffect, useMemo, useState } from 'react';
import DtgTableHeading from '../../dtg-table/dtg-table-heading/dtg-table-heading';
import DtgTableRow from '../../dtg-table/dtg-table-row/dtg-table-row';
import { setColumns } from '../../dtg-table/dtg-table-helper';
import PaginationControls, { defaultPerPageOptions } from '../../pagination/pagination-controls';
import { noBorderStyle, overlayContainer, rowsShowingStyle, tableFooter, wrapper } from '../../dtg-table/dtg-table.module.scss';

const defaultRowsPerPage = 10;
export default function Table({ tableProps, perPage }) {
  const { width, noBorder, tableName, shouldPage, columnConfig, caption, excludeCols, hideColumns } = tableProps;

  const data = tableProps.data !== undefined && tableProps.data !== null ? tableProps.data : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : !shouldPage && data.length > defaultRowsPerPage ? data.length : defaultRowsPerPage
  );
  const [table, setTable] = useState(!shouldPage ? data : []);
  const [maxPage, setMaxPage] = useState(1);
  const [maxRows, setMaxRows] = useState(data.length > 0 ? data.length : 1);
  const [rowsShowing, setRowsShowing] = useState({ begin: 1, end: 1 });
  const [rows, setRows] = useState([]);
  const [showPaginationControls, setShowPaginationControls] = useState();

  const rowText = ['rows', 'rows'];

  const tableWidth = width ? (isNaN(width) ? width : `${width}px`) : 'auto';

  const getAllExcludedCols = () => {
    const allCols = [];

    if (excludeCols !== undefined) {
      allCols.push(...excludeCols);
    }
    if (hideColumns) {
      allCols.push(...hideColumns);
    }
    return allCols;
  };

  const isPaginationControlNeeded = () => currentPage >= 1 || maxRows > defaultPerPageOptions[0];

  const rowData = Array.isArray(table) ? table : table?.data || [];

  const dataProperties = {
    keys: rowData[0] ? Object.keys(rowData[0]) : [],
    excluded: getAllExcludedCols(),
  };

  const columns = setColumns(dataProperties, columnConfig);

  const handlePerPageChange = numRows => {
    const numItems = numRows >= maxRows ? maxRows : numRows;
    setItemsPerPage(numItems);
    setRowsShowing({
      begin: 1,
      end: numItems,
    });
    setCurrentPage(1);
  };

  const getCurrentData = () => {
    const start = currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage;
    const rowsToShow = start + itemsPerPage;
    const stop = rowsToShow > data.length ? data.length : rowsToShow;
    setRowsShowing({ begin: start + 1, end: stop });
    setMaxPage(Math.ceil(data.length / itemsPerPage));
    setTable(data.slice(start, stop));
  };

  const handleJump = page => {
    const pageNum = Math.max(1, page);
    setCurrentPage(Math.min(pageNum, maxPage));
  };

  const populateRows = currentColumns => {
    const tableRows = [];
    table.forEach((row, index) => {
      tableRows.push(<DtgTableRow columns={currentColumns} data={row} key={index} tableName={tableName} />);
    });
    setRows(tableRows);
  };

  const updateTable = () => {
    getCurrentData();
  };

  useEffect(() => {
    populateRows(columns);
  }, [table]);

  useMemo(() => {
    if (data && data.length) {
      setMaxRows(data.length);
    }
  }, [data]);

  useEffect(() => {
    if (!tableProps.data) {
      setCurrentPage(1);
    }
    if (!tableProps.chartTable) {
      updateTable(tableProps.data);
    }
  }, [tableProps.data]);

  useMemo(() => {
    updateTable(false);
  }, [itemsPerPage, currentPage]);

  useEffect(() => {
    setShowPaginationControls(isPaginationControlNeeded());
  }, [maxRows]);

  if (maxRows === 1) {
    rowText[0] = '';
    rowText[1] = 'row';
  }
  const pagingProps = {
    itemsPerPage,
    handlePerPageChange,
    handleJump,
    maxPage,
    tableName,
    currentPage,
    maxRows,
  };

  return (
    <div className={overlayContainer}>
      {/* Table Wrapper */}
      <div data-testid="table-wrapper" className={noBorder ? [wrapper, noBorderStyle].join(' ') : wrapper}>
        {/* Table */}
        <table {...tableProps.aria} style={{ width: tableWidth }}>
          {caption !== undefined && <caption className="sr-only">{caption}</caption>}
          <DtgTableHeading columns={columns} />
          <tbody>{rows}</tbody>
        </table>
      </div>
      {/* Table Footer */}
      {shouldPage && (
        <div data-testid="table-footer" className={tableFooter}>
          <div data-testid="rows-showing" className={rowsShowingStyle}>
            {`Showing ${rowsShowing.begin} - ${rowsShowing.end} ${rowText[0]} of ${maxRows} ${rowText[1]}`}
          </div>
          {showPaginationControls && <PaginationControls pagingProps={pagingProps} />}
        </div>
      )}
    </div>
  );
}
