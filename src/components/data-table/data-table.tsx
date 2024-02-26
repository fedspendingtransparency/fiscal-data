import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  SortingState,
  Table,
} from '@tanstack/react-table';
import DataTableFooter from './data-table-footer/data-table-footer';
import {
  rawDataTableContainer,
  nonRawDataTableContainer,
  tableStyle,
  overlayContainerNoFooter,
  selectColumnPanelActive,
  selectColumnPanelInactive,
  selectColumnsWrapper,
  slideFadeInRight,
  slideFadeInLeft,
  slideFadeOutRight,
  slideFadeOutLeft,
} from './data-table.module.scss';
import DataTableHeader from './data-table-header/data-table-header';
import DataTableColumnSelector from './column-select/data-table-column-selector';
import DataTableBody from './data-table-body/data-table-body';
import { columnsConstructorData, columnsConstructorGeneric, getSortedColumnsData, modifiedColumnsDetailView } from './data-table-helper';
import { useSetRecoilState } from 'recoil';
import { reactTableSortingState } from '../../recoil/reactTableFilteredState';
import { basicFetch, apiPrefix, buildSortParams, MAX_PAGE_SIZE } from '../../utils/api-utils';

type DataTableProps = {
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  rawData;
  nonRawDataColumns?;
  defaultSelectedColumns: string[];
  setTableColumnSortData;
  hasPublishedReports: boolean;
  publishedReports;
  hideCellLinks: boolean;
  resetFilters: boolean;
  shouldPage: boolean;
  showPaginationControls: boolean;
  setSelectColumnPanel;
  selectColumnPanel;
  setResetFilters: (value: boolean) => void;
  tableName: string;
  setFiltersActive: (value: boolean) => void;
  hideColumns?: string[];
  pagingProps;
  manualPagination: boolean;
  rowsShowing: { begin: number; end: number };
  columnConfig?;
  detailColumnConfig?;
  detailView?;
  detailViewAPI?;
  setDetailViewState?: (val: string) => void;
  detailViewState?: string;
  allowColumnWrap?: string[];
  aria;
  pivotSelected;
  setSummaryValues?;
  customFormatting?;
};

