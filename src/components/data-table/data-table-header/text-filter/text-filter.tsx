import React, { FunctionComponent, useEffect, useState } from 'react';
import { Column } from '@tanstack/react-table';
import SearchBar from '../../../search-bar/search-bar';

const TextFilter: FunctionComponent<any> = ({
  column,
  resetFilters,
  setFiltersActive,
}: {
  column: Column<any, any>;
  resetFilters: boolean;
  setFiltersActive: (value: boolean) => void;
}) => {
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
    setFiltersActive(val.length > 0);
  };

  useEffect(() => {
    clearFilter();
  }, [resetFilters]);

  return <SearchBar onChange={onFilterChange} filter={filterDisplay} handleClear={clearFilter} height="28px" active={active} setActive={setActive} />;
};

export default TextFilter;
