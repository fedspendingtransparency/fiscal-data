import { SortingState } from '@tanstack/react-table';

interface IColumnConfig {
  property: string;
  name: string;
  type: string;
}

interface ITableProps {
  shouldPage: boolean;
  data;
  columnConfig: IColumnConfig[];
  customFormatting?;
  chartTable?: boolean;
  aria?: string;
  apiError?: boolean;
  tableName?: string;
  caption?: string;
}

export interface IFilteredTableProps {
  tableProps: ITableProps;
  perPage?: number;
  manualPagination?: boolean;
  allowColumnWrap?: string[];
  sorting: SortingState;
  setSorting: (value: SortingState) => void;
  resetFilters?: boolean;
  setResetFilters?: (value: boolean) => void;
  allActiveFilters?: string[];
  setAllActiveFilters?: (value: string[]) => void;
  enableDownload?: boolean;
}
