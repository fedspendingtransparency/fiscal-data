import React, { FunctionComponent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import DropdownContainer from '../dropdown-container/dropdown-container';
import { active, datePickers, dateRangePicker, dropdownButton, dropdownContent, icon } from './date-range-month-picker.module.scss';
import MonthPicker from './month-picker/month-picker';
import FilterButtons from '../data-preview/data-preview-dropdown-dialog/filter-buttons/filter-buttons';

const DateRangeMonthPicker: FunctionComponent = ({ dateRange }) => {
  const [selectedStartDate, setSelectedStartDate] = useState();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [dropdownActive, setDropdownActive] = useState(false);
  const button = (
    <button className={`${dropdownButton} ${dropdownActive && active}`} onClick={() => setDropdownActive(!dropdownActive)}>
      <FontAwesomeIcon icon={faCalendarWeek} className={icon} size="1x" data-testid="calendar-week-icon" />
      Start Date — End Date
      {true && <FontAwesomeIcon className={icon} icon={faCaretUp} />}
    </button>
  );

  const handleApply = () => {
    console.log('apply');
  };
  const handleCancel = () => {
    console.log('cancel');
  };

  return (
    <div className={dateRangePicker}>
      <DropdownContainer dropdownButton={button} setActive={setDropdownActive} containerWidth="210px">
        {true && (
          <div className={dropdownContent}>
            <div className={datePickers}>
              <MonthPicker text="From" setSelectedDate={setSelectedStartDate} selectedDate={selectedStartDate} />
              <MonthPicker text="To" setSelectedDate={setSelectedEndDate} selectedDate={selectedEndDate} />
            </div>
            <FilterButtons handleApply={handleApply} handleCancel={handleCancel} />
          </div>
        )}
      </DropdownContainer>
    </div>
  );
};

export default DateRangeMonthPicker;
