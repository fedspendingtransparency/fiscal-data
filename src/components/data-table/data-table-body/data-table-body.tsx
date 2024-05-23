import { rightAlign } from '../data-table-helper';
import { flexRender, Table } from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import { fillCellGrey, fillCellWhite, cellBorder, rightAlignText, wrap, noWrap } from './data-table-body.module.scss';
import classNames from 'classnames';

interface IDataTableBody {
  table: Table<Record<string, unknown>>;
  dataTypes: { [key: string]: string };
  allowColumnWrap: string[];
}

const DataTableBody: FunctionComponent<IDataTableBody> = ({ table, dataTypes, allowColumnWrap }) => {
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
              const wrapStyle = allowColumnWrap?.includes(cell.column.id);
              // console.log('wrapStyle: ', wrapStyle);
              if (cellValue === 'Treasury General Account (TGA) Opening Balance') {
                console.log('cell.column.getSize(): ', cell.column.getSize());
                console.log('cell.column.columnDef.size: ', cell.column.columnDef.size);
              }
              // console.log('display: ', flexRender(cell.column.columnDef.cell, cell.getContext()));
              return (
                <td
                  key={cell.id}
                  className={classNames([
                    `${rightAlign(dataTypes[cell.column.id]) ? rightAlignText : null}`,
                    fillCell ? cellBorder : null,
                    wrapStyle ? wrap : noWrap,
                  ])}
                  // 150 is a default value from React Table
                  style={{
                    verticalAlign: 'top',
                    // width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                    // whiteSpace: cell.column.getSize() !== 150 ? 'wrap' : 'nowrap',
                  }}
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
