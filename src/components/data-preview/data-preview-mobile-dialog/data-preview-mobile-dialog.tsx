import {
  bottomContainer,
  button,
  cancelButton,
  checkIcon,
  dataPreviewHeader,
  filterContainer,
  filterName,
  isApplied,
  left,
  leftSelected,
  mainContainer,
  navContainer,
  previewCaret,
  right,
  searchBar,
  topContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import React from 'react';
import { Link } from 'gatsby';
import SearchBar from '../../../components/search-bar/search-bar';
import { faCaretLeft, faCaretRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DataPreviewMobileDialog = () => {
  const shouldTocShow = true;

  const onSearchBarChange = event => {
    // const val = event && event.target ? event.target.value : '';
    // filterHandler(val);
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
      <div className={`${navContainer} secondaryNavContainer`}>
        {shouldTocShow}
        {shouldTocShow && (
          <div>
            <div className={dataPreviewHeader}>
              {/*add onClick to trigger slide upon pressing 'back' button*/}
              <button>
                <FontAwesomeIcon icon={faCaretLeft} className={previewCaret} />
                Data Preview
              </button>
            </div>
            <div className={topContainer}>
              <h3>Filters</h3>
              <div className={searchBar}>
                <p>Search filters</p>
                <SearchBar onChange={onSearchBarChange} filter={''} />
              </div>
            </div>
            <div>
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
              <Link to="/" className={button} data-testid={'button-link'}>
                <FontAwesomeIcon icon={faCheck} className={checkIcon} />
                Apply
              </Link>
              <div className={cancelButton}>
                <button>
                  <u>Cancel</u>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DataPreviewMobileDialog;
