import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { IDataTableProps } from '../../../models/IDataTableProps';
import { useSetRecoilState } from 'recoil';
import {
  smallTableDownloadDataCSV,
  smallTableDownloadDataJSON,
  smallTableDownloadDataXML,
  tableRowLengthState,
} from '../../../recoil/smallTableDownloadData';
import { constructDateHeader, getSortedColumnsData } from '../../data-table/data-table-helper';
import { json2xml } from 'xml-js';
import { overlayContainerNoFooter, rawDataTableContainer } from './data-preview-data-table.module.scss';
import DataTableFooter from '../../data-table/data-table-footer/data-table-footer';
import DataPreviewDataTableBody from './data-preview-data-table-body/data-preview-data-table-body';
import DataPreviewDataTableHeader from './data-preview-data-table-header/data-preview-data-table-header';
import { DataTableContext } from '../data-preview-context';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Table, useReactTable } from '@tanstack/react-table';

const DataPreviewDataTable: FunctionComponent<IDataTableProps> = ({
  setTableColumnSortData,
  shouldPage,
  showPaginationControls,
  publishedReports,
  hasPublishedReports,
  resetFilters,
  setResetFilters,
  hideCellLinks,
  hideColumns,
  pagingProps,
  manualPagination,
  rowsShowing,
  detailView,
  detailViewState,
  setDetailViewState,
  allowColumnWrap,
  aria,
  pivotSelected,
  setSummaryValues,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  setTableSorting,
  disableDateRangeFilter,
  datasetName,
  dateRange,
  hasDownloadTimestamp,
}) => {
  const { defaultSelectedColumns, setDefaultColumns, setAdditionalColumns, allColumns, setTableState, reactTableData: rawData } = useContext(
    DataTableContext
  );

  const setSmallTableCSVData = useSetRecoilState(smallTableDownloadDataCSV);
  const setSmallTableJSONData = useSetRecoilState(smallTableDownloadDataJSON);
  const setSmallTableXMLData = useSetRecoilState(smallTableDownloadDataXML);
  const setTableRowSizeData = useSetRecoilState(tableRowLengthState);

  if (hasPublishedReports && !hideCellLinks) {
    // Must be able to modify allColumns, thus the ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allColumns[0].cell = ({ getValue }) => {
      if (
        publishedReports.find(report => {
          return report.report_date.toISOString().split('T')[0] === getValue();
        }) !== undefined
      ) {
        const path = publishedReports.find(report => {
          return report.report_date.toISOString().split('T')[0] === getValue();
        }).path;
        return <a href={path}>{getValue()}</a>;
      } else {
        return <span>{getValue()}</span>;
      }
    };
  }

  let dataTypes;

  if (rawData.meta) {
    dataTypes = rawData.meta.dataTypes;
  } else {
    const tempDataTypes = {};
    allColumns?.forEach(column => {
      tempDataTypes[column.property] = 'STRING';
    });
    dataTypes = tempDataTypes;
  }

  const defaultInvisibleColumns = {};
  const [columnVisibility, setColumnVisibility] = useState(
    defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotSelected ? defaultInvisibleColumns : {}
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
  const constructDefaultColumnsFromTableData = () => {
    const constructedDefaultColumns = [];
    const constructedAdditionalColumns = [];
    for (const column of table.getAllLeafColumns()) {
      if (defaultSelectedColumns.includes(column.id)) {
        constructedDefaultColumns.push(column);
      } else if (!defaultSelectedColumns.includes(column.id)) {
        constructedAdditionalColumns.push(column);
      }
    }
    constructedAdditionalColumns.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    setDefaultColumns(constructedDefaultColumns);
    setAdditionalColumns(constructedAdditionalColumns);
  };

  useEffect(() => {
    setTableState(table);
  }, [table]);

  useEffect(() => {
    if (defaultSelectedColumns && !pivotSelected) {
      setColumnVisibility(defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotSelected ? defaultInvisibleColumns : {});
      constructDefaultColumnsFromTableData();
    }
  }, [defaultSelectedColumns]);

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
      if (hasDownloadTimestamp) {
        const dateHeader = constructDateHeader(datasetName, dateRange);
        downloadData.unshift(dateHeader);
      }
      setSmallTableCSVData(downloadData);
    }
  }, [columnVisibility, table.getSortedRowModel(), table.getVisibleFlatColumns()]);

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
      <div data-test-id="table-content" className={overlayContainerNoFooter}>
        <div data-test-id="table-content" className={rawDataTableContainer}>
          <table {...aria} className={rawDataTableContainer}>
            <DataPreviewDataTableHeader
              table={table}
              dataTypes={dataTypes}
              resetFilters={resetFilters}
              manualPagination={manualPagination}
              allActiveFilters={allActiveFilters}
              setAllActiveFilters={setAllActiveFilters}
              disableDateRangeFilter={disableDateRangeFilter}
            />
            <DataPreviewDataTableBody
              table={table}
              dataTypes={dataTypes}
              allowColumnWrap={allowColumnWrap}
              detailViewConfig={detailView}
              setDetailViewState={setDetailViewState}
              setSummaryValues={setSummaryValues}
              allActiveFilters={allActiveFilters}
            />
          </table>
        </div>
      </div>
      {shouldPage && (
        <DataTableFooter
          table={table}
          showPaginationControls={showPaginationControls}
          pagingProps={pagingProps}
          manualPagination={manualPagination}
          rowsShowing={rowsShowing}
          setTableDownload={setTableRowSizeData}
        />
      )}
    </>
  );
};

export default DataPreviewDataTable;
