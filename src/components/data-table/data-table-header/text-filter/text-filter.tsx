import React, { FunctionComponent, useEffect, useState } from 'react';
import { Column } from '@tanstack/react-table';
import SearchBar from '../../../search-bar/search-bar';

interface ITextFilter {
  column: Column<unknown>;
  resetFilters: boolean;
  allActiveFilters: string[];
  setAllActiveFilters: (value: string[]) => void;
}
const TextFilter: FunctionComponent<ITextFilter> = ({ column, resetFilters, setAllActiveFilters, allActiveFilters }) => {
  const [active, setActive] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState('');
  const clearFilter = () => {
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: '',
      },
    });
    column.setFilterValue('');
    setFilterDisplay('');
  };

  const onFilterChange = event => {
    const val = event && event.target ? event.target.value : '';
    column.setFilterValue(val);
    setFilterDisplay(val);
    if (val.length > 0) {
      if (!allActiveFilters.includes(column.id)) {
        setAllActiveFilters([...allActiveFilters, column.id]);
      }
    } else {
      if (allActiveFilters.includes(column.id)) {
        const currentFilters = allActiveFilters.filter(value => value !== column.id);
        setAllActiveFilters(currentFilters);
      }
    }
  };

  useEffect(() => {
    clearFilter();
  }, [resetFilters]);

  return (
    <SearchBar
      onChange={onFilterChange}
      filter={filterDisplay}
      handleClear={clearFilter}
      height="28px"
      active={active}
      setActive={setActive}
      ariaLabel={`filter ${column.id} column`}
    />
  );
};

export default TextFilter;
