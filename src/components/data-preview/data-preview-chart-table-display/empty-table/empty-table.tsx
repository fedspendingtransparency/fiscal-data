import React, { FunctionComponent } from 'react';
import { emptyTable } from './empty-table.module.scss';
import TableFooter from '../../../table-components/table-footer/table-footer';

const EmptyTable: FunctionComponent = ({ rowCount = 10, mobileDisplay }) => {
  const columnCount = mobileDisplay ? 2 : 6;

  return (
    <>
      <table className={emptyTable}>
        <tbody>
          <tr>
            {Array.from({ length: columnCount }, (_, index) => (
              <th key={`header-${index}`} />
            ))}
          </tr>
          {Array.from({ length: rowCount }, (_, index) => (
            <tr key={`row-${index}`}>
              {Array.from({ length: columnCount }, (_, index) => (
                <td key={`cell-${index}`} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter
        rowsShowing={{ begin: 0, end: 0 }}
        manualPagination={true}
        pagingProps={{ maxRows: 0, itemsPerPage: rowCount, disablePerPage: true, showWhenEmpty: true, currentPage: 1, maxPage: 1 }}
        showPaginationControls={true}
      />
    </>
  );
};

export default EmptyTable;
