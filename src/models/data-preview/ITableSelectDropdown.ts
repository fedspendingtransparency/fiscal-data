import { IDatasetApi } from '../IDatasetApi';
import { IPivotOption } from './IPivotOption';

export interface ITableSelectDropdown {
  apis: IDatasetApi[];
  earliestDate: string;
  latestDate: string;
  disableAllTables: boolean;
  hideDropdown: boolean;
}
