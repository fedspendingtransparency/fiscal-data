import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  SortingState,
} from '@tanstack/react-table';
import { currencyFormatter, numberFormatter } from '../../helpers/text-format/text-format';
import DataTableFooter from './data-table-footer/data-table-footer';

import StickyTable from 'react-sticky-table-thead';
import {
  tableContainer,
  tableStyle,
  overlayContainerNoFooter,
  selectColumnPanelActive,
  selectColumnPanelInactive,
  selectColumnsWrapper,
} from './data-table.module.scss';
import DataTableHeader from './data-table-header/data-table-header';
import DataTableColumnSelector from './column-select/data-table-column-selector';
import DataTableBody from './data-table-body/data-table-body';
import moment from 'moment';

type DataTableProps = {
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  rawData;
  defaultSelectedColumns: string[];
  setTableColumnSortData;
  hasPublishedReports: boolean;
  publishedReports: any[];
  hideCellLinks: boolean;
  resetFilters: boolean;
  shouldPage: boolean;
  showPaginationControls: boolean;
  setSelectColumnPanel;
  selectColumnPanel;
  setResetFilters: (value: boolean) => void;
  pageSize: number;
  setFiltersActive: (value: boolean) => void;
};

const customFormat = (stringValue, decimalPlaces) => {
  // if block is to show "-$123,123.23" instead of "$-123,123.23"
  const absVal = Math.abs(stringValue);
  let returnString = '$' + absVal.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (Number(stringValue) < 0) {
    returnString = '-' + returnString;
  }
  return returnString;
};

const DataTable: FunctionComponent<DataTableProps> = ({
  rawData,
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
  pageSize,
  setFiltersActive,
}) => {
  console.log(rawData);
  const allColumns = rawData.meta
    ? Object.entries(rawData.meta.labels).map(([field, label]) => {
        if (field === 'record_date') {
          return {
            accessorKey: field,
            header: label,
            filterFn: 'equalsString',
            cell: ({ getValue }) => {
              return moment(getValue()).format('M/D/YYYY');
            },
          } as ColumnDef<any, any>;
        } else if (rawData.meta.dataTypes[field] === 'DATE') {
          return {
            accessorKey: field,
            header: label,
            cell: ({ getValue }) => {
              return moment(getValue()).format('M/D/YYYY');
            },
          } as ColumnDef<any, any>;
        } else if (rawData.meta.dataTypes[field] === 'NUMBER') {
          return {
            accessorKey: field,
            header: label,
            cell: ({ getValue }) => {
              return numberFormatter.format(getValue());
            },
          } as ColumnDef<any, any>;
        } else if (rawData.meta.dataTypes[field] === 'PERCENTAGE') {
          return {
            accessorKey: field,
            header: label,
            cell: ({ getValue }) => {
              return `${getValue()}%`;
            },
          } as ColumnDef<any, any>;
        } else if (rawData.meta.dataTypes[field] === 'SMALL_FRACTION') {
          return {
            accessorKey: field,
            header: label,
            cell: ({ getValue }) => {
              return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format(getValue());
            },
          } as ColumnDef<any, any>;
        } else if (rawData.meta.dataTypes[field] === 'CURRENCY') {
          return {
            accessorKey: field,
            header: label,
            cell: ({ getValue }) => {
              return currencyFormatter.format(getValue());
            },
          } as ColumnDef<any, any>;
        } else if (rawData.meta.dataTypes[field].includes('CURRENCY') && /\d/.test(rawData.meta.dataTypes[field].split('CURRENCY')[1])) {
          const decimalPlaces = parseInt(rawData.meta.dataTypes[field].split('CURRENCY')[1]);
          return {
            accessorKey: field,
            header: label,
            cell: ({ getValue }) => {
              return customFormat(getValue(), decimalPlaces);
            },
          } as ColumnDef<any, any>;
        } else if (rawData.meta.dataTypes[field] === 'STRING') {
          return {
            accessorKey: field,
            header: label,
            cell: ({ getValue }) => {
              if (getValue().includes('%')) {
                return getValue().replace(/-/g, '\u2011');
              } else {
                return getValue();
              }
            },
          } as ColumnDef<any, any>;
        }
        return { accessorKey: field, header: label } as ColumnDef<any, any>;
      })
    : [];
  const data = rawData.data;

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
  const [columns] = useState(() => [...allColumns]);

  const dataTypes = rawData.meta.dataTypes;

  const [sorting, setSorting] = useState<SortingState>([]);

  const defaultInvisibleColumns = {};
  const [columnVisibility, setColumnVisibility] = useState(defaultSelectedColumns ? defaultInvisibleColumns : {});

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

  const getSortedColumnsData = table => {
    const columns = table.getVisibleFlatColumns();
    const mapped = columns.map(column => ({
      id: column.id,
      sorted: column.getIsSorted(),
      filterValue: column.getFilterValue(),
      rowValues: table.getFilteredRowModel().flatRows.map(row => row.original[column.id]),
      allColumnsSelected: table.getIsAllColumnsVisible(),
    }));
    setTableColumnSortData(mapped);
  };

  useEffect(() => {
    getSortedColumnsData(table);
  }, [sorting, columnVisibility, table.getFilteredRowModel()]);

  useEffect(() => {
    if (resetFilters) {
      table.resetColumnFilters();
      table.resetSorting();
      setResetFilters(false);
    }
  }, [resetFilters]);

  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);

  // We need to be able to access the accessorKey (which is a type violation) hence the ts ignore
  if (defaultSelectedColumns) {
    for (const column of allColumns) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!defaultSelectedColumns.includes(column.accessorKey)) {
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
    if (defaultSelectedColumns) {
      constructDefaultColumnsFromTableData();
    }
  }, []);

  return (
    <>
      <div data-test-id="table-content" className={overlayContainerNoFooter}>
        <div className={selectColumnsWrapper}>
          <div className={tableStyle}>
            <div data-test-id="table-content" className={tableContainer}>
              <StickyTable height={521}>
                <table>
                  <DataTableHeader table={table} dataTypes={dataTypes} resetFilters={resetFilters} setFiltersActive={setFiltersActive} />
                  <DataTableBody table={table} dataTypes={dataTypes} />
                </table>
              </StickyTable>
            </div>
          </div>
          <div className={selectColumnPanel ? selectColumnPanelActive : selectColumnPanelInactive} data-testid="selectColumnsMainContainer">
            {defaultSelectedColumns && (
              <DataTableColumnSelector
                fields={allColumns}
                resetToDefault={() => setColumnVisibility(defaultInvisibleColumns)}
                setSelectColumnPanel={setSelectColumnPanel}
                defaultSelectedColumns={defaultSelectedColumns}
                table={table}
                additionalColumns={additionalColumns}
                defaultColumns={defaultColumns}
              />
            )}
          </div>
        </div>
      </div>
      {shouldPage && <DataTableFooter table={table} showPaginationControls={showPaginationControls} />}
    </>
  );
};

export default DataTable;
