import { IDatasetApi } from '../IDatasetApi';

export interface ITableFilters {
  selectedTable: IDatasetApi;
  setDateRange: (dateRange: { from: string; to: string }) => void;
  allTablesSelected: boolean;
  handleDateRangeChange: () => void;
  setIsCustomDateRange: (customDateRange: boolean) => void;
  finalDatesNotFound: boolean;
  detailApi;
  detailViewState?: { value?: string; secondary?: string };
  apiData;
  filterFields;
}
