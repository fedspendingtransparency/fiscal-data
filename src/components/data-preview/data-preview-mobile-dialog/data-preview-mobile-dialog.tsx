import React, { FunctionComponent } from 'react';
import SearchBar from '../../../components/search-bar/search-bar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCheck } from '@fortawesome/free-solid-svg-icons';

import {
  applyButton,
  bottomContainer,
  cancelButton,
  checkIcon,
  dataPreviewHeader,
  filtersScrollContainer,
  mainContainer,
  previewCaret,
  previewCaretButton,
  previewCaretContainer,
  searchBar as searchBarStyle,
  topContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';

interface IDataPreviewMobileDialog {
  onClose: () => void;
}
const DataPreviewMobileDialog: FunctionComponent<IDataPreviewMobileDialog> = ({ onClose, filterComponent }) => {
  const shouldTocShow = true;

  const onSearchBarChange = event => {
    // placeholder for search handler
  };

  return (
    <div className={mainContainer}>
      {shouldTocShow && (
        <>
          <div>
            <div className={dataPreviewHeader}>
              <button onClick={onClose} className={previewCaretButton}>
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
            {filterComponent}
          </div>
          <div className={bottomContainer}>
            <button className={applyButton}>
              <FontAwesomeIcon icon={faCheck} className={checkIcon} />
              Apply
            </button>
            <button className={cancelButton} onClick={onClose}>
              <u>Cancel</u>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DataPreviewMobileDialog;
