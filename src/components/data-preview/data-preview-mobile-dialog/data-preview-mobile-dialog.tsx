import React, {FunctionComponent, ReactElement, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretLeft, faCheck} from '@fortawesome/free-solid-svg-icons';
import {
  applyButton,
  bottomContainer,
  cancelButton,
  checkIcon,
  dataPreviewHeader,
  mainContainer,
  previewCaret,
  previewCaretButton,
  previewCaretContainer,
  searchBar as searchBarStyle,
  sectionHeader,
  topContainer,
} from '../../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import SearchContainer from '../../search-container/search-container';

interface IDataPreviewMobileDialog {
  onCancel: () => void;
  onBack: () => void;
  onApply: () => void;
  filterComponent: ReactElement;
  filterName: string;
  searchText: string;
  backButtonText: string;
  hasSearch?: boolean;
  bottomButton: string;
  bottomButtonIcon?: IconProp;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}
const DataPreviewMobileDialog: FunctionComponent<IDataPreviewMobileDialog> = ({
  onCancel,
  onBack,
  onApply,
  filter,
  setFilter,
  filterComponent,
  filterName,
  searchText,
  backButtonText = 'Data Preview',
  hasSearch = true,
  bottomButton = 'Apply',
  bottomButtonIcon = faCheck,
}) => {
  const shouldTocShow = true;
  const [noResults, setNoResults] = useState(false);
  // const { defaultColumns, additionalColumns, allColumns: fields, defaultSelectedColumns, tableState: table } = useContext(DataTableContext);

  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
  };

  const filterSelectList = (
    <>
      {noResults ? (
        <div>
          No match for <span>'{filter}'</span>. Please revise your search and try again.
        </div>
      ) : (
        filterComponent
      )}
    </>
  );

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
                {backButtonText}
              </button>
            </div>
            <div className={topContainer}>
              <div className={sectionHeader}>{filterName}</div>
              {hasSearch && (
                <div data-testid="search-container" className={searchBarStyle}>
                  <SearchContainer searchLabel={searchText} filter={filter} setFilter={setFilter} setNoResults={setNoResults}>
                    {/*<div className={filtersScrollContainer}>{filterSelectList}</div>*/}
                    {filterSelectList}
                  </SearchContainer>
                </div>
              )}
              {!hasSearch && filterComponent}
            </div>
          </div>
          {/*<div data-testid="filters-scroll-container" className={filtersScrollContainer}>*/}
          {/*  {filterSelectList}*/}
          {/*</div>*/}
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
      )}
    </div>
  );
};

export default DataPreviewMobileDialog;
