import { rightAlign } from '../data-table-helper';
import { flexRender, Table } from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import {
  fillCellGrey,
  fillCellWhite,
  cellBorder,
  rightAlignText,
} from './data-table-body.module.scss';
import classNames from 'classnames';

interface IDataTableBody {
  rowModel: any;
  dataTypes: { [key: string]: string };
}

const DataTableBody: FunctionComponent<IDataTableBody> = ({
  rowModel,
  dataTypes,
}) => {
  let fillCell = false;

  return (
    <tbody>
      {rowModel.flatRows.map(row => {
        fillCell = !fillCell;
        return (
          <tr
            key={row.id}
            className={fillCell ? fillCellGrey : fillCellWhite}
            data-testid="row"
          >
            {row.getVisibleCells().map(cell => {
              return (
                <td
                  key={cell.id}
                  className={classNames([
                    `${
                      rightAlign(dataTypes[cell.column.id])
                        ? rightAlignText
                        : null
                    }`,
                    fillCell ? cellBorder : null,
                  ])}
                >
                  {cell.getValue() === 'null' ? (
                    <div />
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
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
