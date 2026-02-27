import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
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
import { defaultPerPageOptions } from '../../pagination/pagination-controls';
import { getDownloadData, getDownloadHeaders, setCsvDownload, setXmlDownload } from './basic-table-helper';

const defaultRowsPerPage = 10;

const BasicTable: FunctionComponent<IDataTableProps> = ({
  enableDownload,
  setTableColumnSortData,
  resetFilters,
  setResetFilters,
  manualPagination,
  allowColumnWrap,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  disableDateRangeFilter,
  tableProps,
  perPage,
}) => {
  const { shouldPage, data, columnConfig, selectColumns: defaultSelectedColumns, hideColumns, customFormatting, chartTable, aria } = tableProps;

  const [tableData, setTableData] = useState({ data: [] });
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : !shouldPage && data.length > defaultRowsPerPage ? data.length : defaultRowsPerPage
  );
  const [maxRows, setMaxRows] = useState(tableProps.data?.length > 0 ? tableProps.data.length : 1);
  const [showPaginationControls, setShowPaginationControls] = useState();
  const [dataTypes, setDataTypes] = useState();

  const isPaginationControlNeeded = () => !tableProps.apiError && tableProps.data?.length > defaultPerPageOptions[0];
  const handlePerPageChange = numRows => {
    const numItems = numRows >= maxRows ? maxRows : numRows;
    setItemsPerPage(numItems);
  };

  const pagingProps = {
    itemsPerPage,
    handlePerPageChange,
  };

  useEffect(() => {
    setShowPaginationControls(isPaginationControlNeeded());
  }, [maxRows]);

  useMemo(() => {
    if (data) {
      setTableData(data);
      setMaxRows(data.length);
    }
  }, [data]);

  const setSmallTableCSVData = useSetRecoilState(smallTableDownloadDataCSV);
  const setSmallTableJSONData = useSetRecoilState(smallTableDownloadDataJSON);
  const setSmallTableXMLData = useSetRecoilState(smallTableDownloadDataXML);

  const allColumns = React.useMemo(() => {
    const columnConstructor = columnsConstructorGeneric(columnConfig, customFormatting);

    if (tableData.meta) {
      setDataTypes(tableData.meta.dataTypes);
    } else {
      const tempDataTypes = {};
      columnConstructor?.forEach(column => {
        if (column.type) {
          tempDataTypes[column.property] = column.type;
        } else {
          tempDataTypes[column.property] = 'STRING';
        }
      });
      setDataTypes(tempDataTypes);
    }
    return columnConstructor;
  }, [tableData]);

  const defaultInvisibleColumns = {};
  const [columnVisibility, setColumnVisibility] = useState(
    defaultSelectedColumns && defaultSelectedColumns.length > 0 ? defaultInvisibleColumns : {}
  );

  const table = useReactTable({
    columns: allColumns,
    data: tableData,
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

  useEffect(() => {
    getSortedColumnsData(table, setTableColumnSortData, hideColumns, dataTypes);

    if (enableDownload && !table.getSortedRowModel()?.flatRows[0]?.original.columnName) {
      const { downloadHeaders, downloadHeaderKeys } = getDownloadHeaders(table.getHeaderGroups()[0].headers);
      const downloadData = getDownloadData(table.getSortedRowModel(), downloadHeaderKeys);
      setSmallTableJSONData(JSON.stringify({ data: downloadData }));
      setXmlDownload(data, setSmallTableXMLData);
      setCsvDownload(downloadData, downloadHeaders, setSmallTableCSVData);
    }
  }, [columnVisibility, table.getSortedRowModel(), table.getVisibleFlatColumns(), sorting]);

  useEffect(() => {
    getSortedColumnsData(table, setTableColumnSortData, hideColumns, dataTypes);
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
          chartTable={chartTable}
        />
      )}
    </>
  );
};

export default BasicTable;
