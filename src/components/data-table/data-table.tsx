import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { json2xml } from 'xml-js';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Table, useReactTable } from '@tanstack/react-table';
import DataTableFooter from './data-table-footer/data-table-footer';
import {
  nonRawDataTableContainer,
  overlayContainerNoFooter,
  overlayContainerNoFooterChart,
  rawDataTableContainer,
  selectColumnPanelActive,
  selectColumnPanelInactive,
  selectColumnsWrapper,
  tableStyle,
} from './data-table.module.scss';
import DataTableHeader from './data-table-header/data-table-header';
import DataTableColumnSelector from './column-select/data-table-column-selector';
import DataTableBody from './data-table-body/data-table-body';
import { columnsConstructorData, columnsConstructorGeneric, getSortedColumnsData } from './data-table-helper';
import {
  smallTableDownloadDataCSV,
  smallTableDownloadDataJSON,
  smallTableDownloadDataXML,
  tableRowLengthState,
} from '../../recoil/smallTableDownloadData';
import { useSetRecoilState } from 'recoil';
import { IDataTableProps } from '../../models/IDataTableProps';

const DataTable: FunctionComponent<IDataTableProps> = ({
  rawData,
  dateRange,
  nonRawDataColumns,
  defaultSelectedColumns,
  setTableColumnSortData,
  shouldPage,
  showPaginationControls,
  publishedReports,
  hasPublishedReports,
  setSelectColumnPanel,
  selectColumnPanel,
  resetFilters,
  setResetFilters,
  hideCellLinks,
  tableName,
  hideColumns,
  pagingProps,
  manualPagination,
  rowsShowing,
  columnConfig,
  detailColumnConfig,
  detailView,
  detailViewAPI,
  detailViewState,
  setDetailViewState,
  allowColumnWrap,
  aria,
  pivotSelected,
  setSummaryValues,
  customFormatting,
  sorting,
  setSorting,
  allActiveFilters,
  setAllActiveFilters,
  setTableSorting,
  disableDateRangeFilter,
  datasetName,
  hasDownloadTimestamp,
  chartTable = true,
}) => {
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

    const baseColumns = nonRawDataColumns
      ? columnsConstructorGeneric(nonRawDataColumns)
      : columnsConstructorData(rawData, hideCols, tableName, configOption, customFormatting);

    return baseColumns;
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

  const constructDateHeader = () => {
    const timestampData = [];
    timestampData.push(`${datasetName}.`);
    const date = new Date(dateRange.to.toString());
    const dateFormatted = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
    const lastDateOfMonth = `${dateFormatted}`;
    timestampData.push(`As of ${lastDateOfMonth}`);
    return timestampData;
  };

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
      if (!nonRawDataColumns) {
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
          const dateHeader = constructDateHeader();
          downloadData.unshift(dateHeader);
        }
        setSmallTableCSVData(downloadData);
      }
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

  const selectColumnsRef = useRef(null);

  useEffect(() => {
    if (selectColumnPanel) {
      selectColumnsRef.current?.focus();
    }
  });

  return (
    <>
      <div data-test-id="table-content" className={!chartTable ? overlayContainerNoFooterChart : overlayContainerNoFooter}>
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
            <div data-test-id="table-content" className={nonRawDataColumns ? nonRawDataTableContainer : rawDataTableContainer}>
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
                <DataTableBody
                  table={table}
                  dataTypes={dataTypes}
                  allowColumnWrap={allowColumnWrap}
                  detailViewConfig={detailView}
                  setDetailViewState={setDetailViewState}
                  setSummaryValues={setSummaryValues}
                  chartTable={chartTable}
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
          setTableDownload={nonRawDataColumns ? null : setTableRowSizeData}
          chartTable={chartTable}
        />
      )}
    </>
  );
};

export default DataTable;
