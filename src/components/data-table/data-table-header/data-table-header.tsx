import {
  colHeader,
  colHeaderText, columnMinWidth, defaultSortArrow, defaultSortArrowPill, isResizing, resizer,
  rightAlignText,
  sortArrow,
  sortArrowPill,
} from '../data-table.module.scss';
import { flexRender } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownShortWide,
  faArrowRightArrowLeft,
  faArrowUpShortWide,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Filter, rightAlign } from '../data-table-helper';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';


const DataTableHeader = ({table, dataTypes}) => {
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      color: '#555555',
      fontSize: 16,
      fontWeight: 600,
      fontFamily: 'Source Sans Pro',
      marginLeft: '20px',
      marginTop: '4px',
      borderRadius: '4px',
      background: '#FFF',
      boxShadow: '4px 4px 16px 0px rgba(0, 0, 0, 0.15), 0px 0px 2px 0px rgba(0, 0, 0, 0.20)',
    }
  }))(Tooltip)

  return (
    <thead>
    {table.getHeaderGroups().map((headerGroup) => {
      return (
        <tr key={headerGroup.id} data-testid='header-row'>
          {headerGroup.headers.map((header) => {
            const type = dataTypes[header.id];
            return (
              <th
                {...{
                  key: header.id,
                  colSpan: header.colSpan,
                  style: {
                    minWidth: header.getSize(),
                  },
                }}
              >
                {header.isPlaceholder
                  ? null
                  : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort() ? `${colHeader} ${rightAlign(type) ? rightAlignText : null}` : '',
                        }}
                        data-testid={`header-sorter-${header.id}`}
                      >
                        <LightTooltip title={header.column.columnDef.header} placement="bottom-start">
                          <div className={colHeaderText} >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </div>
                        </LightTooltip>
                        {{
                          asc:
                            <div className={sortArrowPill}>
                              <FontAwesomeIcon icon={faArrowUpShortWide as IconProp}
                                               className={sortArrow}
                                               onClick={header.column.getToggleSortingHandler()}
                              />
                            </div>,
                          desc:
                            <div className={sortArrowPill}>
                              <FontAwesomeIcon icon={faArrowDownShortWide as IconProp}
                                               className={sortArrow}
                                               onClick={header.column.getToggleSortingHandler()}
                              />
                            </div>,
                          false:
                            <div className={defaultSortArrowPill}>
                              <FontAwesomeIcon icon={faArrowRightArrowLeft as IconProp}
                                               className={defaultSortArrow}
                                               rotation={90}
                                               onClick={header.column.getToggleSortingHandler()}
                              />
                            </div>,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div className={columnMinWidth}>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </>
                  )}
                <div
                  {...{
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                    className: `${resizer} ${header.column.getIsResizing() ? isResizing : ''}`,
                  }}
                />
              </th>
            );
          })}
        </tr>
      );
    })}
    </thead>
  )
}

export default DataTableHeader;
