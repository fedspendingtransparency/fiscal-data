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
  textChartHeaderContainer,
  textHeaderContainer,
} from './data-table-header.module.scss';
import { flexRender } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons/faArrowDownWideShort';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowRightArrowLeft';
import { faArrowUpShortWide } from '@fortawesome/free-solid-svg-icons/faArrowUpShortWide';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { getColumnFilter, rightAlign } from '../data-table-helper';
import React, { FunctionComponent } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { IDataTableHeader } from '../../../models/IDataTableHeader';
import { fontTitle } from '../../../variables.module.scss';

const DataTableHeader: FunctionComponent<IDataTableHeader> = ({
  table,
  dataTypes,
  resetFilters,
  manualPagination,
  allActiveFilters,
  setAllActiveFilters,
  disableDateRangeFilter,
  chartTable,
  disableAllFilters,
}) => {
  const tooltipStyle = {
    color: fontTitle,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'Source Sans Pro',
    marginLeft: '1.25rem',
    marginTop: '0.25rem',
    borderRadius: '0.25rem',
    background: '#FFF',
    boxShadow: '0.25rem 0.25rem 1rem 0 rgba(0, 0, 0, 0.15), 0 0 0.125rem 0 rgba(0, 0, 0, 0.20)',
  };

  const iconClick = (state, header, e) => {
    if (e.key === undefined || e.key === 'Enter') {
      header.column.toggleSorting();
      if (state === 'asc' || state === 'false') {
        if (allActiveFilters && !allActiveFilters.includes(`${header.column.id}-sort`)) {
          const currentFilters = allActiveFilters?.filter(item => !item.includes('sort'));
          currentFilters.push(`${header.column.id}-sort`);
          setAllActiveFilters(currentFilters);
        }
      } else {
        const currentFilters = allActiveFilters?.filter(item => item !== `${header.column.id}-sort`);
        if (typeof setAllActiveFilters === 'function') {
          setAllActiveFilters(currentFilters);
        }
      }
    }
  };

  return (
    <thead>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <tr key={headerGroup.id} data-testid="header-row" className={stickyHeader}>
            {headerGroup.headers.map((header, index) => {
              let isLastColumn = false;
              const columnDataType = dataTypes[header.id];
              const rightAlignStyle = rightAlign(columnDataType) ? rightAlignText : null;
              if (!headerGroup.headers[index + 1]) {
                isLastColumn = true;
              }
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={!chartTable ? textHeaderContainer : textChartHeaderContainer}
                  style={{
                    minWidth: !chartTable ? header.getSize() : header.getSize() - 4,
                    width: chartTable ? '20rem' : '',
                    paddingLeft: chartTable ? '1rem' : '',
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      <div className={header.column.getCanSort() ? `${colHeader} ${rightAlignStyle}` : ''} data-testid={`header-sorter-${header.id}`}>
                        <Tooltip title={header.column.columnDef.header} placement="bottom-start" slotProps={{ tooltip: { sx: { ...tooltipStyle } } }}>
                          <div className={colHeaderText}>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                        </Tooltip>
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
                      {!disableAllFilters && (
                        <div className={columnMinWidth}>
                          {getColumnFilter(
                            header,
                            columnDataType,
                            resetFilters,
                            allActiveFilters,
                            setAllActiveFilters,
                            manualPagination,
                            isLastColumn,
                            disableDateRangeFilter
                          )}
                        </div>
                      )}
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
