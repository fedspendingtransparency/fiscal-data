import { IDatasetApi } from '../IDatasetApi';
import { IDatasetConfig } from '../IDatasetConfig';

export interface ITableFilters {
  selectedTable: IDatasetApi;
  config: IDatasetConfig;
  setDateRange: (dateRange: { from: string; to: string }) => void;
  allTablesSelected: boolean;
  handleDateRangeChange: () => void;
  setIsCustomDateRange: (customDateRange: boolean) => void;
  finalDatesNotFound: boolean;
  detailApi;
  detailViewState?: { value?: string; secondary?: string };
  apiData;
}
