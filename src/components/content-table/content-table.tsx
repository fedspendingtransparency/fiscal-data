import React, { FunctionComponent, ReactNode } from 'react';
import CustomLink from '../links/custom-link/custom-link';
import { cellLabel, cellValue, contentTable, headerCell, linkCell, tableRow } from './content-table.module.scss';

export type ContentTableLinkCell = {
  text: ReactNode;
  url?: string;
  external?: boolean;
};

export type ContentTableCell = ReactNode | ContentTableLinkCell;

export type ContentTableColumn = {
  header: string;
  cells: ContentTableCell[];
  urls?: (string | undefined)[];
  external?: boolean;
  width?: string;
};

type ContentTableProps = {
  columns: ContentTableColumn[];
  caption?: string;
  'data-testid'?: string;
};

const isLinkCell = (cell: ContentTableCell): cell is ContentTableLinkCell =>
  typeof cell === 'object' && cell !== null && !React.isValidElement(cell) && 'text' in cell;

const renderCell = (column: ContentTableColumn, rowIdx: number): ReactNode => {
  const cell = column.cells[rowIdx];
  const text = isLinkCell(cell) ? cell.text : cell;
  const url = (isLinkCell(cell) && cell.url) || column.urls?.[rowIdx];
  const external = (isLinkCell(cell) && cell.external) ?? column.external;

  if (!url) {
    return text;
  }
  return (
    <CustomLink url={url} external={external} className={linkCell}>
      {text}
    </CustomLink>
  );
};

const ContentTable: FunctionComponent<ContentTableProps> = ({ columns, caption, 'data-testid': dataTestId = 'content-table' }) => {
  const rowCount = Math.max(0, ...columns.map(column => column.cells.length));
  const rows = Array.from({ length: rowCount }, (_, idx) => idx);

  return (
    <table className={contentTable} data-testid={dataTestId}>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.header} scope="col" className={headerCell} style={column.width ? { width: column.width } : undefined}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(rowIdx => (
          <tr key={rowIdx} className={tableRow} data-testid="content-table-row">
            {columns.map(column => (
              <td key={column.header}>
                <span className={cellLabel} aria-hidden="true">
                  {column.header}:
                </span>
                <span className={cellValue}>{renderCell(column, rowIdx)}</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContentTable;
