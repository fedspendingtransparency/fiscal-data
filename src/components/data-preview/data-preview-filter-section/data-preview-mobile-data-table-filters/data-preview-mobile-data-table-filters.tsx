import React, { FunctionComponent } from 'react';
import DataPreviewPivotSelect from '../../data-preview-pivot-select/data-preview-pivot-select';

export interface IMobileDataTableFilters {
  pivotOptions: { name: string }[];
  tableToApply;
  pivotToApply;
  setPivotToApply;
  tableViewSelection;
  setTableViewSelection;
}

const DataPreviewMobileDataTableFilters: FunctionComponent<IMobileDataTableFilters> = ({
  tableToApply,
  pivotToApply,
  setPivotToApply,
  tableViewSelection,
  setTableViewSelection,
}) => {
  return (
    <>
      <DataPreviewPivotSelect
        table={tableToApply}
        pivotToApply={pivotToApply}
        setPivotToApply={setPivotToApply}
        tableViewSelection={tableViewSelection}
        setTableViewSelection={setTableViewSelection}
      />
    </>
  );
};

export default DataPreviewMobileDataTableFilters;
