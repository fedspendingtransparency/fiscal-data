import { Column } from '@tanstack/react-table';
import React, { FunctionComponent, useEffect, useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { isBefore, isValid } from 'date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

export const Filter: FunctionComponent<any> = ({
  column,
}: {
  column: Column<any, any>;
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
  );
};

export const rightAlign = (type: string): boolean => {
  const types = ['DATE', 'CURRENCY', 'NUMBER', 'PERCENTAGE'];
  return types.includes(type) || type?.includes('CURRENCY');
};

const getDaysArray = (start, end) => {
  const arr = [];
  for (
    let dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt).toISOString().split('T')[0]);
  }
  return arr;
};

export const DateRangeFilter: FunctionComponent<any> = ({
  column,
}: {
  column: Column<any, any>;
}) => {
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (beginDate && endDate) {
      if (beginDate !== 'Invalid Date' && endDate !== 'Invalid Date') {
        column.setFilterValue(getDaysArray(beginDate, endDate));
      }
    } else {
      column.setFilterValue([]);
    }
  }, [beginDate, endDate]);

  const minAllowedDate = new Date(1790, 0, 1);
  minAllowedDate.setHours(0, 0, 0, 0);

  const maxAllowedDate = new Date(2025, 0, 1);
  maxAllowedDate.setHours(0, 0, 0, 0);

  const handleBeginDate = date => {
    setBeginDate(date);
  };
  const handleEndDate = date => {
    setEndDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div data-testid="time-range-filter">
        <div data-testid="time_range_filter_label">
          <p style={{ marginTop: '0', marginBottom: '0.25rem' }}>From</p>
          <div>
            <KeyboardDatePicker
              value={beginDate}
              onChange={handleBeginDate}
              variant="inline"
              inputVariant="outlined"
              placeholder="MM / DD / YYYY"
              format="MM/dd/yyyy"
              minDate={minAllowedDate}
              maxDate={maxAllowedDate}
              keyboardIcon={<FontAwesomeIcon icon={faCalendar} size="xs" />}
              KeyboardButtonProps={{
                'aria-label': 'Open calendar view to pick date',
              }}
              inputProps={{ 'aria-label': 'From Date' }}
              PopoverProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                },
              }}
            />
          </div>
        </div>
        <div>
          <p style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>To</p>
          <div>
            <KeyboardDatePicker
              value={endDate}
              onChange={handleEndDate}
              variant="inline"
              inputVariant="outlined"
              placeholder="MM / DD / YYYY"
              format="MM/dd/yyyy"
              minDate={minAllowedDate}
              maxDate={maxAllowedDate}
              keyboardIcon={<FontAwesomeIcon icon={faCalendar} size="xs" />}
              KeyboardButtonProps={{
                'aria-label': 'Open calendar view to pick date',
              }}
              inputProps={{ 'aria-label': 'To Date' }}
              PopoverProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
              }}
            />
          </div>
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
};
