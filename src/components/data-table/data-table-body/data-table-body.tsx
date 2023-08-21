import { getTdProps, getTrProps, rightAlign } from '../data-table-helper';
import { rightAlignText } from '../data-table.module.scss';
import { flexRender } from '@tanstack/react-table';
import React from 'react';


const DataTableBody = ({table, dataTypes}) => {

  return (
    <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id} style={getTrProps(row)} data-testid="row">
        {row.getVisibleCells().map((cell) => {
          return (
            <td
              key={cell.id}
              className={`${rightAlign(dataTypes[cell.column.id]) ? rightAlignText : null}`}
              style={getTdProps(row)}
            >
              {
                cell.getValue() === 'null' ? (
                  <div />
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )
              }
            </td>
          )})}
      </tr>
    ))}
    </tbody>
  )
}

export default DataTableBody;
