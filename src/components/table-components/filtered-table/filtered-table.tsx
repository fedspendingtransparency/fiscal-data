import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Table, useReactTable } from '@tanstack/react-table';
import DataTableFooter from '../../data-table/data-table-footer/data-table-footer';
import {
  nonRawDataTableContainer,
  overlayContainerNoFooter,
  overlayContainerNoFooterChart,
  tableStyle,
} from '../../data-table/data-table.module.scss';
import DataTableHeader from '../../data-table/data-table-header/data-table-header';
import DataTableBody from '../../data-table/data-table-body/data-table-body';
import { columnsConstructorGeneric } from '../../dtg-table/data-table-helper';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../recoil/smallTableDownloadData';
import { useSetRecoilState } from 'recoil';
import { defaultPerPageOptions } from '../../pagination/pagination-controls';
import { getDataTypes, getDownloadData, getDownloadHeaders, setCsvDownload, setXmlDownload } from '../helpers/data-download-helper';
import { IFilteredTableProps } from '../../../models/IFilteredTableProps';

const defaultRowsPerPage = 10;

const FilteredTable: FunctionComponent<IFilteredTableProps> = ({
  enableDownload,
  resetFilters,
  setResetFilters,
  allowColumnWrap,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  tableProps,
  perPage,
}) => {
  const { shouldPage, data, columnConfig, customFormatting, chartTable, aria, apiError } = tableProps;

  const [tableData, setTableData] = useState({ data: [] });
  const [itemsPerPage, setItemsPerPage] = useState(
    perPage ? perPage : !shouldPage && data.length > defaultRowsPerPage ? data.length : defaultRowsPerPage
  );
  const [maxRows, setMaxRows] = useState(tableProps.data?.length > 0 ? tableProps.data.length : 1);
  const [showPaginationControls, setShowPaginationControls] = useState(false);
  const [dataTypes, setDataTypes] = useState();

  const handlePerPageChange = numRows => {
    const numItems = numRows >= maxRows ? maxRows : numRows;
    setItemsPerPage(numItems);
  };

  const pagingProps = {
    itemsPerPage,
    handlePerPageChange,
  };

  const setSmallTableCSVData = useSetRecoilState(smallTableDownloadDataCSV);
  const setSmallTableJSONData = useSetRecoilState(smallTableDownloadDataJSON);
  const setSmallTableXMLData = useSetRecoilState(smallTableDownloadDataXML);

  const allColumns = useMemo(() => {
    const columnConstructor = columnsConstructorGeneric(columnConfig, customFormatting);
    setDataTypes(getDataTypes(tableData, columnConstructor));
    return columnConstructor;
  }, [tableData]);

  const table = useReactTable({
    columns: allColumns,
    data: tableData,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: itemsPerPage,
      },
    },
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  }) as Table<Record<string, unknown>>;

  useMemo(() => {
    if (data) {
      setTableData(data);
      setMaxRows(data.length);
      setShowPaginationControls(!apiError && data?.length > defaultPerPageOptions[0]);
    }
  }, [data]);

  useEffect(() => {
    //set download data
    if (enableDownload && !table.getSortedRowModel()?.flatRows[0]?.original.columnName) {
      const { downloadHeaders, downloadHeaderKeys } = getDownloadHeaders(table.getHeaderGroups()[0].headers);
      const downloadData = getDownloadData(table.getSortedRowModel(), downloadHeaderKeys);
      setSmallTableJSONData(JSON.stringify({ data: downloadData }));
      setXmlDownload(data, setSmallTableXMLData);
      setXmlDownload(data, setSmallTableXMLData);
      setCsvDownload(downloadData, downloadHeaders, setSmallTableCSVData);
    }
  }, [table.getSortedRowModel(), table.getVisibleFlatColumns(), sorting]);

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
      <div data-testid="table-content" className={chartTable ? overlayContainerNoFooterChart : overlayContainerNoFooter}>
        <div className={tableStyle}>
          <div className={nonRawDataTableContainer}>
            <table {...aria}>
              <DataTableHeader
                table={table}
                dataTypes={dataTypes}
                resetFilters={resetFilters}
                allActiveFilters={allActiveFilters}
                setAllActiveFilters={setAllActiveFilters}
                chartTable={chartTable}
                disableAllFilters={chartTable}
              />
              <DataTableBody table={table} dataTypes={dataTypes} allowColumnWrap={allowColumnWrap} chartTable={chartTable} />
            </table>
          </div>
        </div>
      </div>
      {shouldPage && (
        <DataTableFooter table={table} showPaginationControls={showPaginationControls} pagingProps={pagingProps} chartTable={chartTable} />
      )}
    </>
  );
};

export default FilteredTable;