const DataTable: FunctionComponent<DataTableProps> = ({
  rawData,
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
  setFiltersActive,
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
}) => {
  const detailViewEndpoint: string = detailViewAPI ? detailViewAPI.endpoint : null;
  const [selectedDetailView, setSelectedDetailView] = useState('');
  const [configOption, setConfigOption] = useState(columnConfig);
  const [tableData, setTableData] = useState(rawData);
  const [animationClassIn, setAnimationClassIn] = useState('');
  const [animationClassOut, setAnimationClassOut] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [nextTableData, setNextTableData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!!selectedDetailView) {
        const sortParam = buildSortParams(detailViewAPI);
        const res = await basicFetch(
          `${apiPrefix}${detailViewEndpoint}?filter=${detailView.columnId}:eq:${selectedDetailView}&sort=${sortParam}&page[size]=${MAX_PAGE_SIZE}`
        );
        setTableData({ data: res.data, meta: res.meta });
        setConfigOption(detailColumnConfig);
      } else {
        setTableData(rawData);
        setConfigOption(columnConfig);
      }
    };
    fetchData();
  }, [selectedDetailView]);

  const handleClick = (e, columnValue) => {
    e.preventDefault();
    setSelectedDetailView(columnValue);
    setSummaryValues(rawData.data.find(data => data[detailView?.columnId] === columnValue));
    if (setDetailViewState) {
      setDetailViewState(columnValue);
    }
  };

  useEffect(() => {
    if (!detailViewState) {
      setSelectedDetailView(null);
}
  }, [detailViewState]);

  useEffect(() => {
    if (rawData) {
      setTableData(rawData);
      setConfigOption(columnConfig);
    }
  }, [rawData]);

  const allColumns = React.useMemo(() => {
    const hideCols = selectedDetailView ? detailViewAPI.hideColumns : hideColumns;

    let baseColumns = nonRawDataColumns
      ? columnsConstructorGeneric(nonRawDataColumns)
      : columnsConstructorData(tableData, hideCols, tableName, configOption, customFormatting);

    baseColumns = modifiedColumnsDetailView(baseColumns, handleClick, detailView?.columnId);
    return baseColumns;
  }, [tableData, rawData, configOption]);

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

  if (tableData.meta) {
    dataTypes = tableData.meta.dataTypes;
  } else {
    const tempDataTypes = {};
    allColumns?.forEach(column => {
      tempDataTypes[column.property] = 'STRING';
    });
    dataTypes = tempDataTypes;
  }

  const [sorting, setSorting] = useState<SortingState>([]);
  const setTableSorting = useSetRecoilState(reactTableSortingState);
  const defaultInvisibleColumns = {};
  const [columnVisibility, setColumnVisibility] = useState(
    defaultSelectedColumns && defaultSelectedColumns.length > 0 && !pivotSelected ? defaultInvisibleColumns : {}
  );
  const [allActiveFilters, setAllActiveFilters] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [additionalColumns, setAdditionalColumns] = useState([]);

  const table = useReactTable({
    columns: allColumns,
    data: tableData.data,
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

  const [currentDataTable, setCurrentDataTable] = useState(table);

  useEffect(() => {
    if(nextTableData) {
      setCurrentDataTable(nextTableData);
      setNextTableData(null);
      const timer = setTimeout(() => {

        setAnimationClassIn('');
        setAnimationClassOut('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nextTableData, currentDataTable]);

  useEffect(() => {
    if (hasMounted){
      if (detailViewState){
        setNextTableData(table)
        setAnimationClassOut(slideFadeOutLeft);
        setAnimationClassIn(slideFadeInRight);
      }
      else {
        setNextTableData(table);
        setAnimationClassIn(slideFadeInLeft);
        setAnimationClassOut(slideFadeOutRight);
      }
    }
  }, [detailViewState, nextTableData]);
  console.log('nextTableData  ',nextTableData, currentDataTable, table);
  useEffect(() => {
    if (resetFilters) {
      setTableColumnSortData(tableData.data);
    }
  }, [resetFilters, table]);

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
    getSortedColumnsData(table, setTableColumnSortData, hideColumns, dataTypes);
  }, [columnVisibility, table.getFilteredRowModel()]);

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

  useEffect(() => {
    if (defaultSelectedColumns && !pivotSelected) {
      constructDefaultColumnsFromTableData();
    }
  }, [tableData]);

  const selectColumnsRef = useRef(null);

  useEffect(() => {
    if (selectColumnPanel) {
      selectColumnsRef.current?.focus();
    }
  });
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  return (
    <>
      <div data-test-id="table-content" className={classNames([overlayContainerNoFooter])}>
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
          <div className={classNames(tableStyle, nextTableData ? animationClassOut : animationClassIn)} style={{ width: '100%', top: 0}}>
          {console.log('ONE')}
            <div data-test-id="table-content" className={nonRawDataColumns ? nonRawDataTableContainer : rawDataTableContainer}>
              <table {...aria}>
                <DataTableHeader
                  table={table}
                  dataTypes={dataTypes}
                  resetFilters={resetFilters}
                  setFiltersActive={setFiltersActive}
                  allActiveFilters={allActiveFilters}
                  setAllActiveFilters={setAllActiveFilters}
                  manualPagination={manualPagination}
                />
                <DataTableBody table={currentDataTable} dataTypes={dataTypes} allowColumnWrap={allowColumnWrap} />
              </table>
            </div>
          </div>
          {nextTableData && (
            <div className={classNames(tableStyle, nextTableData ? animationClassIn : animationClassOut)} style={{ position: 'absolute', width: '100%', top: 0}}>
              <div data-test-id="table-content" className={nonRawDataColumns ? nonRawDataTableContainer : rawDataTableContainer}>
              {console.log('TWO')}
                <table {...aria}>
                  <DataTableHeader
                    table={table}
                    dataTypes={dataTypes}
                    resetFilters={resetFilters}
                    setFiltersActive={setFiltersActive}
                    allActiveFilters={allActiveFilters}
                    setAllActiveFilters={setAllActiveFilters}
                    manualPagination={manualPagination}
                  />
                  <DataTableBody table={nextTableData} dataTypes={dataTypes} allowColumnWrap={allowColumnWrap} />
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      {shouldPage && (
        <DataTableFooter
          table={table}
          showPaginationControls={showPaginationControls}
          pagingProps={pagingProps}
          manualPagination={manualPagination}
          rowsShowing={rowsShowing}
        />
      )}
    </>
  );
};

export default DataTable;
