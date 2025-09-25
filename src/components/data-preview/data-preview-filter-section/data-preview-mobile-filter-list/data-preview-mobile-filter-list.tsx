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

export interface IMobileFilterList {
  filterOptions: { name: string; secondary?: string; selected?: boolean; active?: boolean }[];
  onTableSelected?: (selectedOption: any) => void;
  onDataTableSelected?: (selectedOption: any) => void;
  onIsFilterSelected?: (selectedOption: any) => void;
  onWhichFilterSelected?: (selectedOption: any) => void;
  selectedTable: string;
  filter: string;
  optionLabelKey: string;
  secondaryLabelKey?: string;
}

const DataPreviewMobileFilterList: FunctionComponent<IMobileFilterList> = ({
  filterOptions,
  onTableSelected,
  onDataTableSelected,
  onIsFilterSelected,
  onWhichFilterSelected,
  optionLabelKey,
  secondaryLabelKey,
  selectedTable = '',
  filter,
}) => {
  return (
    <>
      {filterOptions &&
        filterOptions.map((filterOption, index) => {
          const displayName = filterOption[optionLabelKey];
          const subHeader = filterOption[secondaryLabelKey];
          const activeFilter = secondaryLabelKey && filterOption[secondaryLabelKey];
          return (
            <div key={index}>
              <button
                className={`${buttonSleeve} ${displayName === selectedTable ? selected : ''} ${activeFilter ? active : ''}`}
                onClick={() => {
                  onDataTableSelected?.(filterOption);
                  onTableSelected?.(filterOption);
                  onIsFilterSelected?.(filterOption);
                  onWhichFilterSelected?.(filterOption);
                }}
              >
                <div className={left}>
                  <span className={optionName}>{filter !== undefined ? underlineMatchedString(displayName, filter) : displayName}</span>
                  {secondaryLabelKey && <span className={optionSecondary}>{subHeader || 'No filter selected'}</span>}
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
