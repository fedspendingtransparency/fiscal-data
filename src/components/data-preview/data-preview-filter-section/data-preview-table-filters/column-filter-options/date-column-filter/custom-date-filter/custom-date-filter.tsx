import React, { FunctionComponent, useEffect, useLayoutEffect, useState } from 'react';
import DropdownLabelButton from '../../../../../../dropdown-label-button/dropdown-label-button';
import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar';
import DropdownContainer from '../../../../../../dropdown-container/dropdown-container';
import { formatReportDate } from '../../../../../../../helpers/dataset-detail/report-helpers';
import { customDatesContainer } from './custom-date-filter.module.scss';
import { ICustomDateFilter } from '../../../../../../../models/data-preview/ICustomDateFilter';
import { isBefore } from 'date-fns';
import DaySelector from '../../../../../../date-picker/day-selector/day-selector';

const CustomDateFilter: FunctionComponent<ICustomDateFilter> = ({ pickerDateRange, disabled, columnConfig }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(null);
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);

  const handleStartDateClose = () => setStartDateActive(false);
  const handleEndDateClose = () => setEndDateActive(false);

  useLayoutEffect(() => {
    handleStartDateClose();
    handleEndDateClose();
    setSelectedStartDate(columnConfig?.pendingStartDate ? columnConfig?.pendingStartDate : new Date(columnConfig?.defaultStartDate));
    setSelectedEndDate(columnConfig?.pendingEndDate ? columnConfig?.pendingEndDate : new Date(columnConfig?.defaultEndDate));
  }, [columnConfig]);

  const swapDates = () => {
    const startDate = selectedStartDate;
    setSelectedStartDate(selectedEndDate);
    setSelectedEndDate(startDate);
  };

  useEffect(() => {
    if (isBefore(selectedEndDate, selectedStartDate)) {
      swapDates();
    } else {
      columnConfig['pendingStartDate'] = selectedStartDate;
      columnConfig['pendingEndDate'] = selectedEndDate;
    }
  }, [selectedStartDate, selectedEndDate]);

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
      <DropdownContainer setActive={setStartDateActive} active={startDateActive} dropdownButton={startDateButton}>
        <DaySelector
          handleClose={handleStartDateClose}
          selectedDate={selectedStartDate}
          setSelectedDate={date => setSelectedStartDate(date)}
          latestDate={pickerDateRange && new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
          earliestDate={pickerDateRange && new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
          active={startDateActive}
          label="Enter Start Date"
          minDateErrorMessage="Date should not be before minimal date"
          maxDateErrorMessage="Date should not be after maximal date"
          required={!!pickerDateRange}
        />
      </DropdownContainer>
      <DropdownContainer setActive={setEndDateActive} active={endDateActive} dropdownButton={endDateButton}>
        <DaySelector
          handleClose={handleEndDateClose}
          selectedDate={selectedEndDate}
          setSelectedDate={date => setSelectedEndDate(date)}
          latestDate={pickerDateRange && new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
          earliestDate={pickerDateRange && new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
          active={endDateActive}
          label="Enter End Date"
          minDateErrorMessage="Date should not be before minimal date"
          maxDateErrorMessage="Date should not be after maximal date"
          required={!!pickerDateRange}
        />
      </DropdownContainer>
    </div>
  );
};

export default CustomDateFilter;
