import { SortingState } from '@tanstack/react-table';

interface IColumnConfig {
  property: string;
  name: string;
  type: string;
}

interface ITableProps {
  dateRange;
  hideColumns?: string[];
  hasPublishedReports: boolean;
  publishedReports;
  shouldPage: boolean;
  columnConfig: IColumnConfig[];
  customFormatting?;
  aria?: string;
  tableName?: string;
}

export interface IDataTableProps {
  // defaultSelectedColumns will be null unless the dataset has default columns specified in the dataset config
  setTableColumnSortData;
  hideCellLinks: boolean;
  resetFilters: boolean;
  showPaginationControls: boolean;
  setSelectColumnPanel;
  selectColumnPanel;
  setResetFilters: (value: boolean) => void;
  pagingProps;
  manualPagination: boolean;
  rowsShowing: { begin: number; end: number };
  detailColumnConfig?;
  detailView?;
  detailViewAPI?;
  setDetailViewState?: (val: { value?: string; secondary?: string }) => void;
  detailViewState?: { value?: string; secondary?: string };
  allowColumnWrap?: string[];
  pivotSelected;
  setSummaryValues?;
  sorting: SortingState;
  setSorting: (value: SortingState) => void;
  allActiveFilters: string[];
  setAllActiveFilters: (value: string[]) => void;
  setTableSorting?: (value: SortingState) => void;
  datasetName: string;
  disableDateRangeFilter: boolean;
  tableProps: ITableProps;
}
