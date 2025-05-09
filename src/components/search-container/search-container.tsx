import React, { FunctionComponent, useState } from 'react';
import { searchBox } from './search-container.module.scss';
import SearchBar from '../search-bar/search-bar';
import ScrollContainer from '../scroll-container/scroll-container';

interface iSearchContainer {
  children;
  searchLabel: string;
  filter: string;
  setFilter: (val: string) => void;
  setNoResults: (val: boolean) => void;
}

const SearchContainer: FunctionComponent<iSearchContainer> = ({ children, filter, setFilter, searchLabel, setNoResults }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
    if (val === '') {
      setNoResults(false);
    }
  };

  const onClear = () => {
    setNoResults(false);
    setFilter('');
  };

  return (
    <>
      <div className={searchBox}>
        <SearchBar
          onChange={onSearchBarChange}
          filter={filter}
          label={searchLabel}
          handleClear={onClear}
          active={searchBarActive}
          setActive={setSearchBarActive}
        />
      </div>
      <ScrollContainer deps={[filter]}>{children}</ScrollContainer>
    </>
  );
};

export default SearchContainer;
