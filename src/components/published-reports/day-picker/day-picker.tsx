import React, { FunctionComponent, useEffect, useState } from 'react';
import ReportDateDropdown from '../report-date-dropdown/report-date-dropdown';
import { DayPicker } from 'react-day-picker';
import '../../data-table/data-table-header/date-range-filter/day-picker-overrides.css';
import 'react-day-picker/dist/style.css';
import { datePickerSelected } from '../../data-table/data-table-header/date-range-filter/date-range-filter.module.scss';

interface IReportDayPicker {
  handleClose: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const ReportDayPicker: FunctionComponent<IReportDayPicker> = ({ handleClose, setSelectedDate, selectedDate }: IReportDayPicker) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const handleApply = () => {
    setSelectedDate(currentDate.toDateString());
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <ReportDateDropdown handleClose={handleClose} handleApply={handleApply} displayDate={currentDate.toDateString()}>
      <div>
        <DayPicker
          mode="single"
          selected={currentDate}
          onSelect={setCurrentDate}
          fromYear={1900}
          toYear={2099}
          captionLayout="dropdown-buttons"
          modifiersClassNames={{
            selected: datePickerSelected,
          }}
        />
      </div>
    </ReportDateDropdown>
  );
};

export default ReportDayPicker;
