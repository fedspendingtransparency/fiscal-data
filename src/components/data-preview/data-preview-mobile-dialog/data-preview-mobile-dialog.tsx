import {
  applyCancelContainer,
  button,
  checkIcon,
  mainContainer,
  navContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import React from 'react';
import { Link } from 'gatsby';
import SearchBar from '../../../components/search-bar/search-bar';
import { faCaretLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
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
            <div>
              <h3>Filters</h3>
              <p>Search filters</p>
              <div>
                <SearchBar onChange={onSearchBarChange} filter={'test'} />
              </div>
            </div>
            {/*below div is for filter options*/}
            <div>
              <h3>Filter #1 test</h3>
              <h3>Filter #2 test</h3>
            </div>
            {/*below div is for apply/cancel block - add box shadow above*/}
            <div className={applyCancelContainer}>
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
