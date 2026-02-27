import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Table, useReactTable } from '@tanstack/react-table';
import DataTableFooter from './data-table-footer/data-table-footer';
import {
  overlayContainerNoFooter,
  rawDataTableContainer,
  selectColumnPanelActive,
  selectColumnPanelInactive,
  selectColumnsWrapper,
  tableStyle,
} from './data-table.module.scss';
import DataTableHeader from './data-table-header/data-table-header';
import DataTableColumnSelector from './column-select/data-table-column-selector';
import DataTableBody from './data-table-body/data-table-body';
import { columnsConstructorData, getSortedColumnsData } from './data-table-helper';
import {
  smallTableDownloadDataCSV,
  smallTableDownloadDataJSON,
  smallTableDownloadDataXML,
  tableRowLengthState,
} from '../../recoil/smallTableDownloadData';
import { useSetRecoilState } from 'recoil';
import { IDataTableProps } from '../../models/IDataTableProps';
import { getDownloadData, getDownloadHeaders, setCsvDownload, setXmlDownload } from './test/basic-table-helper';

const DataTable: FunctionComponent<IDataTableProps> = ({
  rawData,
  defaultSelectedColumns,
  setTableColumnSortData,
  showPaginationControls,
  setSelectColumnPanel,
  selectColumnPanel,
  resetFilters,
  setResetFilters,
  hideCellLinks,
  pagingProps,
  manualPagination,
  rowsShowing,
  detailColumnConfig,
  detailView,
  detailViewAPI,
  detailViewState,
  setDetailViewState,
  pivotSelected,
  setSummaryValues,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  setTableSorting,
  disableDateRangeFilter,
  datasetName,
  hasDownloadTimestamp,
  tableProps,
}) => {
  const { aria, customFormatting, shouldPage, columnConfig, dateRange, tableName, hideColumns, hasPublishedReports, publishedReports } = tableProps;
  const [configOption, setConfigOption] = useState(columnConfig);
  const setSmallTableCSVData = useSetRecoilState(smallTableDownloadDataCSV);
  const setSmallTableJSONData = useSetRecoilState(smallTableDownloadDataJSON);
  const setSmallTableXMLData = useSetRecoilState(smallTableDownloadDataXML);
  const setTableRowSizeData = useSetRecoilState(tableRowLengthState);

  useEffect(() => {
    if (!detailViewState) {
      setConfigOption(columnConfig);
    } else {
      setConfigOption(detailColumnConfig);
    }
  }, [rawData]);

  const allColumns = React.useMemo(() => {
    const hideCols = detailViewState ? detailViewAPI.hideColumns : hideColumns;
    return columnsConstructorData(rawData, hideCols, tableName, configOption, customFormatting);
  }, [rawData, configOption]);

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

  const dataTypes = rawData.meta.dataTypes;

  const defaultInvisibleColumns = {};
  const [columnVisibility, setColumnVisibility] = useState(
    defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotSelected ? defaultInvisibleColumns : {}
  );
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);
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
    if (defaultSelectedColumns && !pivotSelected) {
      constructDefaultColumnsFromTableData();
    }
    if (detailViewState) {
      setColumnVisibility(defaultInvisibleColumns);
    }
  }, [configOption]);

  useEffect(() => {
    getSortedColumnsData(table, setTableColumnSortData, hideColumns, dataTypes);
    if (!table.getSortedRowModel()?.flatRows[0]?.original.columnName) {
      const { downloadHeaders, downloadHeaderKeys } = getDownloadHeaders(table.getHeaderGroups()[0].headers);
      const downloadData = getDownloadData(table.getSortedRowModel(), downloadHeaderKeys);
      setSmallTableJSONData(JSON.stringify({ data: downloadData }));
      setXmlDownload(downloadData, setSmallTableXMLData);
      setCsvDownload(downloadData, downloadHeaders, setSmallTableCSVData, hasDownloadTimestamp, datasetName, dateRange);
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

  const selectColumnsRef = useRef(null);

  useEffect(() => {
    if (selectColumnPanel) {
      selectColumnsRef.current?.focus();
    }
  });

  return (
    <>
      <div data-testid="table-content" className={overlayContainerNoFooter}>
        <div className={selectColumnsWrapper}>
          {defaultSelectedColumns && (
            <div className={selectColumnPanel ? selectColumnPanelActive : selectColumnPanelInactive} data-testid="selectColumnsMainContainer">
              <DataTableColumnSelector
                dataTableRef={selectColumnsRef}
                selectColumnPanel={selectColumnPanel}
                fields={allColumns}
                resetToDefault={() => setColumnVisibility(defaultSelectedColumns?.length > 0 ? defaultInvisibleColumns : {})}
                setSelectColumnPanel={setSelectColumnPanel}
                defaultSelectedColumns={defaultSelectedColumns}
                table={table}
                additionalColumns={additionalColumns}
                defaultColumns={defaultColumns}
              />
            </div>
          )}
          <div className={tableStyle}>
            <div data-test-id="table-content" className={rawDataTableContainer}>
              <table {...aria}>
                <DataTableHeader
                  table={table}
                  dataTypes={dataTypes}
                  resetFilters={resetFilters}
                  manualPagination={manualPagination}
                  allActiveFilters={allActiveFilters}
                  setAllActiveFilters={setAllActiveFilters}
                  disableDateRangeFilter={disableDateRangeFilter}
                />
                <DataTableBody
                  table={table}
                  dataTypes={dataTypes}
                  detailViewConfig={detailView}
                  setDetailViewState={setDetailViewState}
                  setSummaryValues={setSummaryValues}
                />
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
          setTableDownload={setTableRowSizeData}
        />
      )}
    </>
  );
};

export default DataTable;
