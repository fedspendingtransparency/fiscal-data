import {Column, Table} from "@tanstack/react-table";
import React, { useEffect, useState } from 'react';
import SearchBar from '../search-bar/search-bar';

export const Filter = ({
                  column,
                  table,
                }: {
  column: Column<any, any>
  table: Table<any>
}) => {
  //TODO: cells may be empty resulting in a null type => update method for grabbing column type
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

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


  return typeof firstValue === 'number' ? (
      <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
        column.setFilterValue((old: [number, number]) => [
          e.target.value,
          old?.[1],
        ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
      value={(columnFilterValue as [number, number])?.[1] ?? ''}
      onChange={e =>
      column.setFilterValue((old: [number, number]) => [
        old?.[0],
        e.target.value,
      ])
    }
      placeholder={`Max`}
      className="w-24 border shadow rounded"
      />
      </div>
    ) : (
      <SearchBar
        onChange={onFilterChange}
        filter={filterDisplay}
        handleClear={clearFilter}
        height="28px"
        active={active}
        setActive={setActive}
      />
      // <input
      //   type="text"
      //   data-testid={`column-search-${column.id}`}
      //   value={(columnFilterValue ?? '') as string}
      //   onChange={e => column.setFilterValue(e.target.value)}
      //   placeholder={`Search...`}
      //   className="w-36 border shadow rounded"
      // />
    )
}
