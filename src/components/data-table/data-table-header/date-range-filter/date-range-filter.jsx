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
  dateDivider,
  lastColumn,
  datePickerSelected,
  datePickerRangeMiddle,
  dateTextBegin,
  datePickerButton,
  buttonContainer,
  hideDivider,
} from './date-range-filter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useSetRecoilState } from 'recoil';
import { reactTableFilteredDateRangeState } from '../../../../recoil/reactTableFilteredState';
import { getDateWithoutTimeZoneAdjust } from '../../../../utils/date-utils';

let mouseOverDropdown = null;
const DateRangeFilter = ({ column, resetFilters, allActiveFilters, setAllActiveFilters, isLastColumn }) => {
  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });

  const [active, setActive] = useState(false);
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isEndFocused, setIsEndFocused] = useState(false);
  const [isDividerHidden, setIsDividerHidden] = useState(false);
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
    const startDate = getDateWithoutTimeZoneAdjust(new Date(start));
    const endDate = getDateWithoutTimeZoneAdjust(new Date(end));
    for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
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
      setSelected({ from: undefined, to: undefined });
      setFilteredDateRange({ from: undefined, to: undefined });
      column.setFilterValue(undefined);
      startDateRef.current.value = '';
      endDateRef.current.value = '';
      onFilterChange(undefined);
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

  const handleTextBoxHoverOrFocus = () => {
    setIsDividerHidden(true);
  };

  const handleTextBoxBlur = e => {
    if (
      !dropdownRef.current?.contains(e?.relatedTarget) &&
      e?.relatedTarget?.id !== 'gatsby-focus-wrapper' &&
      e.relatedTarget !== displayRef.current &&
      e.relatedTarget !== null
    ) {
      setActive(false);
      setIsDividerHidden(false);
    }
  };

  const handleEventListener = e => {
    if (!dropdownRef.current?.contains(e.target) && !displayRef.current?.contains(e.target)) {
      setActive(false);
    }
  };

  const handleDateInputChange = (e, isStart, date = null) => {
    const value = date || e.target.value;
    if (moment(value, 'YYYY-MM-DD', true).isValid()) {
      const parsedDate = getDateWithoutTimeZoneAdjust(new Date(value));

      if (isStart && value[0] !== '0') {
        setSelected(prev => {
          const updated = { ...prev, from: parsedDate };
          if (updated.to && moment(updated.from).isAfter(updated.to)) {
            [updated.from, updated.to] = [updated.to, updated.from];
          }
          return updated;
        });

        if (!selected?.to) {
          endDateRef.current.focus();
        } else {
          setActive(false);
        }
      } else if (!isStart && value[0] !== '0') {
        setSelected(prev => {
          const updated = { ...prev, to: parsedDate };
          if (updated.from && moment(updated.from).isAfter(updated.to)) {
            [updated.from, updated.to] = [updated.to, updated.from];
          }
          return updated;
        });

        if (!selected?.from) {
          startDateRef.current.focus();
        } else {
          setActive(false);
        }
      }
    }
  };

  const handleKeyDown = (e, isStart) => {
    if (e.key === 'Enter') {
      handleDateInputChange(e, isStart);
      if (isStart && selected?.from) {
        endDateRef.current.focus();
      } else {
        setActive(false);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isStartFocused && !isEndFocused) {
      setIsDividerHidden(false);
    }
  };

  const handleCalendarSelect = range => {
    setSelected(range);
    if (isStartFocused) {
      startDateRef.current.value = moment(range?.from).format('YYYY-MM-DD');
      handleDateInputChange({ target: { value: startDateRef.current.value } }, true);
    } else if (isEndFocused) {
      endDateRef.current.value = moment(range?.to).format('YYYY-MM-DD');
      handleDateInputChange({ target: { value: endDateRef.current.value } }, false);
    }
  };

  useEffect(() => {
    if (active) {
      document.addEventListener('click', handleEventListener);
    } else {
      document.removeEventListener('click', handleEventListener);
    }
  }, [active, isStartFocused, isEndFocused]);

  useEffect(() => {
    if (selected?.from && selected?.to) {
      const start = moment(selected?.from);
      const end = moment(selected?.to);
      const correctFrom = start.isBefore(end) ? start : end;
      const correctTo = start.isBefore(end) ? end : start;

      setFilteredDateRange({ from: correctFrom, to: correctTo });
      column.setFilterValue(getDaysArray(correctFrom.format('YYYY-MM-DD'), correctTo.format('YYYY-MM-DD')));
      onFilterChange(`${correctFrom.format('YYYY-MM-DD')} - ${correctTo.format('YYYY-MM-DD')}`);

      startDateRef.current.value = correctFrom.format('YYYY-MM-DD');
      endDateRef.current.value = correctTo.format('YYYY-MM-DD');
      setActive(false);
    }
  }, [selected]);

  useEffect(() => {
    setSelected(undefined);
    setActive(false);
  }, [resetFilters]);

  return (
    <>
      <div className={active}>
        <div
          className={`${dateEntryBox} ${isDividerHidden ? hideDivider : ''}`}
          onClick={() => handleTextBoxClick(true)}
          onKeyDown={e => handleTextBoxClick(true)}
          role="button"
          tabIndex={0}
          onMouseEnter={handleTextBoxHoverOrFocus}
          onMouseLeave={handleMouseLeave}
          aria-label={`Open ${column.id} Filter`}
          ref={displayRef}
        >
          <input
            className={dateTextBegin}
            type="date"
            aria-label="Start"
            data-testid="Start-Button"
            onChange={e => handleDateInputChange(e, true)}
            onBlur={e => handleTextBoxBlur(e)}
            onKeyDown={e => handleKeyDown(e, true)}
            onFocus={() => {
              handleTextBoxClick(true);
              handleTextBoxHoverOrFocus();
            }}
            placeholder="Start"
            required
            ref={startDateRef}
          />
          <div className={dateDivider}>|</div>
          <input
            className={dateTextBegin}
            type="date"
            onChange={e => handleDateInputChange(e, false)}
            onBlur={e => handleTextBoxBlur(e)}
            onKeyDown={e => handleKeyDown(e, false)}
            onFocus={() => {
              handleTextBoxClick(false);
              handleTextBoxHoverOrFocus();
            }}
            placeholder="End"
            required
            ref={endDateRef}
          />
          <FontAwesomeIcon
            icon={faCalendarDay}
            className={calendarIcon}
            onClick={e => {
              e.stopPropagation();
              setActive(prevState => !prevState);
            }}
            onKeyDown={e => {
              e.stopPropagation();
              setActive(prevState => !prevState);
            }}
            tabIndex={0}
          />
        </div>
      </div>
      <div onBlur={handleTextBoxBlur} ref={dropdownRef} role="presentation" onClick={e => e.stopPropagation()} data-testid="dropdown-wrapper">
        {active && (
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
                onSelect={handleCalendarSelect}
                modifiersClassNames={{
                  selected: datePickerSelected,
                  range_middle: datePickerRangeMiddle,
                }}
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
