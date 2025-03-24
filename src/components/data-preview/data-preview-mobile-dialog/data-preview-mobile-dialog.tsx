import {
  bottomContainer,
  button,
  checkIcon,
  dataPreviewHeader,
  filterContainer,
  filterName,
  isApplied,
  left,
  mainContainer,
  navContainer,
  previewCaret,
  right,
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
  ];

  return (
    <div className={mainContainer}>
      <div className={`${navContainer} secondaryNavContainer`}>
        {/*{!scrollToTop && <ScrollTarget name="table-of-contents" />}*/}
        {shouldTocShow}
        {shouldTocShow && (
          <div>
            <div className={dataPreviewHeader}>
              <button>
                <FontAwesomeIcon icon={faCaretLeft} className={previewCaret} />
                Data Preview
              </button>
            </div>
            {/*below elements need to be left-aligned*/}
            <div className={topContainer}>
              <h3>Filters</h3>
              <div>
                <SearchBar label={'Search filters'} onChange={onSearchBarChange} filter={''} />
              </div>
            </div>
            {/*below div is for filter options*/}
            <div>
              {placeholderFilters.map((filter, index) => (
                <div key={index} className={filterContainer}>
                  <div className={left}>
                    <p className={filterName}>{filter.filterName}</p>
                    <p className={isApplied}>{filter.filterApplied}</p>
                  </div>
                  <div className={right}>
                    <FontAwesomeIcon icon={faCaretRight} />
                  </div>
                </div>
              ))}
            </div>
            {/*below div is for apply/cancel block - add box shadow above*/}
            <div className={bottomContainer}>
              <Link to="/api-documentation/" className={button} data-testid={'button-link'}>
                <FontAwesomeIcon icon={faCheck} className={checkIcon} />
                Apply
              </Link>
              <h4>
                <u>Cancel</u>
              </h4>
            </div>
            {/*<div*/}
            {/*  role="presentation"*/}
            {/*  // onMouseEnter={() => handleMouseEnter(1)}*/}
            {/*  // onMouseLeave={handleMouseLeave}*/}
            {/*  className={`${linkContainer}`}*/}
            {/*></div>*/}
          </div>
        )}
      </div>
      {/*<div className={`${navigableContent} ${shouldContentShow ? '' : 'hidden'}`}>TEST TEXT</div>*/}
      {/*<TOCButton handleToggle={handleInteraction} state={tocIsOpen} />*/}
    </div>
  );
};
export default DataPreviewMobileDialog;
