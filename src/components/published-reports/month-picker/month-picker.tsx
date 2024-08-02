import React, { FunctionComponent, useState } from 'react';
import MonthPickerDropdown from './month-picker-dropdown/month-picker-dropdown';
import { publishedDateLabel, datePickerButton, glow } from './month-picker.module.scss';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const monthDropdownList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
const yearDropdownList = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].reverse();

const MonthPicker: FunctionComponent = ({ monthDropdownOptions = monthDropdownList, yearDropdownOptions = yearDropdownList }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('August 2024');

  return (
    <>
      <div className={open ? glow : null}>
        <button className={datePickerButton} onClick={() => setOpen(!open)}>
          <div>
            <span className={publishedDateLabel}>Published Date: </span>
            {selectedDate}
          </div>
          <FontAwesomeIcon icon={open ? faCaretUp : faCaretDown} />
        </button>
      </div>
      {open && (
        <MonthPickerDropdown
          monthDropdownOptions={monthDropdownOptions}
          yearDropdownOptions={yearDropdownOptions}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleClose={() => setOpen(false)}
          handleApplyDate={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default MonthPicker;
