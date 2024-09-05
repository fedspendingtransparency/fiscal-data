import { rightAlign } from '../data-table-helper';
import { flexRender, Table } from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import { fillCellGrey, fillCellWhite, cellBorder, rightAlignText, hidden, detailButton } from './data-table-body.module.scss';
import classNames from 'classnames';

interface IDataTableBody {
  table: Table<Record<string, unknown>>;
  dataTypes: { [key: string]: string };
  allowColumnWrap: string[];
  detailViewConfig;
  setDetailViewState: (val: { value: string; secondary: string }) => void;
  setSummaryValues;
}

const DataTableBody: FunctionComponent<IDataTableBody> = ({
  table,
  dataTypes,
  allowColumnWrap,
  detailViewConfig,
  setDetailViewState,
  setSummaryValues,
}) => {
  let fillCell = false;

  const findRowValues = row => row.find(config => config.column.id === detailViewConfig.secondaryField)?.row.original;

  const handleDetailClick = (rowConfig, cellValue) => {
    const currentRow = findRowValues(rowConfig);
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
          <tr key={row.id} className={fillCell ? fillCellGrey : fillCellWhite} data-testid="row">
            {rowConfig.map(cell => {
              const cellValue = cell.getValue();
              const display = !cellValue || cellValue === 'null';
              const wrapStyle = allowColumnWrap?.includes(cell.column.id);

              const detailViewButton = detailViewConfig?.field === cell.column.id;
              const cellDisplay = children =>
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
                    fillCell ? cellBorder : null,
                    wrapStyle ? null : hidden,
                  ])}
                  style={{
                    verticalAlign: 'top',
                  }}
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

export default DataTableBody;
