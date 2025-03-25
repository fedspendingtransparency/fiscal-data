import React from 'react';
import { Link } from 'gatsby';
import SearchBar from '../../../components/search-bar/search-bar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faCheck } from '@fortawesome/free-solid-svg-icons';

import {
  mainContainer,
  dataPreviewHeader,
  topContainer,
  searchBar as searchBarStyle,
  filterContainer,
  left,
  leftSelected,
  filterName,
  isApplied,
  right,
  bottomContainer,
  button,
  cancelButton,
  filtersScrollContainer,
  previewCaret,
  checkIcon,
  headerContainer,
  previewCaretContainer,
  previewCaretButton,
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
          <div className={headerContainer}>
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
              <div className={searchBarStyle}>
                <p>Search filters</p>
                <SearchBar onChange={onSearchBarChange} filter={''} />
              </div>
            </div>
          </div>

          <div className={filtersScrollContainer}>
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
            <Link to="/" className={button} data-testid="button-link">
              <FontAwesomeIcon icon={faCheck} className={checkIcon} />
              Apply
            </Link>
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
