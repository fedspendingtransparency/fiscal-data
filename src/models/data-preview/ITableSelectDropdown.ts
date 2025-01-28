import { IDatasetApi } from '../IDatasetApi';
import { IPivotOption } from './IPivotOption';

export interface ITableSelectDropdown {
  apis: IDatasetApi[];
  selectedTable: IDatasetApi;
  setSelectedTable: (table: IDatasetApi) => void;
  allTablesSelected: boolean;
  earliestDate: string;
  latestDate: string;
  disableAllTables: boolean;
  selectedPivot: IPivotOption;
  setSelectedPivot: (pivot: IPivotOption) => void;
  hideDropdown: boolean;
}
