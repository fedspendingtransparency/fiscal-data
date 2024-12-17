interface IPivotField {
  field: string;
  type: string;
}

interface IFilterValue {
  key: string;
  operator: string;
  value: string;
}

export interface IPivotView {
  title: string;
  aggregateOn: IPivotField[] | null;
  charType: string | null;
  dimensionField: string | null;
  filters: IFilterValue[] | null;
  lastRowSnapshot: boolean | null;
  roundingDenomination: string | null;
  uniquePivotValues;
}
