import React, { FunctionComponent, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { searchBox, headerBox } from './search-filter.module.scss';

interface iSearchFilter {
  searchLabel: string;
  filter: string;
  header: string;
  setFilter: (val: string) => void;
  setNoResults: (val: boolean) => void;
}

const SearchFilter: FunctionComponent<iSearchFilter> = ({ filter, header, setFilter, setNoResults, searchLabel }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
  };

  const onClear = () => {
    setNoResults(false);
    setFilter('');
  };

  return (
    <>
      <div className={headerBox}>{header}</div>
      <div className={searchBox}>
        <SearchBar
          onChange={onSearchBarChange}
          filter={filter}
          active={searchBarActive}
          handleClear={onClear}
          setActive={setSearchBarActive}
          label={searchLabel}
        />
      </div>
    </>
  );
};

export default SearchFilter;
