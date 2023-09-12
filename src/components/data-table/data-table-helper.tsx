import { Column } from '@tanstack/react-table';
import React, { FunctionComponent, useEffect, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment';

export const Filter: FunctionComponent<any> = ({
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

export const rightAlign = (type: string): boolean => {
  const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
  return types.includes(type) || type?.includes('CURRENCY');
};

export const SingleDateFilter: FunctionComponent<any> = ({
  column,
}: {
  column: Column<any, any>;
}) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (date) {
      if (!isNaN(date.toDate().getTime())) {
        column.setFilterValue(moment(date.toDate()).format('YYYY-MM-DD'));
      } else {
        column.setFilterValue('');
      }
    } else {
      column.setFilterValue('');
    }
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        sx={{
          '& .MuiInputBase-root': {
            height: '28px',
            fontSize: '14px',
            marginTop: '0.25rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '14px',
          },
        }}
        value={date}
        onChange={newValue => setDate(dayjs(newValue))}
        views={['year', 'month', 'day']}
        slotProps={{ textField: { size: 'small' } }}
      />
    </LocalizationProvider>
  );
};
