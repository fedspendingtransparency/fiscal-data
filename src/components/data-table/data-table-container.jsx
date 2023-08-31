import { DataTable } from './data-table';
import React, { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as styles from '../dtg-table/dtg-table.module.scss';
import DtgTableColumnSelector from '../dtg-table/dtg-table-column-selector';
import DataTableColumnSelector from './column-select/data-table-column-selector';
// import { selectColumnPanel } from '../dtg-table/dtg-table.module.scss';
import ColumnSelect from './column-select/column-select';
import DataTableFooter from './data-table-footer/data-table-footer';

const DataTableContainer = ({
  rawData,
  defaultSelectedColumns,
  setTableColumnSortData,
  shouldPage,
  showPaginationControls,
  publishedReports,
  hasPublishedReports,
  columnVisibility,
  setColumnVisibility,
  defaultInvisibleColumns,
  pagingProps,
  selectColumns,
  setSelectColumnPanel,
  selectColumnPanel,
}) => {
  const [sorting, setSorting] = useState([]);
  const pageSize = 10;

  const allColumns = rawData?.meta
    ? Object.entries(rawData.meta.labels).map(([field, label]) => ({
        accessorKey: field,
        header: label,
      }))
    : [];
  const data = rawData.data;

  const [columns] = useState(() => [...allColumns]);

  const table = useReactTable({
    columns,
    data,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    state: {
      columnVisibility,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div
        data-test-id="table-content"
        className={styles.overlayContainerNoFooter}
      >
        <div className={styles.selectColumnsWrapper}>
          <DataTable
            rawData={rawData}
            defaultSelectedColumns={defaultSelectedColumns}
            setTableColumnSortData={setTableColumnSortData}
            hasPublishedReports={hasPublishedReports}
            publishedReports={publishedReports}
            hideCellLinks={true}
            pagingProps={pagingProps}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            defaultInvisibleColumns={defaultInvisibleColumns}
            allColumns={allColumns}
            table={table}
            sorting={sorting}
          />
          <div
            data-testid="selectColumnsMainContainer"
            className={
              selectColumnPanel
                ? styles.selectColumnPanelActive
                : styles.selectColumnPanel
            }
            style={{ height: `521px` }}
          >
            {selectColumns && (
              <DataTableColumnSelector
                setSelectColumnPanel={setSelectColumnPanel}
                defaultSelectedColumns={defaultSelectedColumns}
                defaultInvisibleColumns={defaultInvisibleColumns}
                table={table}
                setColumnVisibility={setColumnVisibility}
                allColumns={allColumns}
                isVisible={true}
                fields={allColumns}
                changeHandler={table.getToggleAllColumnsVisibilityHandler}
                resetToDefault={table.getToggleAllColumnsVisibilityHandler}
                // isReset={isReset}
              />
            )
            // <ColumnSelect defaultSelectedColumns={defaultSelectedColumns}
            //             defaultInvisibleColumns={defaultInvisibleColumns}
            //             table={table}
            //             setColumnVisibility={setColumnVisibility}
            //             allColumns={allColumns}
            // />
            }
          </div>
        </div>
      </div>
      {shouldPage && (
        <DataTableFooter
          table={table}
          showPaginationControls={showPaginationControls}
        />
      )}
    </>
  );
};

export default DataTableContainer;
