import React, { FunctionComponent, useEffect, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { searchBox } from './search-filter.module.scss';

interface iSearchFilter {
  searchLabel: string;
  hideIcons?: boolean;
  columnConfig;
}

const SearchFilter: FunctionComponent<iSearchFilter> = ({ searchLabel, hideIcons, columnConfig }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const defaultDisplayValue = () => (columnConfig?.pendingValue ? columnConfig?.pendingValue : columnConfig?.filterValue);
  const [filterVal, setFilterVal] = useState(defaultDisplayValue());

  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilterVal(val);
    columnConfig['pendingValue'] = val;
  };

  useEffect(() => {
    setFilterVal(defaultDisplayValue());
  }, [columnConfig]);

  return (
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
  );
};

export default SearchFilter;
