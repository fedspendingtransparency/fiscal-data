import { IDatasetApi } from '../IDatasetApi';

export interface IDatePresets {
  currentDateButton: string;
  datePreset;
  customRangePreset;
  selectedTable: IDatasetApi;
  apiData;
  handleDateRangeChange;
  allTablesSelected: boolean;
  datasetDateRange;
  finalDatesNotFound;
  hideButtons;
  hidden: boolean;
}
