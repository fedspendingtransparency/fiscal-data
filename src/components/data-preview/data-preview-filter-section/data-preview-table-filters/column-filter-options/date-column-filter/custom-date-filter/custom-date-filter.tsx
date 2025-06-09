import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownLabelButton from '../../../../../../dropdown-label-button/dropdown-label-button';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../../../../../dropdown-container/dropdown-container';
import { formatReportDate } from '../../../../../../../helpers/dataset-detail/report-helpers';
import { customDatesContainer } from './custom-date-filter.module.scss';
import { ICustomDateFilter } from '../../../../../../../models/data-preview/ICustomDateFilter';
import { isBefore } from 'date-fns';
import DaySelector from '../../../../../../date-picker/day-selector/day-selector';

const CustomDateFilter: FunctionComponent<ICustomDateFilter> = ({ pickerDateRange, disabled, hasPresets }) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(null);
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);
  const [startDateChosen, setStartDateChosen] = useState(false);
  const [endDateChosen, setEndDateChosen] = useState(false);

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
  console.log('selectedStartDate', selectedStartDate);

  const startDateButton = (
    <DropdownLabelButton
      label="Start Date"
      selectedOption={hasPresets || selectedStartDate ? formatReportDate(selectedStartDate, true, true) : null}
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
      selectedOption={hasPresets ? formatReportDate(selectedEndDate, true, true) : null}
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
            <DaySelector
              handleClose={handleStartDateClose}
              selectedDate={hasPresets ? selectedStartDate : null}
              setSelectedDate={setSelectedStartDate}
              latestDate={new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
              earliestDate={new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
              active={startDateActive}
              label="Enter Start Date"
              minDateErrorMessage={'Date should not be before minimal date'}
              maxDateErrorMessage={'Date should not be after maximal date'}
              hasPresets={hasPresets}
            />
          </DropdownContainer>
          <DropdownContainer setActive={setEndDateActive} active={endDateActive} dropdownButton={endDateButton}>
            <DaySelector
              handleClose={handleEndDateClose}
              selectedDate={hasPresets ? selectedEndDate : null}
              setSelectedDate={setSelectedEndDate}
              latestDate={new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
              earliestDate={new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
              active={endDateActive}
              label="Enter End Date"
              minDateErrorMessage={'Date should not be before minimal date'}
              maxDateErrorMessage={'Date should not be after maximal date'}
              hasPresets={hasPresets}
            />
          </DropdownContainer>
        </>
      )}
    </div>
  );
};

export default CustomDateFilter;
