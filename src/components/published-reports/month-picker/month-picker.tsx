import React, { FunctionComponent, useState } from 'react';
import MonthPickerDropdown from './month-picker-dropdown/month-picker-dropdown';
import { publishedDateLabel, datePickerButton } from './month-picker.module.scss';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const monthDropdownOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const yearDropdownOptions = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

const MonthPicker: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('May 2023');

  return (
    <>
      <button className={datePickerButton} onClick={() => setOpen(!open)}>
        <div>
          <span className={publishedDateLabel}>Published Date: </span>
          {selectedDate}
        </div>
        <FontAwesomeIcon icon={open ? faCaretUp : faCaretDown} />
      </button>
      {open && (
        <MonthPickerDropdown
          monthDropdownOptions={monthDropdownOptions}
          yearDropdownOptions={yearDropdownOptions}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </>
  );
};

export default MonthPicker;
