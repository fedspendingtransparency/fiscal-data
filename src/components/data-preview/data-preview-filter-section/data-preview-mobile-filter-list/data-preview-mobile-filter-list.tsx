import React, { FunctionComponent } from 'react';
import {
  active,
  left,
  optionName,
  optionSecondary,
  right,
  selected,
} from '../../../data-preview/data-preview-filter-section/data-preview-mobile-filter-list/data-preview-mobile-filter-list.module.scss';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const placeholderFilters = [
  { name: 'Record Date', secondary: 'Last 5 years', selected: false, active: true },
  { name: 'Parent ID', secondary: 'No filter applied', selected: false, active: false },
  { name: 'Classification ID', secondary: 'No filter applied', selected: false, active: false },
  { name: 'Classification Description', secondary: 'No filter applied', selected: false, active: false },
  { name: 'Record Type Code', secondary: 'No filter applied', selected: false, active: false },
  { name: 'Current Month Budget Amount', secondary: 'No filter applied', selected: false, active: false },
];

export const placeholderDataTables = [
  { name: 'All Data Tables (Download Only)', secondary: null, selected: true, active: false },
  { name: 'Summary of Receipts, Outlays, and the Deficit/Surplus of the U.S. Government', secondary: null, selected: false, active: false },
  { name: 'Summary of Budget and Off-Budget Results and Financing of the U.S. Government', secondary: null, selected: false, active: false },
];

export interface IMobileFilterList {
  filterOptions: { name: string; secondary?: string; selected?: boolean; active?: boolean }[];
  onClick: () => void;
}

const DataPreviewMobileFilterList: FunctionComponent<IMobileFilterList> = ({ filterOptions = placeholderFilters, onClick }) => {
  return (
    <>
      {filterOptions.map((filterOption, index) => {
        return (
          <div key={index}>
            <button className={`${filterOption.selected ? selected : ''} ${filterOption.active ? active : ''}`} onClick={onClick}>
              <div className={left}>
                <span className={optionName}>{filterOption.name}</span>
                {filterOption.secondary && <span className={optionSecondary}>{filterOption.secondary}</span>}
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
