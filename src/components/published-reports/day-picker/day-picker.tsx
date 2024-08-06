import React, { FunctionComponent } from 'react';
import ReportDateDropdown from '../report-date-dropdown/report-date-dropdown';

interface IReportDayPicker {
  handleClose: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const ReportDayPicker: FunctionComponent<IReportDayPicker> = ({ handleClose, setSelectedDate, selectedDate }: IReportDayPicker) => {
  const handleApply = () => {
    setSelectedDate(' ');
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <ReportDateDropdown handleClose={handleClose} handleApply={handleApply} displayDate={' '}>
      <div>children .... </div>
    </ReportDateDropdown>
  );
};

export default ReportDayPicker;
