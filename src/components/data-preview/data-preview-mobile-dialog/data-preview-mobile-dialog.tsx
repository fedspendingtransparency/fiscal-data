import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';
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
import { DataTableContext } from '../data-preview-context';

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
  dialogState?: boolean;
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
  dialogState,
}) => {
  const { mobileOpen } = useContext(DataTableContext);
  const [shouldMove, setShouldMove] = useState(false);
  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
  };

  console.log('dialog state: ', dialogState);

  const onClear = () => {
    setFilter('');
    if (setNoSearchResults) {
      setNoSearchResults(false);
    }
  };

  // console.log('mobileOpen? ', mobileOpen);

  useEffect(() => {
    setShouldMove(dialogState);
  }, [dialogState]);

  return (
    <div className={`${mainContainer} ${shouldMove ? open : ''}`}>
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
  );
};

export default DataPreviewMobileDialog;
