import { IPivotOption } from './IPivotOption';
import { IDatasetApi } from '../IDatasetApi';

export interface IPivotSelect {
  table: IDatasetApi;
  pivotToApply: IPivotOption;
  setPivotToApply: (pivot: IPivotOption) => void;
  pivotsUpdated: boolean;
  tableViewSelection: string;
  setTableViewSelection: (view: string) => void;
}
