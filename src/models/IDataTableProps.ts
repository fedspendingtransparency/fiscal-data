export interface IDataTableProps {
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
  hideColumns?: string[];
  pagingProps;
  manualPagination: boolean;
  rowsShowing: { begin: number; end: number };
  columnConfig?;
  detailColumnConfig?;
  detailView?;
  detailViewAPI?;
  setDetailViewState?: (val: { value?: string; secondary?: string }) => void;
  detailViewState?: { value?: string; secondary?: string };
  allowColumnWrap?: string[];
  aria;
  pivotSelected;
  setSummaryValues?;
  customFormatting?;
  sorting: SortingState;
  setSorting: (value: SortingState) => void;
  allActiveFilters: string[];
  setAllActiveFilters: (value: string[]) => void;
  setTableSorting?: (value: SortingState) => void;
  disableDateRangeFilter: boolean;
}