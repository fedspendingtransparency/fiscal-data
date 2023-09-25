import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';
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
  glow,
} from './date-range-filter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { convertDate } from '../../../dataset-data/dataset-data-helper/dataset-data-helper';

const DateRangeFilter = ({ column, setFiltersActive, resetFilters, table }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });
  const [filterDisplay, setFilterDisplay] = useState('');
  const [active, setActive] = useState(false);

  const onFilterChange = val => {
    setFilterDisplay(val);
    if (setFiltersActive) {
      setFiltersActive(val?.length > 0);
    }
  };

  const dropdownRef = useRef();
  const todayOnClick = e => {
    if (!e.key || e.key === 'Enter') {
      setSelected({
        from: new Date(),
        to: new Date(),
      });
      const start = moment(new Date()).format('M/D/YYYY');
      const end = moment(new Date()).format('M/D/YYYY');
      onFilterChange(`${start} - ${end}`);
    }
  };

  const clearOnClick = e => {
    if (!e.key || e.key === 'Enter') {
      setSelected(undefined);
    }
  };

  const handleTextBoxClick = e => {
    if (!e.key || e.key === 'Enter') {
      setVisible(!visible);
      setActive(!active);
    }
  };

  const handleTextBoxBlur = e => {
    if (e && !dropdownRef.current?.contains(e.relatedTarget)) {
      setVisible(false);
      setActive(false);
    }
  };

  const getDaysArray = (start, end) => {
    const arr = [];
    for (let dt = convertDate(start); dt <= convertDate(end); dt.setDate(dt.getDate() + 1)) {
      arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
    }
    return arr;
  };

  useEffect(() => {
    if (selected?.from && selected?.to) {
      const start = moment(selected?.from);
      const end = moment(selected?.to);
      column.setFilterValue(getDaysArray(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
      onFilterChange(`${start.format('M/D/YYYY')} - ${end.format('M/D/YYYY')}`);
    } else {
      column.setFilterValue([]);
      onFilterChange('');
    }
  }, [selected]);

  useEffect(() => {
    setSelected(undefined);
  }, [resetFilters]);

  // TODO get max and min date from column data
  // TODO Override style
  return (
    <div role="presentation" onBlur={handleTextBoxBlur}>
      <div className={active ? glow : null}>
        <div className={dateEntryBox} onClick={handleTextBoxClick} onKeyDown={e => handleTextBoxClick(e)} role="button" tabIndex={0}>
          <div className={dateText}>{filterDisplay}</div>
          <FontAwesomeIcon icon={faCalendarDay} className={calendarIcon} />
        </div>
      </div>
      {visible && (
        <div className={dropdown} role="presentation" data-testid="dropdown-test" ref={dropdownRef}>
          <div className={datePickerContainer}>
            <DayPicker
              mode="range"
              selected={selected}
              onSelect={setSelected}
              modifiersClassNames={{ selected: datePickerSelected, focus: datePickerHover }}
              // modifiersStyles={ hover: {color: 'red' }}
              fromYear={2015}
              toYear={2024}
              captionLayout="dropdown-buttons"
            />
          </div>
          <div className={buttonContainer}>
            <div role="button" onClick={todayOnClick} onKeyDown={e => todayOnClick(e)} tabIndex={0} className={datePickerButton}>
              Today
            </div>
            <div role="button" onClick={clearOnClick} onKeyDown={e => clearOnClick(e)} tabIndex={0} className={datePickerButton}>
              Clear
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
