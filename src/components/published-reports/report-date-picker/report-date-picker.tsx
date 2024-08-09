import React, { FocusEventHandler, FunctionComponent, useRef, useState } from 'react';
import MonthPicker from '../month-picker/month-picker';
import { publishedDateLabel, datePickerButton, glow, datePickerContainer } from './report-date-picker.module.scss';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useOnClickOutside from 'use-onclickoutside';
import ReportDayPicker from '../day-picker/day-picker';

const monthDropdownList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
const yearDropdownList = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].reverse();

interface IMonthPicker {
  monthDropdownOptions?: string[];
  yearDropdownOptions?: string[];
  isDailyReport: boolean;
  latestReportDate: Date;
}

const ReportDatePicker: FunctionComponent<IMonthPicker> = ({
  monthDropdownOptions = monthDropdownList,
  yearDropdownOptions = yearDropdownList,
  isDailyReport,
  latestReportDate,
}: IMonthPicker) => {
  console.log(latestReportDate);
  const [active, setActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(latestReportDate?.toDateString());
  const dropdownRef = useRef(null);

  /* accessibility-enabling event handlers for interpreting focus state on control */
  const handleMouseBlur = (event: MouseEvent) => {
    if (event) {
      const currentTarget = event.target as HTMLElement;
      const relatedTarget = event.relatedTarget as HTMLElement;
      const mouseEvent = event.type !== 'blur';
      if (mouseEvent && !currentTarget?.parentElement?.contains(relatedTarget)) {
        setTimeout(() => {
          setActive(false);
        });
      }
    }
  };

  useOnClickOutside(dropdownRef, handleMouseBlur);

  const handleKeyboardBlur: FocusEventHandler = event => {
    if (event) {
      const parent = dropdownRef.current;
      const related = event?.relatedTarget as HTMLElement;
      if (!parent?.outerText.includes(related?.outerText) && related?.id !== 'gatsby-focus-wrapper') {
        setActive(false);
      }
    }
  };

  return (
    <div ref={dropdownRef} onBlur={handleKeyboardBlur} role="presentation" className={datePickerContainer}>
      <div className={active ? glow : null}>
        <button className={datePickerButton} onClick={() => setActive(!active)} aria-label="Select Published Report Date">
          <div>
            <span className={publishedDateLabel}>Published Date: </span>
            {selectedDate}
          </div>
          <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
        </button>
      </div>
      {active && !isDailyReport && (
        <MonthPicker
          monthDropdownOptions={monthDropdownOptions}
          yearDropdownOptions={yearDropdownOptions}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleClose={() => setActive(false)}
        />
      )}
      {active && isDailyReport && (
        <ReportDayPicker handleClose={() => setActive(false)} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      )}
    </div>
  );
};

export default ReportDatePicker;
