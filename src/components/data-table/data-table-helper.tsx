import {Column} from "@tanstack/react-table";
import React, { FunctionComponent, useState } from 'react';
import SearchBar from '../search-bar/search-bar';

export const Filter: FunctionComponent<any> = ({ column }: { column: Column<any, any> }) => {
  const [active, setActive] = useState(false);
  const [filterDisplay, setFilterDisplay] = useState('');
  const clearFilter = () => {
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: ''
      }
    });
    column.setFilterValue('');
    setFilterDisplay('');
  };

  const onFilterChange = (event) => {
    const val = (event && event.target) ? event.target.value : '';
    column.setFilterValue(val);
    setFilterDisplay(val);
  };

  return (
      <SearchBar
        onChange={onFilterChange}
        filter={filterDisplay}
        handleClear={clearFilter}
        height="28px"
        active={active}
        setActive={setActive}
      />
    )
}

export const rightAlign = ( type: string ): boolean => {
  const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
  return types.includes(type) || type?.includes('CURRENCY');
};


