import React, { FunctionComponent, useEffect, useState } from 'react';
import moment from 'moment/moment';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { glow, search } from '../../../search-bar/search-bar.module.scss';
import { convertDate } from '../../../dataset-data/dataset-data-helper/dataset-data-helper';

const DateRangeFilter = ({ column, setFiltersActive, resetFilters }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });
  const [filterDisplay, setFilterDisplay] = useState('');
  const [active, setActive] = useState(false);

  let searchCleared = false;

  const onFilterChange = val => {
    setFilterDisplay(val);
    if (setFiltersActive) {
      setFiltersActive(val?.length > 0);
    }
  };

  const todayOnClick = () => {
    setSelected({
      from: new Date(),
      to: new Date(),
    });
    const start = moment(new Date()).format('M/D/YYYY');
    const end = moment(new Date()).format('M/D/YYYY');
    onFilterChange(`${start} - ${end}`);
  };

  const handleTextBoxClick = () => {
    if (!searchCleared && setActive) {
      setActive(true);
      searchCleared = false;
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
    <>
      <div className={search}>
        <div className={glow && active ? glow : null} onClick={handleTextBoxClick} onBlur={() => setActive(false)} role="presentation">
          <div className={dateEntryBox}>
            <div className={dateText}>{filterDisplay}</div>
            <FontAwesomeIcon icon={faCalendarDay} onClick={() => setVisible(!visible)} className={calendarIcon} />
          </div>
        </div>
      </div>
      {visible && (
        <div className={dropdown}>
          <div className={datePickerContainer}>
            <DayPicker
              mode="range"
              selected={selected}
              onSelect={setSelected}
              modifiersClassNames={{ selected: datePickerSelected, focus: datePickerHover }}
              fromYear={2015}
              toYear={2024}
              captionLayout="dropdown-buttons"
            />
          </div>
          <div className={buttonContainer}>
            <div role="button" onClick={todayOnClick} onKeyDown={todayOnClick} tabIndex={0} className={datePickerButton}>
              Today
            </div>
            <div
              role="button"
              onClick={() => setSelected(undefined)}
              onKeyDown={() => setSelected(undefined)}
              tabIndex={0}
              className={datePickerButton}
            >
              Clear
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateRangeFilter;
