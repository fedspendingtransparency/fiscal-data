import React, { FunctionComponent } from 'react';
import { emptyTable } from './empty-table.module.scss';

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
  );
};

export default EmptyTable;
