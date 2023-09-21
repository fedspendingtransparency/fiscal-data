import React, { FunctionComponent, useEffect, useState } from 'react';
import { Column } from '@tanstack/react-table';
import moment from 'moment/moment';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  dateEntryBox,
  dropdown,
  datePickerContainer,
  calendarIcon,
  dateText,
  buttonContainer,
  datePickerButton,
  datePickerSelected,
  datePickerHover,
} from './date-range-filter.module.scss';
import DateTextEntry from './date-text-entry';

const DateRangeFilter = ({ column, setFiltersActive, resetFilters }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });
  const [filterDisplay, setFilterDisplay] = useState('');

  const onFilterChange = event => {
    const val = event && event.target ? event.target.value : '';
    // column.setFilterValue(val);
    setFilterDisplay(val);
    setFiltersActive(val.length > 0);
  };

  const todayOnClick = () => {
    const newDateRange = {
      from: new Date(),
      to: new Date(),
    };
    setSelected(newDateRange);
    const start = moment(new Date()).format('MM/DD/YYYY');
    const end = moment(new Date()).format('MM/DD/YYYY');
    // setSelectedText(`${start} - ${end}`);
    onFilterChange({
      target: {
        value: `${start} - ${end}`,
      },
    });
  };

  const clearOnClick = () => {
    setSelected(undefined);
    onFilterChange({
      target: {
        value: '',
      },
    });
  };

  useEffect(() => {
    if (selected?.from && selected?.to) {
      const start = moment(selected?.from).format('MM/DD/YYYY');
      const end = moment(selected?.to).format('MM/DD/YYYY');
      onFilterChange({
        target: {
          value: `${start} - ${end}`,
        },
      });
    } else {
      onFilterChange({
        target: {
          value: '',
        },
      });
    }
  }, [selected]);

  return (
    <>
      <DateTextEntry
        onFilterChange={onFilterChange}
        resetFilters={resetFilters}
        filter={filterDisplay}
        setFilter={setFilterDisplay}
        visible={visible}
        setVisible={setVisible}
      />
      {visible && (
        <div className={dropdown}>
          <div className={datePickerContainer}>
            <DayPicker
              mode="range"
              selected={selected}
              onSelect={setSelected}
              modifiersClassNames={{ selected: datePickerSelected, focus: datePickerHover }}
            />
          </div>
          <div className={buttonContainer}>
            <div role="button" onClick={todayOnClick} onKeyDown={todayOnClick} tabIndex={0} className={datePickerButton}>
              Today
            </div>
            <div role="button" onClick={clearOnClick} onKeyDown={clearOnClick} tabIndex={0} className={datePickerButton}>
              Clear
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateRangeFilter;
