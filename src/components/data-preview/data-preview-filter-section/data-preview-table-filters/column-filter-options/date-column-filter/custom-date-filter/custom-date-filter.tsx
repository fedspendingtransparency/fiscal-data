import React, { FunctionComponent, useEffect, useState } from 'react';
import ReportDayPicker from '../../../../../../published-reports/report-date-picker/report-day-picker/report-day-picker';
import DropdownLabelButton from '../../../../../../dropdown-label-button/dropdown-label-button';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../../../../../dropdown-container/dropdown-container';
import { formatReportDate } from '../../../../../../../helpers/dataset-detail/report-helpers';
import { customDatesContainer } from './custom-date-filter.module.scss';
import { ICustomDateFilter } from '../../../../../../../models/data-preview/ICustomDateFilter';
import { isBefore } from 'date-fns';

const CustomDateFilter: FunctionComponent<ICustomDateFilter> = ({ pickerDateRange, disabled }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(null);
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);
  const handleStartDateClose = () => setStartDateActive(false);
  const handleEndDateClose = () => setEndDateActive(false);

  const swapDates = () => {
    const startDate = selectedStartDate;
    setSelectedStartDate(selectedEndDate);
    setSelectedEndDate(startDate);
  };

  useEffect(() => {
    if (isBefore(selectedEndDate, selectedStartDate)) {
      swapDates();
    }
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    if (pickerDateRange?.from && pickerDateRange?.to) {
      setSelectedStartDate(pickerDateRange.from);
      setSelectedEndDate(pickerDateRange.to);
    }
  }, [pickerDateRange]);

  const startDateButton = (
    <DropdownLabelButton
      label="Start Date"
      selectedOption={formatReportDate(selectedStartDate, true, true)}
      icon={faCalendar}
      setActive={setStartDateActive}
      active={startDateActive}
      ariaLabel="Select Start Date"
      disabled={disabled}
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
      disabled={disabled}
    />
  );

  return (
    <div className={customDatesContainer}>
      {pickerDateRange && selectedStartDate && selectedEndDate && (
        <>
          <DropdownContainer setActive={setStartDateActive} active={startDateActive} dropdownButton={startDateButton}>
            <ReportDayPicker
              handleClose={handleStartDateClose}
              selectedDate={selectedStartDate}
              setSelectedDate={setSelectedStartDate}
              latestReportDate={new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
              earliestReportDate={new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
              active={startDateActive}
              label="Enter Start Date"
            />
          </DropdownContainer>
          <DropdownContainer setActive={setEndDateActive} active={endDateActive} dropdownButton={endDateButton}>
            <ReportDayPicker
              handleClose={handleEndDateClose}
              selectedDate={selectedEndDate}
              setSelectedDate={setSelectedEndDate}
              latestReportDate={new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
              earliestReportDate={new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
              active={endDateActive}
              label="Enter End Date"
            />
          </DropdownContainer>
        </>
      )}
    </div>
  );
};

export default CustomDateFilter;
