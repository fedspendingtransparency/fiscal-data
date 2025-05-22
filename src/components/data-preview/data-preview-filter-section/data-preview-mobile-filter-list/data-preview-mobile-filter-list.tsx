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
                {/*temp fix until we add search/filter functionality to data tables on mobile dialog*/}
                {filter !== undefined && (
                  <div>
                    <span className={optionName}>{underlineMatchedString(getName(filterOption), filter)}</span>
                    {getSecondary(filterOption) && (
                      <span className={optionSecondary}>{underlineMatchedString(getSecondary(filterOption)!, filter)}</span>
                    )}
                  </div>
                )}
                {filter === undefined && (
                  <div>
                    <span className={optionName}>{getName(filterOption)}</span>
                    {getSecondary(filterOption) && <span className={optionSecondary}>{getSecondary(filterOption)}</span>}
                  </div>
                )}
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
