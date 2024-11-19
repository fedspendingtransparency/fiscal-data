import { Table } from '@tanstack/react-table';

export interface IDataTableHeader {
  table: Table<Record<string, unknown>>;
  dataTypes: { [key: string]: string };
  resetFilters: boolean;
  manualPagination: boolean;
  allActiveFilters: string[];
  setAllActiveFilters: (value: string[]) => void;
  disableDateRangeFilter: boolean;
}
