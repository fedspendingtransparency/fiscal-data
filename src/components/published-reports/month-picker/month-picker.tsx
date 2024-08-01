import React, { FunctionComponent, useState } from 'react';
import MonthPickerDropdown from './month-picker-dropdown/month-picker-dropdown';
import { publishedDateLabel, datePickerButton } from './month-picker.module.scss';

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
  const [dropdownOptions, setDropdownOptions] = useState();

  return (
    <>
      <button className={datePickerButton} onClick={() => setOpen(!open)}>
        <span className={publishedDateLabel}>Published Date: </span> May 2023
      </button>
      {open && (
        <MonthPickerDropdown
          monthDropdownOptions={monthDropdownOptions}
          yearDropdownOptions={yearDropdownOptions}
          handleClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default MonthPicker;
