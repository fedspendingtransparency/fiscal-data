import React, { FunctionComponent, useEffect, useState } from 'react';
import { json2xml } from 'xml-js';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Table, useReactTable } from '@tanstack/react-table';
import DataTableFooter from '../data-table-footer/data-table-footer';
import {
  nonRawDataTableContainer,
  overlayContainerNoFooter,
  overlayContainerNoFooterChart,
  selectColumnsWrapper,
  tableStyle,
} from '../data-table.module.scss';
import DataTableHeader from '../data-table-header/data-table-header';
import DataTableBody from '../data-table-body/data-table-body';
import { columnsConstructorGeneric, getSortedColumnsData } from '../data-table-helper';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../recoil/smallTableDownloadData';
import { useSetRecoilState } from 'recoil';
import { IDataTableProps } from '../../../models/IDataTableProps';

const BasicTable: FunctionComponent<IDataTableProps> = ({
  rawData,
  nonRawDataColumns,
  enableDownload,
  defaultSelectedColumns,
  setTableColumnSortData,
  shouldPage,
  showPaginationControls,
  resetFilters,
  setResetFilters,
  hideColumns,
  pagingProps,
  manualPagination,
  rowsShowing,
  allowColumnWrap,
  aria,
  customFormatting,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  setTableSorting,
  disableDateRangeFilter,
  chartTable = true,
}) => {
  // const [configOption, setConfigOption] = useState(columnConfig);
  const setSmallTableCSVData = useSetRecoilState(smallTableDownloadDataCSV);
  const setSmallTableJSONData = useSetRecoilState(smallTableDownloadDataJSON);
  const setSmallTableXMLData = useSetRecoilState(smallTableDownloadDataXML);

  const allColumns = React.useMemo(() => {
    const baseColumns = columnsConstructorGeneric(nonRawDataColumns, customFormatting);

    return baseColumns;
  }, [rawData]);

  let dataTypes;

  if (rawData.meta) {
    dataTypes = rawData.meta.dataTypes;
  } else {
    const tempDataTypes = {};
    allColumns?.forEach(column => {
      if (column.type) {
        tempDataTypes[column.property] = column.type;
      } else {
        tempDataTypes[column.property] = 'STRING';
      }
    });
    dataTypes = tempDataTypes;
  }

  const defaultInvisibleColumns = {};
  const [columnVisibility, setColumnVisibility] = useState(
    defaultSelectedColumns && defaultSelectedColumns.length > 0 ? defaultInvisibleColumns : {}
  );

  const table = useReactTable({
    columns: allColumns,
    data: rawData.data,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pagingProps.itemsPerPage,
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
    manualPagination: manualPagination,
  }) as Table<Record<string, unknown>>;

  // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
  if (defaultSelectedColumns) {
    for (const column of allColumns) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (defaultSelectedColumns && !defaultSelectedColumns?.includes(column.accessorKey)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultInvisibleColumns[column.accessorKey] = false;
      }
    }
  }

  useEffect(() => {
    getSortedColumnsData(table, setTableColumnSortData, hideColumns, dataTypes);
    if (!table.getSortedRowModel()?.flatRows[0]?.original.columnName) {
      let downloadData = [];
      const downloadHeaders = [];
      const downloadHeaderKeys = [];
      table.getHeaderGroups()[0].headers.forEach(header => {
        downloadHeaders.push(header.column.columnDef.header);
        downloadHeaderKeys.push(header.column.columnDef.accessorKey);
      });

      //Filter data by visible columns
      table.getSortedRowModel().flatRows.forEach(row => {
        const visibleRow = {};
        const allData = row.original;
        downloadHeaderKeys.forEach(key => {
          visibleRow[key] = allData[key];
        });
        downloadData.push(visibleRow);
      });
      if (enableDownload) {
        const xmlData = {
          'root-element': {
            data: downloadData.map(row => ({
              'data-element': row,
            })),
          },
        };
        setSmallTableJSONData(JSON.stringify({ data: downloadData }));
        setSmallTableXMLData(json2xml(JSON.stringify(xmlData), { compact: true }));
        downloadData = downloadData.map(entry => {
          const dataWithTextQualifiers = [];
          Object.values(entry).forEach(val => {
            const stringValue = String(val ?? '');
            dataWithTextQualifiers.push(stringValue.includes(',') ? `"${stringValue}"` : stringValue);
          });
          return dataWithTextQualifiers;
        });
        downloadData.unshift(downloadHeaders);
        setSmallTableCSVData(downloadData);
      }
    }
  }, [columnVisibility, table.getSortedRowModel(), table.getVisibleFlatColumns(), sorting]);

  useEffect(() => {
    getSortedColumnsData(table, setTableColumnSortData, hideColumns, dataTypes);
    setTableSorting(sorting);
  }, [sorting]);

  useEffect(() => {
    if (resetFilters) {
      table.resetColumnFilters();
      table.resetSorting();
      setResetFilters(false);
      setAllActiveFilters([]);
    }
  }, [resetFilters]);

  return (
    <>
      <div data-testid="table-content" className={!chartTable ? overlayContainerNoFooterChart : overlayContainerNoFooter}>
        <div className={selectColumnsWrapper}>
          <div className={tableStyle}>
            <div data-test-id="table-content" className={nonRawDataTableContainer}>
              <table {...aria}>
                <DataTableHeader
                  table={table}
                  dataTypes={dataTypes}
                  resetFilters={resetFilters}
                  manualPagination={manualPagination}
                  allActiveFilters={allActiveFilters}
                  setAllActiveFilters={setAllActiveFilters}
                  disableDateRangeFilter={disableDateRangeFilter}
                  chartTable={chartTable}
                />
                <DataTableBody table={table} dataTypes={dataTypes} allowColumnWrap={allowColumnWrap} chartTable={chartTable} />
              </table>
            </div>
          </div>
        </div>
      </div>
      {shouldPage && (
        <DataTableFooter
          table={table}
          showPaginationControls={showPaginationControls}
          pagingProps={pagingProps}
          manualPagination={manualPagination}
          rowsShowing={rowsShowing}
          chartTable={chartTable}
        />
      )}
    </>
  );
};

export default BasicTable;
