import {
  bottomContainer,
  button,
  checkIcon,
  filterContainer,
  filterName,
  isApplied,
  left,
  mainContainer,
  navContainer,
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

  return (
    <div className={mainContainer}>
      <div className={`${navContainer} secondaryNavContainer`}>
        {/*{!scrollToTop && <ScrollTarget name="table-of-contents" />}*/}
        {shouldTocShow}
        {shouldTocShow && (
          <div key={1}>
            <h3>
              <FontAwesomeIcon icon={faCaretLeft} />
              Data Preview
            </h3>
            {/*below elements need to be left-aligned*/}
            <div className={topContainer}>
              <h3>Filters</h3>
              <div>
                <SearchBar label={'Search filters'} onChange={onSearchBarChange} filter={'test'} />
              </div>
            </div>
            {/*below div is for filter options*/}
            <div className={filterContainer}>
              <div className={left}>
                <p className={filterName}>Record Date</p>
                <p className={isApplied}>Last 5 years</p>
              </div>
              <div className={right}>
                <FontAwesomeIcon icon={faCaretRight} />
              </div>
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
