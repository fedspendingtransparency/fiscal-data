import React, { FunctionComponent, useEffect, useState } from 'react';
import ReportDateDropdown from '../report-date-dropdown/report-date-dropdown';
import { DayPicker } from 'react-day-picker';
import '../../../data-table/data-table-header/date-range-filter/day-picker-overrides.css';
import 'react-day-picker/dist/style.css';
import { datePickerSelected } from './report-day-picker.module.scss';
import { formatReportDate } from '../../../../helpers/dataset-detail/report-helpers';
import { monthFullNames } from '../../../../utils/api-utils';

interface IReportDayPicker {
  handleClose: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  latestReportDate: Date;
  earliestReportDate: Date;
  allReportDates?: string[];
  active: boolean;
}

const ReportDayPicker: FunctionComponent<IReportDayPicker> = ({
  handleClose,
  setSelectedDate,
  selectedDate,
  latestReportDate,
  earliestReportDate,
  allReportDates,
  active,
  label,
}: IReportDayPicker) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const [month, setMonth] = useState<Date>(selectedDate);
  const handleApply = () => {
    setSelectedDate(currentDate !== undefined ? currentDate : latestReportDate);
    if (handleClose) {
      handleClose();
    }
  };

  const isDisabled = (day: Date) => {
    if (allReportDates) {
      const reportMonth = monthFullNames[day.getMonth()];
      const reportDay = day.getDate();
      const reportYear = day.getFullYear();
      const dateStr = reportMonth + ' ' + reportDay + ', ' + reportYear;
      return !allReportDates.includes(dateStr);
    }
  };

  useEffect(() => {
    if (!active) {
      setCurrentDate(selectedDate);
    }
  }, [active]);

  useEffect(() => {
    setMonth(currentDate);
  }, [currentDate]);

  return (
    <>
      {active && (
        <ReportDateDropdown
          handleClose={handleClose}
          handleApply={handleApply}
          setCurrentDate={setCurrentDate}
          selectedDate={currentDate !== undefined && formatReportDate(currentDate, true, true)}
          allDates={allReportDates}
          daily
          label={label}
        >
          <DayPicker
            mode="single"
            selected={currentDate}
            onSelect={setCurrentDate}
            fromDate={earliestReportDate}
            toDate={latestReportDate}
            captionLayout="dropdown-buttons"
            modifiersClassNames={{
              selected: datePickerSelected,
            }}
            disabled={isDisabled}
            defaultMonth={selectedDate}
            onMonthChange={setMonth}
            month={month}
            required
          />
        </ReportDateDropdown>
      )}
    </>
  );
};

export default ReportDayPicker;
