import React, { FunctionComponent, useEffect, useState } from 'react';
import ReportDateDropdown from '../report-date-dropdown/report-date-dropdown';
import { DayPicker } from 'react-day-picker';
import '../../data-table/data-table-header/date-range-filter/day-picker-overrides.css';
import 'react-day-picker/dist/style.css';
import { datePickerSelected } from '../../data-table/data-table-header/date-range-filter/date-range-filter.module.scss';
import { formatReportDate } from '../../../helpers/dataset-detail/report-helpers';

interface IReportDayPicker {
  handleClose: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const ReportDayPicker: FunctionComponent<IReportDayPicker> = ({ handleClose, setSelectedDate, selectedDate }: IReportDayPicker) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const handleApply = () => {
    setSelectedDate(currentDate);
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <ReportDateDropdown handleClose={handleClose} handleApply={handleApply} displayDate={formatReportDate(currentDate, true, true)}>
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
          defaultMonth={selectedDate}
        />
      </div>
    </ReportDateDropdown>
  );
};

export default ReportDayPicker;
