import React, { FunctionComponent } from 'react';
import { IDataTableHeader } from '../../../../models/IDataTableHeader';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import {
  headerContent,
  defaultSortArrow,
  defaultSortArrowPill,
  isResizing,
  resizer,
  rightAlignText,
  sortArrow,
  sortArrowPill,
  stickyHeader,
  filtersActive,
  tableHeader,
} from './data-preview-data-table-header.module.scss';
import { columnHeaderFilterActive, rightAlign } from '../../../data-table/data-table-helper';
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

  const sortArrowButton = (icon, state, header) => {
    const defaultState = state === 'false';
    return (
      <div
        className={defaultState ? defaultSortArrowPill : sortArrowPill}
        tabIndex={0}
        role="button"
        aria-label="Column sort"
        onClick={e => iconClick(state, header, e)}
        onKeyDown={e => iconClick(state, header, e)}
      >
        <FontAwesomeIcon icon={icon as IconProp} className={defaultState ? defaultSortArrow : sortArrow} rotation={defaultState ? 90 : null} />
      </div>
    );
  };

  return (
    <thead>
      {table.getHeaderGroups().map(headerGroup => {
        return (
          <tr key={headerGroup.id} data-testid="header-row" className={stickyHeader}>
            {headerGroup.headers.map((header, index) => {
              const columnDataType = dataTypes[header.id];
              const rightAlignStyle = rightAlign(columnDataType) ? rightAlignText : null;
              const appliedFilterStyle = columnHeaderFilterActive(allActiveFilters, header.id);
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    minWidth: header.getSize(),
                  }}
                  className={`${tableHeader} ${appliedFilterStyle && filtersActive}`}
                >
                  {!header.isPlaceholder && (
                    <>
                      <div className={`${headerContent} ${rightAlignStyle}`} data-testid={`header-sorter-${header.id}`}>
                        <LightTooltip title={header.column.columnDef.header} placement="bottom-start">
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                        </LightTooltip>
                        {{
                          asc: sortArrowButton(faArrowUpShortWide, 'asc', header),
                          desc: sortArrowButton(faArrowDownWideShort, 'desc', header),
                          false: sortArrowButton(faArrowRightArrowLeft, 'false', header),
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
