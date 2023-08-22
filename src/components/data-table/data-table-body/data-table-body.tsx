import { rightAlign } from '../data-table-helper';
import { rightAlignText } from '../data-table.module.scss';
import { flexRender } from '@tanstack/react-table';
import React from 'react';
import {
  fillCellGrey,
  fillCellWhite,
  cellBorder,
} from './data-table-body.module.scss';
import classNames from 'classnames';



const DataTableBody = ({table, dataTypes}) => {
  let fillCell = false;

  return (
    <tbody>
    {table.getRowModel().rows.map((row) => {
      fillCell = !fillCell;
      return (
      <tr key={row.id} className={fillCell ? fillCellGrey : fillCellWhite} data-testid="row">
        {row.getVisibleCells().map((cell) => {
          return (
            <td
              key={cell.id}
              className={classNames([
                `${rightAlign(dataTypes[cell.column.id]) ? rightAlignText : null}`,
                fillCell ? cellBorder : null
              ])}
            >
              {
                cell.getValue() === "null" ? (
                  <div />
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )
              }
            </td>
          )})}
      </tr>
    )})}
    </tbody>
  )
}

export default DataTableBody;
