import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownLabelButton from '../../../../../../dropdown-label-button/dropdown-label-button';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../../../../../dropdown-container/dropdown-container';
import { formatReportDate } from '../../../../../../../helpers/dataset-detail/report-helpers';
import { customDatesContainer } from './custom-date-filter.module.scss';
import { ICustomDateFilter } from '../../../../../../../models/data-preview/ICustomDateFilter';
import { isBefore } from 'date-fns';
import DaySelector from '../../../../../../date-picker/day-selector/day-selector';

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

  const setMostAppropriatePreset = () => {
    // We need to pass back the date range for the new data table. Note, the actual dates
    // might not be the same from the previously selected table, even though the preset is
    // the same.
    //TODO adjust logic for external custom pickers
    const adjustedRange = fitDateRangeToTable(dateRange, availableDateRange);
    setPickerDateRange(availableDateRange);
    setCurDateRange(adjustedRange);
    handleDateRangeChange(adjustedRange);

    return;

    //TODO: Add this logic back in when implementing default custom date range option
    if (datePreset === 'custom' && customRangePreset === 'latestQuarter') {
      idealDefaultPreset = presets.find(({ key }) => key === 'custom');

      const dateObj = new Date(Date.parse(datasetDateRange.latestDate));
      const quarterRange = {
        userSelected: {
          from: subQuarters(addDays(dateObj, 1), 1),
          to: dateObj,
        },
      };
      const adjRange = fitDateRangeToTable(quarterRange, availableDateRange);
      updateDateRange(adjRange);
    }
    // Check if the default date option is available in the preset list. If so, select the default
    // preset, else select the next available option.
    const defaultPresetIsFound = presets.some(preset => preset.key === idealDefaultPreset.key);
    let defaultKey = null;

    // If the desired default preset is not available because of the date range on the dataset
    // table, find the next appropriate button to highlight
    if (!defaultPresetIsFound) {
      for (let i = 0, il = fallbackPresets.length; i < il; i++) {
        const fallbackPreset = presets.find(p => p.key === fallbackPresets[i]);
        if (fallbackPreset) {
          defaultKey = fallbackPreset;
          break;
        }
      }
    } else {
      defaultKey = idealDefaultPreset;
    }
    applyPreset(defaultKey);
  };

  useEffect(() => {
    setMostAppropriatePreset();
  }, [presets]);

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
            <DaySelector
              handleClose={handleStartDateClose}
              selectedDate={selectedStartDate}
              setSelectedDate={setSelectedStartDate}
              latestDate={new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
              earliestDate={new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
              active={startDateActive}
              label="Enter Start Date"
              minDateErrorMessage={'Date should not be before minimal date'}
              maxDateErrorMessage={'Date should not be after maximal date'}
            />
          </DropdownContainer>
          <DropdownContainer setActive={setEndDateActive} active={endDateActive} dropdownButton={endDateButton}>
            <DaySelector
              handleClose={handleEndDateClose}
              selectedDate={selectedEndDate}
              setSelectedDate={setSelectedEndDate}
              latestDate={new Date(pickerDateRange.latestDate.replace(/-/g, '/'))}
              earliestDate={new Date(pickerDateRange.earliestDate.replace(/-/g, '/'))}
              active={endDateActive}
              label="Enter End Date"
              minDateErrorMessage={'Date should not be before minimal date'}
              maxDateErrorMessage={'Date should not be after maximal date'}
            />
          </DropdownContainer>
        </>
      )}
    </div>
  );
};

export default CustomDateFilter;
