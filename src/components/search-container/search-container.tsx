import React, { FunctionComponent } from 'react';
import { searchBox } from '../data-preview/data-preview-mobile-dialog/data-preview-mobile-dialog.module.scss';
import SearchBar from '../search-bar/search-bar';

interface iSearchContainer {
  children;
  // onSearchBarChange;
}

const SearchContainer: FunctionComponent<iSearchContainer> = ({ children, filter, setFilter }) => {
  // search bar
  //scroll container
  // searchable list options
  // const [filter, setFilter] = useState('');

  const onSearchBarChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilter(val);
  };

  return (
    <>
      <div className={searchBox}>
        <p>Search Columns</p>
        <SearchBar onChange={onSearchBarChange} filter={filter} />
      </div>
      {children}
    </>
  );
};

export default SearchContainer;
