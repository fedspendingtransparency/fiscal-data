import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownLabelButton from '../../../../../../dropdown-label-button/dropdown-label-button';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../../../../../dropdown-container/dropdown-container';
import { formatReportDate } from '../../../../../../../helpers/dataset-detail/report-helpers';
import { customDatesContainer } from './custom-date-filter.module.scss';
import { ICustomDateFilter } from '../../../../../../../models/data-preview/ICustomDateFilter';
import { addDays, isBefore, subQuarters } from 'date-fns';
import DaySelector from '../../../../../../date-picker/day-selector/day-selector';
import determineDateRange, {
  generateAnalyticsEvent,
  generateFormattedDate,
} from '../../../../../../filter-download-container/range-presets/helpers/helper';

const CustomDateFilter: FunctionComponent<ICustomDateFilter> = ({
  pickerDateRange,
  disabled,
  // setPickerDateRange,
  // handleDateRangeChange,
  // datasetDateRange,
  // currentDateButton,
  // selectedToggle,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(null);
  const [startDateActive, setStartDateActive] = useState(false);
  const [endDateActive, setEndDateActive] = useState(false);
  // const [dateRange, setCurDateRange] = useState(null);
  // const [availableDateRange, setAvailableDateRange] = useState(null);
  // const [activePresetKey, setActivePresetKey] = useState(null);
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

  // const applyPreset = preset => {
  //   let label = '';
  //   if (true) {
  //     label = generateFormattedDate(dateRange);
  //   }
  //   generateAnalyticsEvent(label);
  //   setActivePresetKey('custom');
  //   prepUpdateDateRange(preset);
  // };
  //
  // const prepUpdateDateRange = preset => {
  //   const curDateRange = determineDateRange(availableDateRange, preset, currentDateButton);
  //   updateDateRange(curDateRange);
  // };

  // const updateDateRange = curDateRange => {
  //   if (curDateRange) {
  //     console.log('curDateRange: ', curDateRange);
  //     setPickerDateRange({ ...availableDateRange, from: curDateRange.from, to: curDateRange.to });
  //     setCurDateRange(curDateRange);
  //     handleDateRangeChange(curDateRange);
  //   }
  // };
  //
  // const setMostAppropriatePreset = () => {
  //   // We need to pass back the date range for the new data table. Note, the actual dates
  //   // might not be the same from the previously selected table, even though the preset is
  //   // the same.
  //   //TODO adjust logic for external custom pickers
  //   console.log('drange', dateRange);
  //   const adjustedRange = fitDateRangeToTable(dateRange, availableDateRange);
  //   setPickerDateRange(availableDateRange);
  //   setCurDateRange(adjustedRange);
  //   handleDateRangeChange(adjustedRange);
  //
  //   return;
  //
  //   //TODO: Add this logic back in when implementing default custom date range option
  //
  //   // if (datePreset === 'custom' && customRangePreset === 'latestQuarter') {
  //   //   idealDefaultPreset = presets.find(({ key }) => key === 'custom');
  //
  //   const dateObj = new Date(Date.parse(datasetDateRange.latestDate));
  //   const quarterRange = {
  //     userSelected: {
  //       from: subQuarters(addDays(dateObj, 1), 1),
  //       to: dateObj,
  //     },
  //   };
  //   const adjRange = fitDateRangeToTable(quarterRange, availableDateRange);
  //   updateDateRange(adjRange);
  //   console.log('quarterRange: ', quarterRange);
  //   // }
  //   // Check if the default date option is available in the preset list. If so, select the default
  //   // preset, else select the next available option.
  //
  //   // let defaultKey = null;
  //
  //   // If the desired default preset is not available because of the date range on the dataset
  //   // table, find the next appropriate button to highlight
  //   // if (!defaultPresetIsFound) {
  //   //   for (let i = 0, il = fallbackPresets.length; i < il; i++) {
  //   //     const fallbackPreset = presets.find(p => p.key === fallbackPresets[i]);
  //   //     if (fallbackPreset) {
  //   //       defaultKey = fallbackPreset;
  //   //       break;
  //   //     }
  //   //   }
  //   // } else {
  //   //   // defaultKey = idealDefaultPreset;
  //   // }
  //   applyPreset('custom');
  //
  //   console.log(quarterRange, availableDateRange);
  // };
  //
  // useEffect(() => {
  //   setMostAppropriatePreset();
  // }, [selectedToggle]);

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
//
// export const fitDateRangeToTable = (dateRange, availableRange) => {
//   console.log(dateRange);
//   console.log(availableRange);
//   // if there's a userSelected range stored, start with that instead of whatever it was adjusted to
//   const selectedRange = dateRange.userSelected ? dateRange.userSelected : dateRange;
//   // const selectedRange = dateRange;
//   const adjRange = Object.assign({}, selectedRange);
//   if (selectedRange.to < availableRange.from) {
//     // the whole selected range comes before new available range, so set both dates to the earliest
//     // available
//     adjRange.to = adjRange.from = availableRange.from;
//     adjRange.userSelected = selectedRange; // store the range as it was when requested
//     return adjRange;
//   }
//   if (selectedRange.from > availableRange.to) {
//     // the whole selected range comes after new available range, so set both dates to the latest
//     // available
//     adjRange.to = adjRange.from = availableRange.to;
//     adjRange.userSelected = selectedRange; // store the range as it was when requested
//     return adjRange;
//   }
//   adjRange.from = selectedRange.from > availableRange.from ? selectedRange.from : availableRange.from;
//   adjRange.to = selectedRange.to < availableRange.to ? selectedRange.to : availableRange.to;
//   if (adjRange.from.getTime() === selectedRange.from.getTime() && adjRange.to.getTime() === selectedRange.to.getTime()) {
//     // able to use the full latest user selected range as-is, so don't store it separately
//     delete adjRange.userSelected;
//   } else {
//     adjRange.userSelected = selectedRange; // store the range as it was when requested
//   }
//   return adjRange;
// };
