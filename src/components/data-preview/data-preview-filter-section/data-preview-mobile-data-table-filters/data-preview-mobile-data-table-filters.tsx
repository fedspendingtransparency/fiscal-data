import React from 'react';
import DataPreviewPivotSelect from '../../data-preview-pivot-select/data-preview-pivot-select';

// export interface IMobileFilterList {
//   pivotOptions: { name: string }[];
//   table;
//   pivotToApply;
//   setPivotToApply;
//   tableViewSelection;
//   setTableViewSelection;
// }

const DataPreviewMobileDataTableFilters = ({ tableToApply, pivotToApply, setPivotToApply, tableViewSelection, setTableViewSelection }) => {
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
