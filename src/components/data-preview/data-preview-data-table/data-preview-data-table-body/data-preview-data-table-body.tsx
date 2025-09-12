import React, { FunctionComponent, ReactNode, useContext } from 'react';
import { IDataTableBody } from '../../../../models/IDataTableBody';
import { detailButton, filtersActive, hidden, rightAlignText, tableCell, tableRow } from './data-preview-data-table-body.module.scss';
import { columnBodyFilterActive, columnBodyFilterApplied, rightAlign } from '../../../data-table/data-table-helper';
import { flexRender } from '@tanstack/react-table';
import { DataTableContext } from '../../data-preview-context';

const DataPreviewDataTableBody: FunctionComponent<IDataTableBody> = ({
  table,
  dataTypes,
  allowColumnWrap,
  detailViewConfig,
  setDetailViewState,
  setSummaryValues,
  allActiveFilters,
}) => {
  let fillCell = false;
  const { appliedFilters } = useContext(DataTableContext);
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
          <tr key={row.id} data-testid="row" className={tableRow}>
            {rowConfig.map(cell => {
              const cellValue = cell.getValue()?.toString();
              const display = !cellValue || cellValue === 'null';
              const wrapStyle = allowColumnWrap?.includes(cell.column.id);
              const detailViewButton = detailViewConfig?.field === cell.column.id;
              const activeFilterStyle = columnBodyFilterActive(allActiveFilters, cell.id);
              const appliedFilterStyle = columnBodyFilterApplied(appliedFilters, cell.id);
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
                  className={`${rightAlign(dataTypes[cell.column.id]) ? rightAlignText : null}
                    ${tableCell} ${wrapStyle ? null : hidden} ${(activeFilterStyle || appliedFilterStyle) && filtersActive}`}
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
