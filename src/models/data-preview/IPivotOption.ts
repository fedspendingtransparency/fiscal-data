import { IPivotView } from './IPivotView';
import { IPivotValue } from './IPivotValue';

export interface IPivotOption {
  pivotView: IPivotView | null;
  pivotValue: IPivotValue;
}
