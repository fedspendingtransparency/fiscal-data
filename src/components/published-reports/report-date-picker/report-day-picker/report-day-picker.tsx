import React, { FunctionComponent, useState } from 'react';
import ReportDateDropdown from '../report-date-dropdown/report-date-dropdown';
import { DayPicker } from 'react-day-picker';
import '../../../data-table/data-table-header/date-range-filter/day-picker-overrides.css';
import 'react-day-picker/dist/style.css';
import { datePickerSelected } from './report-day-picker.module.scss';
import { formatReportDate } from '../../../../helpers/dataset-detail/report-helpers';

interface IReportDayPicker {
  handleClose: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  latestReportDate: Date;
  earliestReportDate: Date;
  allReportDates: string[];
}

const ReportDayPicker: FunctionComponent<IReportDayPicker> = ({
  handleClose,
  setSelectedDate,
  selectedDate,
  latestReportDate,
  earliestReportDate,
  allReportDates,
}: IReportDayPicker) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const handleApply = () => {
    setSelectedDate(currentDate !== undefined ? currentDate : latestReportDate);
    if (handleClose) {
      handleClose();
    }
  };

  const isDisabled = (day: Date) => {
    return !allReportDates.includes(day.toDateString());
  };

  return (
    <ReportDateDropdown
      handleClose={handleClose}
      handleApply={handleApply}
      displayDate={currentDate !== undefined && formatReportDate(currentDate, true, true)}
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
        defaultMonth={latestReportDate}
      />
    </ReportDateDropdown>
  );
};

export default ReportDayPicker;