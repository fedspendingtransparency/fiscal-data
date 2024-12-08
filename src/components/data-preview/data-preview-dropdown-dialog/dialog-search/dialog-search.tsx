import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import {
  dataTableSearchContainer,
  buttonList,
  buttonItem,
  searchFilters,
  dialogSearchBar,
  searchContent,
  dialogSearchResults,
  dataTableSearchBar,
  noMatch,
  unmatchedTerm
} from './dialog-search.module.scss';
import SearchBar from '../../../search-bar/search-bar';

interface ButtonData {
  label: string;
  subtitle?: string;
  onClick: () => void;
  type: 'dataTable' | 'searchFilter';
}

interface Props {
  buttons: ButtonData[];
  searchBarLabel: string;
}

const DataPreviewDropdownDialogSearch: FunctionComponent<Props> = ({ buttons, searchBarLabel }) => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [active, setActive] = useState(false);
  console.log('buttons',buttons)
  const filteredButtons = buttons?.filter(
    button =>
      button.label?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (button.subtitle && button.subtitle.toLowerCase().includes(searchFilter.toLowerCase()))
  );
  console.log('filteredButtons',filteredButtons)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchFilter(e.target.value);
  };
  return (
    <div className={dataTableSearchContainer}>
      <div className={dataTableSearchBar}>
        <SearchBar
          label={searchBarLabel}
          onChange={handleSearchChange}
          filter={searchFilter}
          handleClear={() => setSearchFilter('')}
          active={active}
          setActive={setActive}
        />
      </div>

      <div className={buttonList}>
        {filteredButtons.length > 0 ? (
          filteredButtons.map((button, index) => (
            <button key={index} onClick={button.onClick} className={buttonItem}>
              <span>{button.label}</span>
              {button.subtitle && <small>{button.subtitle}</small>}
            </button>
          ))
        ) : (
          <div className={noMatch}>
                No match for <span className={unmatchedTerm}>'{searchFilter}'</span>. Please revise your search and try again.
              </div>
        )}
      </div>
    </div>
  );
};

export default DataPreviewDropdownDialogSearch;
