import React, { FocusEventHandler, FunctionComponent, useRef, useState } from 'react';
import MonthPicker from './month-picker/month-picker';
import { datePickerContainer } from './report-date-picker.module.scss';
import useOnClickOutside from 'use-onclickoutside';
import ReportDayPicker from './report-day-picker/report-day-picker';
import { formatReportDate } from '../../../helpers/dataset-detail/report-helpers';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../dropdown-container/dropdown-container';

interface IMonthPicker {
  isDailyReport: boolean;
  latestReportDate: Date;
  earliestReportDate: Date;
  allReportDates: string[];
  allReportYears: string[];
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
}

const ReportDatePicker: FunctionComponent<IMonthPicker> = ({
  isDailyReport,
  latestReportDate,
  earliestReportDate,
  allReportDates,
  allReportYears,
  selectedDate,
  setSelectedDate,
}: IMonthPicker) => {
  const [active, setActive] = useState(false);

  const dropdownButton = (
    <DropdownLabelButton
      label="Published Date"
      selectedOption={formatReportDate(selectedDate, true, isDailyReport)}
      icon={faCalendar}
      setActive={setActive}
      active={active}
      ariaLabel="Select Published Report Date"
    />
  );

  return (
    <DropdownContainer setActive={setActive} active={active} dropdownButton={dropdownButton}>
      <>
        {active && !isDailyReport && (
          <MonthPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleClose={() => setActive(false)}
            allReportDates={allReportDates}
            active={active}
            allReportYears={allReportYears}
          />
        )}
        {active && isDailyReport && (
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
      </>
    </DropdownContainer>
  );
};

export default ReportDatePicker;
