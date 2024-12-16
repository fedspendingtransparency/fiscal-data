import React, { FunctionComponent, ReactNode } from 'react';
import { IDataTableBody } from '../../../../models/IDataTableBody';
import { cellBorder, cellText, detailButton, fillCellGrey, fillCellWhite, hidden, rightAlignText } from './data-preview-data-table-body.module.scss';
import classNames from 'classnames';
import { rightAlign } from '../../../data-table/data-table-helper';
import { flexRender } from '@tanstack/react-table';

const DataPreviewDataTableBody: FunctionComponent<IDataTableBody> = ({
  table,
  dataTypes,
  allowColumnWrap,
  detailViewConfig,
  setDetailViewState,
  setSummaryValues,
}) => {
  let fillCell = false;
  const handleDetailClick = (rowConfig: {}, cellValue: string) => {
    const currentRow = rowConfig[0]?.row.original;
    const secondaryFilterValue = detailViewConfig?.secondaryField ? currentRow[detailViewConfig.secondaryField] : null;
    setDetailViewState({ value: cellValue, secondary: secondaryFilterValue });
    setSummaryValues(currentRow);
  };

  return (
    <tbody>
      {table.getRowModel().rows.map(row => {
        fillCell = !fillCell;
        const rowConfig = row.getVisibleCells();
        return (
          <tr key={row.id} data-testid="row">
            {rowConfig.map(cell => {
              const cellValue = cell.getValue()?.toString();
              const display = !cellValue || cellValue === 'null';
              const wrapStyle = allowColumnWrap?.includes(cell.column.id);
              const detailViewButton = detailViewConfig?.field === cell.column.id;
              const cellDisplay = (children: ReactNode) =>
                detailViewButton ? (
                  <button onClick={() => handleDetailClick(rowConfig, cellValue)} className={detailButton}>
                    {children}
                  </button>
                ) : (
                  <>{children}</>
                );

              return (
                <td
                  key={cell.id}
                  className={classNames([
                    `${rightAlign(dataTypes[cell.column.id]) ? rightAlignText : null}`,
                    cellBorder,
                    wrapStyle ? null : hidden,
                    cellText,
                  ])}
                >
                  {display ? <div /> : <>{cellDisplay(flexRender(cell.column.columnDef.cell, cell.getContext()))}</>}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default DataPreviewDataTableBody;
