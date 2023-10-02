import React, { useEffect, useRef, useState } from 'react';
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

let mouseOverDropdown = null;
const DateRangeFilter = ({ column, resetFilters, allActiveFilters, setAllActiveFilters }) => {
  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });
  const [filterDisplay, setFilterDisplay] = useState('');
  const [active, setActive] = useState(false);

  const dropdownRef = useRef();
  const displayRef = useRef();

  const onFilterChange = val => {
    setFilterDisplay(val);
    if (val) {
      if (!allActiveFilters?.includes(column.id)) {
        setAllActiveFilters([...allActiveFilters, column.id]);
      }
    } else {
      if (allActiveFilters?.includes(column.id)) {
        const currentFilters = allActiveFilters.filter(value => value !== column.id);
        setAllActiveFilters(currentFilters);
      }
    }
  };

  const getDaysArray = (start, end) => {
    const arr = [];
    for (let dt = convertDate(start); dt <= convertDate(end); dt.setDate(dt.getDate() + 1)) {
      arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
    }
    return arr;
  };

  const todayOnClick = e => {
    if (!e.key || e.key === 'Enter') {
      setSelected({
        from: Date.now(),
        to: Date.now(),
      });
      const start = moment(Date.now()).format('M/D/YYYY');
      const end = moment(Date.now()).format('M/D/YYYY');
      onFilterChange(`${start} - ${end}`);
    }
  };

  const clearOnClick = e => {
    if (!e.key || e.key === 'Enter') {
      setSelected(undefined);
      onFilterChange(undefined);
    }
  };

  const handleTextBoxClick = e => {
    if (!e.key || e.key === 'Enter') {
      setActive(!active);
    }
  };

  const handleTextBoxBlur = e => {
    if (
      !dropdownRef.current?.contains(e?.relatedTarget) &&
      e?.relatedTarget?.id !== 'gatsby-focus-wrapper' &&
      e.relatedTarget !== displayRef.current
    ) {
      setActive(false);
    }
  };

  const handleEventListener = e => {
    if (!mouseOverDropdown && !displayRef.current?.contains(e?.target)) {
      setActive(false);
    }
  };

  // used to close dropdown when clicking outside
  useEffect(() => {
    if (active) {
      document.getElementById('gatsby-focus-wrapper')?.addEventListener('click', handleEventListener);
    }
    return () => {
      document.getElementById('gatsby-focus-wrapper')?.removeEventListener('click', handleEventListener);
    };
  }, [active]);

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
    setActive(false);
  }, [resetFilters]);

  return (
    <>
      <div className={active ? glow : null}>
        <div
          className={dateEntryBox}
          onClick={handleTextBoxClick}
          onKeyDown={e => handleTextBoxClick(e)}
          role="button"
          tabIndex={0}
          aria-label={`Open ${column.id} Filter`}
          ref={displayRef}
        >
          <div className={dateText}>{filterDisplay}</div>
          <FontAwesomeIcon icon={faCalendarDay} className={calendarIcon} />
        </div>
      </div>
      <div onBlur={handleTextBoxBlur} ref={dropdownRef} role="presentation" onClick={e => e.stopPropagation()} data-testid="dropdown-wrapper">
        {active && (
          <div
            className={dropdown}
            onMouseOver={() => {
              mouseOverDropdown = true;
            }}
            onFocus={() => {
              mouseOverDropdown = true;
            }}
            onMouseLeave={() => {
              mouseOverDropdown = false;
            }}
            role="presentation"
            data-testid="Date Picker Dropdown"
          >
            <div className={datePickerContainer}>
              <DayPicker
                mode="range"
                selected={selected}
                onSelect={setSelected}
                modifiersClassNames={{ selected: datePickerSelected, focus: datePickerHover }}
                fromYear={1900}
                toYear={2099}
                captionLayout="dropdown-buttons"
              />
            </div>
            <div className={buttonContainer}>
              <div role="button" onClick={todayOnClick} onKeyDown={e => todayOnClick(e)} tabIndex={0} className={datePickerButton} aria-label="Today">
                Today
              </div>
              <div role="button" onClick={clearOnClick} onKeyDown={e => clearOnClick(e)} tabIndex={0} className={datePickerButton} aria-label="Clear">
                Clear
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DateRangeFilter;
