import React, { FunctionComponent, useEffect, useState } from 'react';
import { Column } from '@tanstack/react-table';
import moment from 'moment/moment';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
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
const DateRangeFilter: FunctionComponent<any> = ({ column }: { column: Column<any, any> }) => {
  const [visible, setVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selected, setSelected] = useState({
    from: undefined,
    to: undefined,
  });

  const todayOnClick = () => {
    const newDateRange = {
      from: new Date(),
      to: new Date(),
    };
    setSelected(newDateRange);
    const start = moment(new Date()).format('MM/DD/YYYY');
    const end = moment(new Date()).format('MM/DD/YYYY');
    console.log(`${start} - ${end}`);
    setSelectedText(`${start} - ${end}`);
  };
  const clearOnClick = () => {
    setSelected(undefined);
    setSelectedText(``);
  };
  useEffect(() => {
    if (selected?.from && selected?.to) {
      const start = moment(selected?.from).format('MM/DD/YYYY');
      const end = moment(selected?.to).format('MM/DD/YYYY');
      setSelectedText(`${start} - ${end}`);
    } else {
      setSelectedText('');
    }
  }, [selected]);

  return (
    <>
      <div className={dateEntryBox}>
        <div className={dateText}>{selectedText}</div>
        <FontAwesomeIcon icon={faCalendarDay as IconProp} onClick={() => setVisible(!visible)} className={calendarIcon} />
      </div>
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
