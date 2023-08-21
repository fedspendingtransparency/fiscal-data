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


const DataTableHeader = ({table, dataTypes}) => {

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
                        <div className={`${colHeaderText}`} id={'test'}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
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
