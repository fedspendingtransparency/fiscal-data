import { rightAlign } from '../data-table-helper';
import { flexRender, Table } from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import { fillCellGrey, fillCellWhite, cellBorder, rightAlignText, wrap, noWrap } from './data-table-body.module.scss';
import classNames from 'classnames';

interface IDataTableBody {
  table: Table<Record<string, unknown>>;
  dataTypes: { [key: string]: string };
}

const DataTableBody: FunctionComponent<IDataTableBody> = ({ table, dataTypes }) => {
  let fillCell = false;

  return (
    <tbody>
      {table.getRowModel().rows.map(row => {
        fillCell = !fillCell;
        return (
          <tr key={row.id} className={fillCell ? fillCellGrey : fillCellWhite} data-testid="row">
            {row.getVisibleCells().map(cell => {
              const cellValue = cell.getValue();
              const display = !cellValue || cellValue === 'null';
              const wrapStyle = cell.column.id === 'definition';
              return (
                <td
                  key={cell.id}
                  className={classNames([
                    `${rightAlign(dataTypes[cell.column.id]) ? rightAlignText : null}`,
                    fillCell ? cellBorder : null,
                    wrapStyle ? wrap : noWrap,
                  ])}
                  style={{ verticalAlign: 'top' }}
                >
                  {display ? <div /> : flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default DataTableBody;
