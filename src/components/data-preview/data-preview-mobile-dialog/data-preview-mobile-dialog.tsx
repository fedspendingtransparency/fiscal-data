import React from 'react';
import SearchBar from '../../../components/search-bar/search-bar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faCheck } from '@fortawesome/free-solid-svg-icons';

import {
  applyButton,
  bottomContainer,
  cancelButton,
  checkIcon,
  dataPreviewHeader,
  filterContainer,
  filterName,
  filtersScrollContainer,
  isApplied,
  left,
  leftSelected,
  mainContainer,
  previewCaret,
  previewCaretButton,
  previewCaretContainer,
  right,
  searchBar as searchBarStyle,
  topContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';

const DataPreviewMobileDialog = () => {
  const shouldTocShow = true;

  const onSearchBarChange = event => {
    // placeholder for search handler
  };

  const placeholderFilters = [
    { filterName: 'Record Date', filterApplied: 'Last 5 years' },
    { filterName: 'Parent ID', filterApplied: 'No filter applied' },
    { filterName: 'Classification ID', filterApplied: 'No filter applied' },
    { filterName: 'Classification Description', filterApplied: 'No filter applied' },
    { filterName: 'Record Type Code', filterApplied: 'No filter applied' },
    { filterName: 'Current Month Budget Amount', filterApplied: 'No filter applied' },
  ];

  return (
    <div className={mainContainer}>
      {shouldTocShow && (
        <>
          <div>
            <div className={dataPreviewHeader}>
              <button className={previewCaretButton}>
                <div className={previewCaretContainer}>
                  <FontAwesomeIcon icon={faCaretLeft} className={previewCaret} />
                </div>
                Data Preview
              </button>
            </div>
            <div className={topContainer}>
              <h3>Filters</h3>
              <div data-testid="search-container" className={searchBarStyle}>
                <p>Search filters</p>
                <SearchBar onChange={onSearchBarChange} filter={''} />
              </div>
            </div>
          </div>

          <div data-testid="filters-scroll-container" className={filtersScrollContainer}>
            {placeholderFilters.map((filter, index) => (
              <div key={index} className={filterContainer}>
                <div className={filter.filterApplied !== 'No filter applied' ? leftSelected : left}>
                  <p className={filterName}>{filter.filterName}</p>
                  <p className={isApplied}>{filter.filterApplied}</p>
                </div>
                <div className={right}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </div>
              </div>
            ))}
          </div>

          <div className={bottomContainer}>
            <button className={applyButton}>
              <FontAwesomeIcon icon={faCheck} className={checkIcon} />
              Apply
            </button>
            <div>
              <button className={cancelButton}>
                <u>Cancel</u>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataPreviewMobileDialog;
