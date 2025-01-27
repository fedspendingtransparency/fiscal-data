import React, { FunctionComponent } from 'react';
import { emptyTable } from './empty-table.module.scss';
import DataTableFooter from '../../../data-table/data-table-footer/data-table-footer';

const EmptyTable: FunctionComponent = ({ rowCount = 10 }) => {
  const rows = [];
  const row = (
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );

  for (let i = 0; i < rowCount; i++) {
    rows.push(row);
  }

  return (
    <>
      <table className={emptyTable}>
        <tbody>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          {rows.map(emptyRow => {
            return emptyRow;
          })}
        </tbody>
      </table>
      <DataTableFooter rowsShowing={{ begin: 0, end: 0 }} manualPagination={true} pagingProps={{ maxRows: 0 }} />
    </>
  );
};

export default EmptyTable;
