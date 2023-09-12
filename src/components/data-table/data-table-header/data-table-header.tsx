import {
  colHeader,
  colHeaderText,
  columnMinWidth,
  defaultSortArrow,
  defaultSortArrowPill,
  isResizing,
  resizer,
  rightAlignText,
  sortArrow,
  sortArrowPill,
} from './data-table-header.module.scss';
import { flexRender, Table } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft, faArrowUpShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SingleDateFilter, Filter, rightAlign } from '../data-table-helper';
import React, { FunctionComponent } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

interface IDataTableHeader {
  table: Table<any>;
  dataTypes: { [key: string]: string };
  resetFilters: boolean;
  setFiltersActive: (value: boolean) => void;
}

const DataTableHeader: FunctionComponent<IDataTableHeader> = ({ table, dataTypes, resetFilters, setFiltersActive }) => {
  const LightTooltip = withStyles(() => ({
    tooltip: {
      color: '#555555',
      fontSize: 16,
      fontWeight: 600,
      fontFamily: 'Source Sans Pro',
      marginLeft: '1.25rem',
      marginTop: '0.25rem',
      borderRadius: '0.25rem',
      background: '#FFF',
      boxShadow: '0.25rem 0.25rem 1rem 0 rgba(0, 0, 0, 0.15), 0 0 0.125rem 0 rgba(0, 0, 0, 0.20)',
    },
  }))(Tooltip);

  const iconClick = (state, header) => {
    header.column.toggleSorting();
    setFiltersActive(state === 'asc' || state === 'false');
    return;
  };

  return (
    <thead>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <tr key={headerGroup.id} data-testid="header-row">
            {headerGroup.headers.map(header => {
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    minWidth: header.getSize(),
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        className={header.column.getCanSort() ? `${colHeader} ${rightAlign(dataTypes[header.id]) ? rightAlignText : null}` : ''}
                        data-testid={`header-sorter-${header.id}`}
                      >
                        <LightTooltip title={header.column.columnDef.header} placement="bottom-start">
                          <div className={colHeaderText}>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                        </LightTooltip>
                        {{
                          asc: (
                            <div className={sortArrowPill}>
                              <FontAwesomeIcon icon={faArrowUpShortWide as IconProp} className={sortArrow} onClick={() => iconClick('asc', header)} />
                            </div>
                          ),
                          desc: (
                            <div className={sortArrowPill}>
                              <FontAwesomeIcon
                                icon={faArrowDownWideShort as IconProp}
                                className={sortArrow}
                                onClick={() => iconClick('desc', header)}
                              />
                            </div>
                          ),
                          false: (
                            <div className={defaultSortArrowPill}>
                              <FontAwesomeIcon
                                icon={faArrowRightArrowLeft as IconProp}
                                className={defaultSortArrow}
                                rotation={90}
                                onClick={() => iconClick('false', header)}
                              />
                            </div>
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() &&
                      header.id === 'record_date' ? (
                        <div className={columnMinWidth}>
                          <SingleDateFilter column={header.column} />
                        </div>
                      ) : (
                        <div className={columnMinWidth}>
                          <Filter column={header.column} table={table} resetFilters={resetFilters} setFiltersActive={setFiltersActive} />
                        </div>
                      )}
                    </>
                  )}
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`${resizer} ${header.column.getIsResizing() ? isResizing : ''}`}
                  />
                </th>
              );
            })}
          </tr>
        );
      })}
    </thead>
  );
};

export default DataTableHeader;
