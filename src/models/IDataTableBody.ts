import { Table } from '@tanstack/react-table';

export interface IDataTableBody {
  table: Table<Record<string, unknown>>;
  dataTypes: { [key: string]: string };
  allowColumnWrap: string[];
  detailViewConfig?: {
    apiId: number;
    dateRangeLockCopy: string;
    field: string;
    secondaryField?: string;
    selectColumns: string[];
    summaryTableFields: string[];
  };
  setDetailViewState: (val: { value: string; secondary: string }) => void;
  setSummaryValues: (val: { field: string }[]) => void;
}
