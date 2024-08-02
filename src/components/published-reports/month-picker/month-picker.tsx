import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import MonthPickerDropdown from './month-picker-dropdown/month-picker-dropdown';
import { publishedDateLabel, datePickerButton, glow } from './month-picker.module.scss';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const monthDropdownList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
const yearDropdownList = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].reverse();

const MonthPicker: FunctionComponent = ({ monthDropdownOptions = monthDropdownList, yearDropdownOptions = yearDropdownList }) => {
  const [active, setActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState('August 2024');
  const dropdownRef = useRef(null);

  const handleBlur = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      console.log('blurrrr');
      setActive(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    if (active) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [active]);

  return (
    <div onBlur={e => handleBlur(e)} role="presentation" ref={dropdownRef}>
      <div className={active ? glow : null}>
        <button className={datePickerButton} onClick={() => setActive(!active)} aria-label="Select Published Report Date">
          <div>
            <span className={publishedDateLabel}>Published Date: </span>
            {selectedDate}
          </div>
          <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
        </button>
      </div>
      {active && (
        <MonthPickerDropdown
          monthDropdownOptions={monthDropdownOptions}
          yearDropdownOptions={yearDropdownOptions}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleClose={() => setActive(false)}
        />
      )}
    </div>
  );
};

export default MonthPicker;
