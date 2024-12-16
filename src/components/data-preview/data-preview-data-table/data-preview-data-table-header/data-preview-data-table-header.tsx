import React, { FunctionComponent } from 'react';
import { IDataTableHeader } from '../../../../models/IDataTableHeader';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
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
  filtersActive,
} from './data-preview-data-table-header.module.scss';
import { columnFilterActive, getColumnFilter, rightAlign } from '../../../data-table/data-table-helper';
import { flexRender } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faArrowRightArrowLeft, faArrowUpShortWide } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const DataPreviewDataTableHeader: FunctionComponent<IDataTableHeader> = ({ table, dataTypes, allActiveFilters, setAllActiveFilters }) => {
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

  console.log(allActiveFilters);

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
        setAllActiveFilters(currentFilters);
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
              const appliedFilterStyle = columnFilterActive(allActiveFilters, header.id);
              if (!headerGroup.headers[index + 1]) {
                isLastColumn = true;
              }
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    minWidth: header.getSize(),
                  }}
                  className={appliedFilterStyle && filtersActive}
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

export default DataPreviewDataTableHeader;
