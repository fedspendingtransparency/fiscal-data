import React, { FunctionComponent, useState } from 'react';
import ReportDayPicker from '../../../../../../published-reports/report-date-picker/report-day-picker/report-day-picker';
import DropdownLabelButton from '../../../../../../dropdown-label-button/dropdown-label-button';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../../../../../dropdown-container/dropdown-container';
import { formatReportDate } from '../../../../../../../helpers/dataset-detail/report-helpers';
import { customDatesContainer } from './custom-date-filter.module.scss';

const CustomDateFilter: FunctionComponent = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date('3/12/2019'));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date('3/12/2025'));
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);
  const handleStartDateClose = () => setStartDateActive(false);
  const handleEndDateClose = () => setEndDateActive(false);

  const startDateButton = (
    <DropdownLabelButton
      label="Start Date"
      selectedOption={formatReportDate(selectedStartDate, true, true)}
      icon={faCalendar}
      setActive={setStartDateActive}
      active={startDateActive}
      ariaLabel="Select Start Date"
    />
  );

  const endDateButton = (
    <DropdownLabelButton
      label="End Date"
      selectedOption={formatReportDate(selectedEndDate, true, true)}
      icon={faCalendar}
      setActive={setEndDateActive}
      active={endDateActive}
      ariaLabel="Select End Date"
    />
  );

  return (
    <div className={customDatesContainer}>
      <DropdownContainer setActive={setStartDateActive} active={startDateActive} dropdownButton={startDateButton}>
        <ReportDayPicker
          handleClose={handleStartDateClose}
          selectedDate={selectedStartDate}
          setSelectedDate={setSelectedStartDate}
          latestReportDate={new Date('3/12/2025')}
          earliestReportDate={new Date('3/12/2019')}
          active={startDateActive}
          label="Enter Start Date"
        />
      </DropdownContainer>
      <DropdownContainer setActive={setEndDateActive} active={endDateActive} dropdownButton={endDateButton}>
        <ReportDayPicker
          handleClose={handleEndDateClose}
          selectedDate={selectedEndDate}
          setSelectedDate={setSelectedEndDate}
          latestReportDate={new Date('3/12/2025')}
          earliestReportDate={new Date('3/12/2019')}
          active={endDateActive}
          label="Enter End Date"
        />
      </DropdownContainer>
    </div>
  );
};

export default CustomDateFilter;
