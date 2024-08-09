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
  dateDivider,
  glow,
  lastColumn,
  datePickerButton,
  datePickerSelected,
  datePickerRangeMiddle,
  buttonContainer,
  dateTextBegin,
  errorBox,
} from './date-range-filter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useSetRecoilState } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../../recoil/reactTableFilteredState';

let mouseOverDropdown = null;
const DateRangeFilter = ({ column, resetFilters, allActiveFilters, setAllActiveFilters, isLastColumn }) => {
  const textHighlighted = { backgroundColor: '#E8F5FF' };
  const noTextHighLight = { backgroundColor: '' };

  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });

  const [beginTextStyle, setBeginTextStyle] = useState(noTextHighLight);
  const [endTextStyle, setEndTextStyle] = useState(noTextHighLight);
  const [active, setActive] = useState(false);
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isEndFocused, setIsEndFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setFilteredDateRange = useSetRecoilState(reactTableFilteredDateRangeState);

  const dropdownRef = useRef();
  const displayRef = useRef();

  const startDateRef = useRef();
  const endDateRef = useRef();

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
    for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
    }
    return arr;
  };

  const todayOnClick = e => {
    if (!e.key || e.key === 'Enter') {
      setSelected({
        from: new Date(),
        to: new Date(),
      });
      const start = moment(new Date()).format('YYYY-MM-DD');
      const end = moment(new Date()).format('YYYY-MM-DD');
      onFilterChange(`${start} - ${end}`);
    }
  };

  const clearOnClick = e => {
    if (!e.key || e.key === 'Enter') {
      setSelected(undefined);
      onFilterChange(undefined);
      setEndTextStyle(noTextHighLight);
      setBeginTextStyle(noTextHighLight);
      setErrorMessage('');
    }
  };

  const handleTextBoxClick = isStart => {
    setActive(true);
    if (isStart) {
      setIsStartFocused(true);
      setIsEndFocused(false);
    } else {
      setIsStartFocused(false);
      setIsEndFocused(true);
    }
  };

  const handleTextBoxBlur = e => {
    if (
      !dropdownRef.current?.contains(e?.relatedTarget) &&
      e?.relatedTarget?.id !== 'gatsby-focus-wrapper' &&
      e.relatedTarget !== displayRef.current &&
      e.relatedTarget !== null
    ) {
      setActive(false);
    }
  };

  const handleEventListener = e => {
    if (!dropdownRef.current?.contains(e.target) && !displayRef.current?.contains(e.target)) {
      setActive(false);
    }
  };

  const handleDateInputChange = (e, isStart) => {
    const date = e.target.value;
    if (moment(date, 'YYYY-MM-DD', true).isValid()) {
      setErrorMessage('');
      if (isStart && date[0] !== '0') {
        console.log(date);
        setSelected(prev => ({ ...prev, from: new Date(date) }));
        setIsStartFocused(false);
        setIsEndFocused(true);
      } else if (!isStart && date[0] !== '0') {
        setSelected(prev => ({ ...prev, to: new Date(date) }));
        setIsStartFocused(false);
        setIsEndFocused(false);
        setActive(false);
      } else {
        setErrorMessage('Invalid date range. Please check the entered dates and try again.');
      }
    }
  };

  const handleKeyDown = (e, isStart) => {
    if (e.key === 'Enter') {
      handleDateInputChange(e, isStart);
      if (isStart) {
        setIsEndFocused(true);
      }
    }
  };

  useEffect(() => {
    if (active) {
      document.addEventListener('click', handleEventListener);
      setBeginTextStyle(isStartFocused ? textHighlighted : noTextHighLight);
      setEndTextStyle(isEndFocused ? textHighlighted : noTextHighLight);
    } else {
      document.removeEventListener('click', handleEventListener);
      setBeginTextStyle(noTextHighLight);
      setEndTextStyle(noTextHighLight);
    }
  }, [active, isStartFocused, isEndFocused]);

  useEffect(() => {
    if (selected?.from && selected?.to) {
      console.log('selected updated, from and to');
      const start = moment(selected?.from);
      const end = moment(selected?.to);
      setFilteredDateRange({ from: start, to: end });
      column.setFilterValue(getDaysArray(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')));
      onFilterChange(`${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}`);
      startDateRef.current.value = start.format('YYYY-MM-DD');
      endDateRef.current.value = end.format('YYYY-MM-DD');
      setEndTextStyle(noTextHighLight);
      setActive(false);
    } else {
      console.log('selected updated, else');

      column.setFilterValue([]);
      setFilteredDateRange(null);
      onFilterChange('');
      startDateRef.current.value = '';
      endDateRef.current.value = '';
    }
    if (selected?.from && !selected?.to) {
      console.log('selected updated, from and not to');
      const start = moment(selected?.from);
      setEndTextStyle(textHighlighted);
      setBeginTextStyle(noTextHighLight);
      startDateRef.current.value = start.format('YYYY-MM-DD');
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
          className={`${dateEntryBox} ${errorMessage ? 'error' : ''}`}
          onClick={() => handleTextBoxClick(true)}
          onKeyDown={e => handleTextBoxClick(true)}
          role="button"
          tabIndex={0}
          aria-label={`Open ${column.id} Filter`}
          ref={displayRef}
        >
          <input
            className={`${dateTextBegin} ${errorMessage ? 'error' : ''}`}
            type="date"
            onChange={e => handleDateInputChange(e, true)}
            onBlur={e => handleTextBoxBlur(e)}
            onKeyDown={e => handleKeyDown(e, true)}
            onFocus={() => handleTextBoxClick(true)}
            placeholder="Start"
            ref={startDateRef}
          />
          <div className={dateDivider}>|</div>
          <input
            className={dateTextBegin}
            type="date"
            onChange={e => handleDateInputChange(e, false)}
            onBlur={e => handleTextBoxBlur(e)}
            onKeyDown={e => handleKeyDown(e, false)}
            onFocus={() => handleTextBoxClick(false)}
            placeholder="End"
            ref={endDateRef}
          />
          {selected ? (
            <span onClick={clearOnClick} onKeyDown={e => clearOnClick(e)} tabIndex={0} role="button" aria-label="Clear dates">
              <FontAwesomeIcon icon={faCircleXmark} className={xIcon} />
            </span>
          ) : (
            <FontAwesomeIcon icon={faCalendar} className={calendarIcon} />
          )}
        </div>
        {errorMessage && <div className={errorBox}>{errorMessage}</div>}
      </div>
      <div onBlur={handleTextBoxBlur} ref={dropdownRef} role="presentation" onClick={e => e.stopPropagation()} data-testid="dropdown-wrapper">
        {active && !errorMessage && (
          <div
            className={`${dropdown} ${isLastColumn && lastColumn}`}
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
                modifiersClassNames={{
                  selected: datePickerSelected,
                  range_middle: datePickerRangeMiddle,
                }}
                fromYear={1900}
                toYear={2099}
                captionLayout="dropdown-buttons"
              />
            </div>
            {/*<div className={buttonContainer}>*/}
            {/*  <div role="button" onClick={todayOnClick} onKeyDown={e => todayOnClick(e)} tabIndex={0} className={datePickerButton} aria-label="Today">*/}
            {/*    Today*/}
            {/*  </div>*/}
            {/*  <div role="button" onClick={clearOnClick} onKeyDown={e => clearOnClick(e)} tabIndex={0} className={datePickerButton} aria-label="Clear">*/}
            {/*    Clear*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        )}
      </div>
    </>
  );
};

export default DateRangeFilter;
