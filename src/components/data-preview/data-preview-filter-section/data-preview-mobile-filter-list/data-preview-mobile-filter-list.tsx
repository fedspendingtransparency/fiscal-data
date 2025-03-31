import React, { FunctionComponent } from 'react';

const placeholderFilters = [
  { name: 'Record Date', secondary: 'Last 5 years' },
  { name: 'Parent ID', secondary: 'No filter applied' },
  { name: 'Classification ID', secondary: 'No filter applied' },
  { name: 'Classification Description', secondary: 'No filter applied' },
  { name: 'Record Type Code', secondary: 'No filter applied' },
  { name: 'Current Month Budget Amount', secondary: 'No filter applied' },
];

export interface IMobileFilterList {
  filterOptions: { name: string; secondary?: string; selected?: boolean; active?: boolean }[];
}

const DataPreviewMobileFilterList: FunctionComponent<IMobileFilterList> = ({ filterOptions = placeholderFilters }) => {
  return (
    <>
      {filterOptions.map(filterOption => {
        return (
          <button>
            <span>{filterOption.name}</span>
            <span>{filterOption.secondary}</span>
          </button>
        );
      })}
    </>
  );
};

export default DataPreviewMobileFilterList;
