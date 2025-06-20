import React, { FunctionComponent, useEffect, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { headerBox, searchBox } from './search-filter.module.scss';

interface iSearchFilter {
  searchLabel: string;
  header: string;
  hideIcons?: boolean;
  columnConfig;
}

const SearchFilter: FunctionComponent<iSearchFilter> = ({ header, searchLabel, hideIcons, columnConfig }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [filterVal, setFilterVal] = useState(columnConfig?.pendingValue);

  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilterVal(val);
    columnConfig['pendingValue'] = val;
  };

  useEffect(() => {
    setFilterVal(columnConfig?.pendingValue);
  }, [columnConfig]);

  return (
    <>
      <div className={headerBox}>{header}</div>
      <div className={searchBox}>
        <SearchBar
          onChange={onSearchBarChange}
          filter={filterVal}
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
