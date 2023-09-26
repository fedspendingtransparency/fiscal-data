import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';
import { DayPicker, ClassNames } from 'react-day-picker';
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
  testClass,
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
  const [mouseOver, setMouseOver] = useState(false);

  const onFilterChange = val => {
    setFilterDisplay(val);
    if (setFiltersActive) {
      setFiltersActive(val?.length > 0);
    }
  };

  const dropdownRef = useRef();
  const displayBoxRef = useRef();
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
    console.log(e.target?.parentElement?.contains(e.relatedTarget));
    console.log(e.relatedTarget);
    console.log(e.target);
    if (e && !dropdownRef.current?.contains(e.relatedTarget) && !(dropdownRef.current?.contains(e.target) && mouseOver)) {
      // setVisible(false);
      // setActive(false);
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

  return (
    <div role="presentation" onBlur={handleTextBoxBlur} ref={dropdownRef}>
      <div className={active ? glow : null}>
        <div
          className={dateEntryBox}
          onClick={handleTextBoxClick}
          onKeyDown={e => handleTextBoxClick(e)}
          role="button"
          tabIndex={0}
          ref={displayBoxRef}
        >
          <div className={dateText}>{filterDisplay}</div>
          <FontAwesomeIcon icon={faCalendarDay} className={calendarIcon} />
        </div>
      </div>
      {visible && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div className={dropdown} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
          <div className={datePickerContainer}>
            <DayPicker
              mode="range"
              selected={selected}
              onSelect={setSelected}
              modifiersClassNames={{ selected: datePickerSelected, focus: datePickerHover }}
              fromYear={1900}
              toYear={2099}
              captionLayout="dropdown-buttons"
              classNames={{ caption_label: testClass }}
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
