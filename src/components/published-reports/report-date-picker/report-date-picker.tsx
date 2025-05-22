import React, {FunctionComponent, useState} from 'react';
import MonthPicker from './month-picker/month-picker';
import ReportDayPicker from './report-day-picker/report-day-picker';
import {formatReportDate} from '../../../helpers/dataset-detail/report-helpers';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../dropdown-container/dropdown-container';

interface IMonthPicker {
  isDailyReport: boolean;
  latestReportDate: Date;
  earliestReportDate: Date;
  allReportDates: string[];
  allReportYears: string[];
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
  label: string;
}

const ReportDatePicker: FunctionComponent<IMonthPicker> = ({
  isDailyReport,
  latestReportDate,
  earliestReportDate,
  allReportDates,
  allReportYears,
  selectedDate,
  setSelectedDate,
  ignoreDisabled,
  label,
  noMatchErrorMessage,
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

  const handleClose = () => {
    setTimeout(() => {
      setActive(false);
    });
  };

  return (
    <DropdownContainer setActive={setActive} active={active} dropdownButton={dropdownButton}>
      <>
        {active && !isDailyReport && (
          <MonthPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleClose={handleClose}
            allReportDates={allReportDates}
            active={active}
            allReportYears={allReportYears}
            ignoreDisabled={ignoreDisabled}
          />
        )}
        {active && isDailyReport && (
          <ReportDayPicker
            handleClose={handleClose}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            latestReportDate={latestReportDate}
            earliestReportDate={earliestReportDate}
            allReportDates={allReportDates}
            active={active}
            label={label}
            noMatchErrorMessage={noMatchErrorMessage}
          />
        )}
      </>
    </DropdownContainer>
  );
};

export default ReportDatePicker;
