import React, { FunctionComponent, useState } from 'react';
import { searchBox } from '../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import SearchBar from '../search-bar/search-bar';
import ScrollContainer from '../scroll-container/scroll-container';

interface iSearchContainer {
  children;
  searchLabel: string;
  filter: string;
  setFilter: (val: string) => void;
}

const SearchContainer: FunctionComponent<iSearchContainer> = ({ children, filter, setFilter, searchLabel }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
  };

  return (
    <>
      <div className={searchBox}>
        <SearchBar
          onChange={onSearchBarChange}
          filter={filter}
          label={searchLabel}
          handleClear={() => setFilter('')}
          active={searchBarActive}
          setActive={setSearchBarActive}
        />
      </div>
      <ScrollContainer deps={[filter]}>{children}</ScrollContainer>
    </>
  );
};

export default SearchContainer;
