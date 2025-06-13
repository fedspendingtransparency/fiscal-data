import React, { FunctionComponent, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { searchBox, headerBox } from './search-filter.module.scss';

interface iSearchFilter {
  searchLabel: string;
  filter: string;
  header: string;
  setFilter: (val: string) => void;
  hideIcons?: boolean;
}

const SearchFilter: FunctionComponent<iSearchFilter> = ({ filter, header, setFilter, searchLabel, hideIcons }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
  };

  return (
    <>
      <div className={headerBox}>{header}</div>
      <div className={searchBox}>
        <SearchBar
          onChange={onSearchBarChange}
          filter={filter}
          active={searchBarActive}
          setActive={setSearchBarActive}
          label={searchLabel}
          hideIcons={hideIcons}
        />
      </div>
    </>
  );
};

export default SearchFilter;
