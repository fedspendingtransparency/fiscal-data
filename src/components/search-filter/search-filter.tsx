import React, { FunctionComponent, useEffect, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { searchBox } from './search-filter.module.scss';

interface iSearchFilter {
  searchLabel: string;
  hideIcons?: boolean;
  columnConfig;
}

const SearchFilter: FunctionComponent<iSearchFilter> = ({ searchLabel, hideIcons, columnConfig, filterMap, setFilterMap }) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const defaultDisplayValue = () =>
    filterMap[columnConfig.columnName]?.pendingValue
      ? filterMap[columnConfig.columnName].pendingValue
      : filterMap[columnConfig.columnName]?.filterValue;
  const [filterVal, setFilterVal] = useState(defaultDisplayValue());

  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilterVal(val);
    const map = JSON.parse(JSON.stringify(filterMap));
    const name = columnConfig.columnName;
    map[name].pendingValue = val;
    setFilterMap(map);
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
