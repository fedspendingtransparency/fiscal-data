import React, { FunctionComponent } from 'react';
import {
  active,
  buttonSleeve,
  left,
  optionName,
  optionSecondary,
  right,
  selected,
} from '../../../data-preview/data-preview-filter-section/data-preview-mobile-filter-list/data-preview-mobile-filter-list.module.scss';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { underlineMatchedString } from '../../../search-bar/search-bar-helper';

// export const placeholderFilters = [
//   { name: 'Record Date', secondary: 'Last 5 years', selected: false, active: true },
//   { name: 'Parent ID', secondary: 'No filter applied', selected: false, active: false },
//   { name: 'Classification ID', secondary: 'No filter applied', selected: false, active: false },
//   { name: 'Classification Description', secondary: 'No filter applied', selected: false, active: false },
//   { name: 'Record Type Code', secondary: 'No filter applied', selected: false, active: false },
//   { name: 'Current Month Budget Amount', secondary: 'No filter applied', selected: false, active: false },
// ];

export interface IMobileFilterList {
  filterOptions: { name: string; secondary?: string; selected?: boolean; active?: boolean }[];
  onTableSelected?: (selectedOption: any) => void;
  onDataTableSelected?: (selectedOption: any) => void;
  onIsFilterSelected?: (selectedOption: any) => void;
  onWhichFilterSelected?: (selectedOption: any) => void;
  getName: (option: any) => string;
  getSecondary: (option: any) => string;
  selectedTable: string;
  selectedFilter: string;
  filter: string;
}

const DataPreviewMobileFilterList: FunctionComponent<IMobileFilterList> = ({
  filterOptions,
  onTableSelected,
  onDataTableSelected,
  onIsFilterSelected,
  onWhichFilterSelected,
  getName,
  getSecondary = option => option.secondary,
  selectedTable = '',
  selectedFilter = '',
  filter,
}) => {
  return (
    <>
      {filterOptions.map((filterOption, index) => {
        return (
          <div key={index}>
            <button
              className={`${buttonSleeve} ${getName(filterOption) === selectedTable ? selected : ''} ${
                getName(filterOption) === selectedFilter ? active : ''
              }`}
              onClick={() => {
                onDataTableSelected?.(filterOption);
                onTableSelected?.(filterOption);
                onIsFilterSelected?.(filterOption);
                onWhichFilterSelected?.(filterOption);
              }}
            >
              <div className={left}>
                <span className={optionName}>{underlineMatchedString(getName(filterOption), filter)}</span>
                {getSecondary(filterOption) && <span className={optionSecondary}>{underlineMatchedString(getSecondary(filterOption)!, filter)}</span>}
              </div>
              <div className={right}>
                <FontAwesomeIcon icon={faCaretRight} />
              </div>
            </button>
          </div>
        );
      })}
    </>
  );
};

export default DataPreviewMobileFilterList;
