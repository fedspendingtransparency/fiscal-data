import React, { FunctionComponent } from 'react';
import {
  buttonContainer,
  buttonSleeve,
  optionName,
  optionSecondary,
} from '../../../data-preview/data-preview-filter-section/data-preview-mobile-filter-list/data-preview-mobile-filter-list.module.scss';

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
    <div data-testid="test" className={buttonContainer}>
      {filterOptions.map(filterOption => {
        return (
          <div className={buttonSleeve}>
            <button>
              <span className={optionName}>{filterOption.name}</span>
              <span className={optionSecondary}>{filterOption.secondary}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DataPreviewMobileFilterList;
