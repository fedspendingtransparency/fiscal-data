import React, {FunctionComponent, ReactElement} from 'react';
import SearchBar from '../../../components/search-bar/search-bar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretLeft, faCheck} from '@fortawesome/free-solid-svg-icons';

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
  sectionHeader,
  topContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

interface IDataPreviewMobileDialog {
  onCancel: () => void;
  onBack: () => void;
  filterComponent: ReactElement;
  filterName: string;
  searchText: string;
  previousPageText: string;
  hasSearch?: boolean;
  bottomButton: string;
  bottomButtonIcon?: IconProp;
  onBottomButtonClick: () => void;
}
const DataPreviewMobileDialog: FunctionComponent<IDataPreviewMobileDialog> = ({
  onCancel,
  onBack,
  filterComponent,
  filterName,
  searchText,
  previousPageText,
  hasSearch = true,
  bottomButton = 'Apply',
  onBottomButtonClick,
  bottomButtonIcon = faCheck,
}) => {
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
              <button onClick={onBack} className={previewCaretButton}>
                <div className={previewCaretContainer}>
                  <FontAwesomeIcon icon={faCaretLeft} className={previewCaret} />
                </div>
                {previousPageText}
              </button>
            </div>
            <div className={topContainer}>
              <div className={sectionHeader}>{filterName}</div>
              {hasSearch && (
                <div data-testid="search-container" className={searchBarStyle}>
                  <p>{searchText}</p>
                  <SearchBar onChange={onSearchBarChange} filter={''} />
                </div>
              )}
            </div>
          </div>
          <div data-testid="filters-scroll-container" className={filtersScrollContainer}>
            {filterComponent}
          </div>
          <div className={bottomContainer}>
            <button className={applyButton} onClick={onBottomButtonClick}>
              <FontAwesomeIcon icon={bottomButtonIcon} className={checkIcon} />
              {bottomButton}
            </button>
            <button className={cancelButton} onClick={onCancel}>
              <u>Cancel</u>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DataPreviewMobileDialog;
