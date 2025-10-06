import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react';
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
  open,
  previewCaret,
  previewCaretButton,
  previewCaretContainer,
  searchBar as searchBarStyle,
  sectionHeader,
  topContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import SearchBar from '../../search-bar/search-bar';

interface IDataPreviewMobileDialog {
  onCancel: () => void;
  onBack: () => void;
  onApply?: () => void;
  setNoSearchResults?: (val: boolean) => void;
  filterComponent: ReactElement;
  filterName: string;
  searchText: string;
  backButtonText?: string;
  hasSearch?: boolean;
  bottomButton?: string;
  bottomButtonIcon?: IconProp;
  filter?: string;
  setFilter?: React.Dispatch<React.SetStateAction<string>>;
  active?: boolean;
}
const DataPreviewMobileDialog: FunctionComponent<IDataPreviewMobileDialog> = ({
  onCancel,
  onBack,
  onApply,
  setNoSearchResults,
  filter,
  setFilter,
  filterComponent,
  filterName,
  searchText,
  backButtonText = 'Data Preview',
  hasSearch = true,
  bottomButton = 'Apply',
  bottomButtonIcon = faCheck,
  active,
}) => {
  const [hide, setHide] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
  };

  const onClear = () => {
    setFilter('');
    if (setNoSearchResults) {
      setNoSearchResults(false);
    }
  };

  useEffect(() => {
    if (active) {
      setHide(active);
      setTimeout(() => {
        setStartAnimation(active);
      }, 100);
    } else {
      setStartAnimation(active);
      setTimeout(() => {
        setHide(active);
      }, 800);
    }
  }, [active]);

  return (
    <>
      <div className={`${mainContainer} ${startAnimation ? open : ''}`} style={hide ? null : { display: 'none' }} role="dialog">
        <>
          <div>
            <div className={dataPreviewHeader}>
              <button onClick={onBack} className={previewCaretButton}>
                <div className={previewCaretContainer}>
                  <FontAwesomeIcon icon={faCaretLeft} className={previewCaret} />
                </div>
                {backButtonText}
              </button>
            </div>
            <div className={topContainer}>
              <div className={sectionHeader}>{filterName}</div>
              {hasSearch && (
                <div data-testid="search-container" className={searchBarStyle}>
                  <SearchBar onChange={onSearchBarChange} filter={filter} label={searchText} handleClear={onClear} setFilter={setFilter} />
                </div>
              )}
            </div>
          </div>
          <div data-testid="filters-scroll-container" className={filtersScrollContainer}>
            {filterComponent}
          </div>
          <div className={bottomContainer}>
            <button className={applyButton} onClick={onApply}>
              <FontAwesomeIcon icon={bottomButtonIcon} className={checkIcon} />
              {bottomButton}
            </button>
            <button className={cancelButton} onClick={onCancel}>
              <u>Cancel</u>
            </button>
          </div>
        </>
      </div>
    </>
  );
};

export default DataPreviewMobileDialog;
