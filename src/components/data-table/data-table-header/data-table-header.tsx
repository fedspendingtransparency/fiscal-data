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
  stickyHeader,
} from './data-table-header.module.scss';
import { flexRender, Table } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft, faArrowUpShortWide, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { rightAlign, getColumnFilter } from '../data-table-helper';
import React, { FunctionComponent, useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

interface IDataTableHeader {
  table: Table<Record<string, unknown>>;
  dataTypes: { [key: string]: string };
  resetFilters: boolean;
  setFiltersActive: (value: boolean) => void;
  allActiveFilters: string[];
  setAllActiveFilters: (value: string[]) => void;
  manualPagination: boolean;
}

const DataTableHeader: FunctionComponent<IDataTableHeader> = ({
  table,
  dataTypes,
  resetFilters,
  setFiltersActive,
  allActiveFilters,
  setAllActiveFilters,
  manualPagination,
}) => {
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

  const iconClick = (state, header, e) => {
    if (e.key === undefined || e.key === 'Enter') {
      header.column.toggleSorting();
      if (state === 'asc' || state === 'false') {
        if (!allActiveFilters.includes(`${header.column.id}-sort`)) {
          const currentFilters = allActiveFilters.filter(item => !item.includes('sort'));
          currentFilters.push(`${header.column.id}-sort`);
          setAllActiveFilters(currentFilters);
        }
      } else {
        const currentFilters = allActiveFilters.filter(item => item !== `${header.column.id}-sort`);
        setAllActiveFilters(currentFilters);
      }
    }
  };

  useEffect(() => {
    if (setFiltersActive) {
      setFiltersActive(allActiveFilters.length > 0);
    }
  }, [allActiveFilters]);

  return (
    <thead>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <tr key={headerGroup.id} data-testid="header-row" className={stickyHeader}>
            {headerGroup.headers.map(header => {
              const columnDataType = dataTypes[header.id];
              const rightAlignStyle = rightAlign(columnDataType) ? rightAlignText : null;
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
                      <div className={header.column.getCanSort() ? `${colHeader} ${rightAlignStyle}` : ''} data-testid={`header-sorter-${header.id}`}>
                        <LightTooltip title={header.column.columnDef.header} placement="bottom-start">
                          <div className={colHeaderText}>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                        </LightTooltip>
                        {{
                          asc: (
                            <div
                              className={sortArrowPill}
                              tabIndex={0}
                              role="button"
                              aria-label="Column sort"
                              onClick={e => iconClick('asc', header, e)}
                              onKeyDown={e => iconClick('asc', header, e)}
                            >
                              <FontAwesomeIcon icon={faArrowUpShortWide as IconProp} className={sortArrow} />
                            </div>
                          ),
                          desc: (
                            <div
                              className={sortArrowPill}
                              tabIndex={0}
                              role="button"
                              aria-label="Column sort"
                              onClick={e => iconClick('desc', header, e)}
                              onKeyDown={e => iconClick('desc', header, e)}
                            >
                              <FontAwesomeIcon icon={faArrowDownWideShort as IconProp} className={sortArrow} />
                            </div>
                          ),
                          false: (
                            <div
                              className={defaultSortArrowPill}
                              tabIndex={0}
                              role="button"
                              aria-label="Column sort"
                              onClick={e => iconClick('false', header, e)}
                              onKeyDown={e => iconClick('false', header, e)}
                            >
                              <FontAwesomeIcon icon={faArrowRightArrowLeft as IconProp} className={defaultSortArrow} rotation={90} />
                            </div>
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      <div className={columnMinWidth}>
                        {getColumnFilter(
                          header,
                          columnDataType,
                          resetFilters,
                          setFiltersActive,
                          allActiveFilters,
                          setAllActiveFilters,
                          manualPagination
                        )}
                      </div>
                    </>
                  )}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    role="presentation"
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
