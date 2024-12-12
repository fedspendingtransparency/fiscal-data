export interface iPivotSelect {
  table;
  pivotToApply;
  setPivotToApply;
  pivotsUpdated: boolean;
  tableViewSelection: string;
  setTableViewSelection: (view: string) => void;
}
