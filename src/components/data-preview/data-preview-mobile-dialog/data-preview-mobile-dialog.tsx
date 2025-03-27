import React, { FunctionComponent } from 'react';
import SearchBar from '../../../components/search-bar/search-bar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

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
  dataPreviewHeaderContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';

interface iDataPreviewMovileDialog {
  onClose: () => void;
  backButtonTitle: string;
  headerName: string;
  bottomButton: string;
  bottomButtonIcon: any;
  hasSearch: boolean;
  tableList: any;
  onBottomButtonClick?: () => void;
}
const DataPreviewMobileDialog: FunctionComponent<iDataPreviewMovileDialog> = ({
  onClose,
  backButtonTitle,
  headerName,
  bottomButton,
  bottomButtonIcon,
  hasSearch,
  tableList,
  onBottomButtonClick,
}) => {
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
          <div className={dataPreviewHeaderContainer}>
            <div className={dataPreviewHeader}>
              <button onClick={onClose} className={previewCaretButton}>
                <div className={previewCaretContainer}>
                  <FontAwesomeIcon icon={faCaretLeft} className={previewCaret} />
                </div>
                {backButtonTitle}
              </button>
            </div>
            <div className={topContainer}>
              <h3>{headerName}</h3>
              {hasSearch && (
                <div data-testid="search-container" className={searchBarStyle}>
                  <p>Search filters</p>
                  <SearchBar onChange={onSearchBarChange} filter={''} />
                </div>
              )}
            </div>
          </div>

          <div data-testid="filters-scroll-container" className={filtersScrollContainer}>
            {tableList}
          </div>

          <div className={bottomContainer}>
            <button className={applyButton} onClick={onBottomButtonClick}>
              <FontAwesomeIcon icon={bottomButtonIcon} className={checkIcon} />
              {bottomButton}
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
