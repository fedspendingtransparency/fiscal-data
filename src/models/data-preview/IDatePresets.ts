import { IDatasetApi } from '../IDatasetApi';

export interface IDatePresets {
  currentDateButton: string;
  datePreset;
  customRangePreset;
  selectedTable: IDatasetApi;
  handleDateRangeChange;
  allTablesSelected: boolean;
  datasetDateRange;
  finalDatesNotFound;
  hidden: boolean;
}
