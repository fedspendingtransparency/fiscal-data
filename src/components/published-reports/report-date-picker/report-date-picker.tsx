import React, { FocusEventHandler, FunctionComponent, useRef, useState } from 'react';
import MonthPicker from './month-picker/month-picker';
import { publishedDateLabel, datePickerButton, glow, datePickerContainer } from './report-date-picker.module.scss';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useOnClickOutside from 'use-onclickoutside';
import ReportDayPicker from './report-day-picker/report-day-picker';
import { formatReportDate } from '../../../helpers/dataset-detail/report-helpers';

interface IMonthPicker {
  monthDropdownOptions?: string[];
  yearDropdownOptions?: string[];
  isDailyReport: boolean;
  latestReportDate: Date;
  earliestReportDate: Date;
  allReportDates: string[];
  allReportYears: string[];
}

const ReportDatePicker: FunctionComponent<IMonthPicker> = ({
  isDailyReport,
  latestReportDate,
  earliestReportDate,
  allReportDates,
  allReportYears,
}: IMonthPicker) => {
  const [active, setActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(latestReportDate);
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
      if (!parent?.outerText?.includes(related?.outerText) && related?.id !== 'gatsby-focus-wrapper') {
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
            {`${formatReportDate(selectedDate, true, isDailyReport)}`}
          </div>
          <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
        </button>
      </div>
      {!isDailyReport && (
        <MonthPicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleClose={() => setActive(false)}
          allReportDates={allReportDates}
          active={active}
          allReportYears={allReportYears}
        />
      )}
      {isDailyReport && (
        <ReportDayPicker
          handleClose={() => setActive(false)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          latestReportDate={latestReportDate}
          earliestReportDate={earliestReportDate}
          allReportDates={allReportDates}
          active={active}
        />
      )}
    </div>
  );
};

export default ReportDatePicker;
