import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './day-picker-overrides.css';
import {
  dateEntryBox,
  dropdown,
  datePickerContainer,
  calendarIcon,
  xIcon,
  buttonContainer,
  datePickerButton,
  datePickerSelected,
  datePickerRangeMiddle,
  glow,
  lastColumn,
  invalidDateText,
} from './date-range-filter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { convertDate } from '../../../dataset-data/dataset-data-helper/dataset-data-helper';
import { useSetRecoilState } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../../recoil/reactTableFilteredState';
import DateRangeTextInput from './date-range-text-input/date-range-text-input';
import { dateFilterMaxYear, dateFilterMinYear, datePlaceholder } from './date-range-helper';

let mouseOverDropdown = null;
const DateRangeFilter = ({ column, resetFilters, allActiveFilters, setAllActiveFilters, isLastColumn }) => {
  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });
  const [active, setActive] = useState(false);
  const setFilteredDateRange = useSetRecoilState(reactTableFilteredDateRangeState);
  const [invalidDate, setInvalidDate] = useState(false);
  const [inputDisplay, setInputDisplay] = useState([datePlaceholder, datePlaceholder]);

  const dropdownRef = useRef();
  const displayRef = useRef();

  const onFilterChange = val => {
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
      const start = moment(Date.now()).format('M/DD/YYYY');
      const end = moment(Date.now()).format('M/DD/YYYY');
      onFilterChange(`${start} - ${end}`);
    }
  };

  const clearOnClick = e => {
    if (!e.key || e.key === 'Enter') {
      setSelected(undefined);
      onFilterChange(undefined);
      setInputDisplay([datePlaceholder, datePlaceholder]);
      setActive(false);
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
    } else {
      if (!selected?.to) {
        setSelected(undefined);
        onFilterChange(undefined);
        setInputDisplay([datePlaceholder, datePlaceholder]);
      }
    }
    return () => {
      document.getElementById('gatsby-focus-wrapper')?.removeEventListener('click', handleEventListener);
    };
  }, [active]);

  useEffect(() => {
    if (selected?.from && selected?.to) {
      const start = moment(selected?.from);
      const end = moment(selected?.to);
      setFilteredDateRange({ from: start, to: end });
      column.setFilterValue(getDaysArray(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
      onFilterChange(`${start} - ${end}`);
      setActive(false);
    } else {
      column.setFilterValue([]);
      setFilteredDateRange(null);
      onFilterChange('');
    }
  }, [selected]);

  useEffect(() => {
    setSelected(undefined);
    setActive(false);
    setInputDisplay([datePlaceholder, datePlaceholder]);
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
          <DateRangeTextInput
            selected={selected}
            setSelected={setSelected}
            inputDisplay={inputDisplay}
            setInputDisplay={setInputDisplay}
            setInvalidDate={setInvalidDate}
            invalidDate={invalidDate}
            active={active}
          />
          {inputDisplay[0] !== datePlaceholder ? (
            <span onClick={clearOnClick} onKeyDown={e => clearOnClick(e)} tabIndex={0} role="button" aria-label="Clear dates">
              <FontAwesomeIcon icon={faCircleXmark} className={xIcon} />
            </span>
          ) : (
            <FontAwesomeIcon icon={faCalendarDay} className={calendarIcon} />
          )}
        </div>
      </div>
      <div onBlur={handleTextBoxBlur} ref={dropdownRef} role="presentation" onClick={e => e.stopPropagation()} data-testid="dropdown-wrapper">
        {active && (
          <div
            className={`${dropdown} ${isLastColumn && lastColumn} ${invalidDate ? invalidDateText : undefined}`}
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
            {invalidDate ? (
              <div>Invalid date range. Please check the entered dates and try again</div>
            ) : (
              <>
                <div className={datePickerContainer}>
                  <DayPicker
                    mode="range"
                    selected={selected}
                    onSelect={setSelected}
                    modifiersClassNames={{
                      selected: datePickerSelected,
                      range_middle: datePickerRangeMiddle,
                    }}
                    fromYear={dateFilterMinYear}
                    toYear={dateFilterMaxYear}
                    captionLayout="dropdown-buttons"
                  />
                </div>
                <div className={buttonContainer}>
                  <div
                    role="button"
                    onClick={todayOnClick}
                    onKeyDown={e => todayOnClick(e)}
                    tabIndex={0}
                    className={datePickerButton}
                    aria-label="Today"
                  >
                    Today
                  </div>
                  <div
                    role="button"
                    onClick={clearOnClick}
                    onKeyDown={e => clearOnClick(e)}
                    tabIndex={0}
                    className={datePickerButton}
                    aria-label="Clear"
                  >
                    Clear
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DateRangeFilter;
