import React, {FunctionComponent, useEffect, useState} from 'react';
import DateDropdown from '../date-dropdown/date-dropdown';
import {DayPicker} from 'react-day-picker';
import '../../data-table/data-table-header/date-range-filter/day-picker-overrides.css';
import 'react-day-picker/dist/style.css';
import {datePickerSelected} from './day-selector.module.scss';
import {formatReportDate} from '../../../helpers/dataset-detail/report-helpers';
import {monthFullNames} from '../../../utils/api-utils';

interface IDaySelector {
  handleClose: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  latestDate: Date;
  earliestDate: Date;
  allDates?: string[];
  active: boolean;
  label?: string;
  minDateErrorMessage?: string;
  maxDateErrorMessage?: string;
}

const DaySelector: FunctionComponent<IDaySelector> = ({
  handleClose,
  setSelectedDate,
  selectedDate,
  latestDate,
  earliestDate,
  allDates,
  active,
  label,
  minDateErrorMessage,
  maxDateErrorMessage,
}: IDaySelector) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate);
  const [month, setMonth] = useState<Date>(selectedDate);
  const handleApply = () => {
    setSelectedDate(currentDate !== undefined ? currentDate : latestDate);
    if (handleClose) {
      handleClose();
    }
  };

  const isDisabled = (day: Date) => {
    if (allDates) {
      const targetMonth = monthFullNames[day.getMonth()];
      const targetDay = day.getDate();
      const targetYear = day.getFullYear();
      const dateStr = targetMonth + ' ' + targetDay + ', ' + targetYear;
      return !allDates.includes(dateStr);
    }
  };

  useEffect(() => {
    if (!active) {
      setCurrentDate(selectedDate);
    }
  }, [active]);

  useEffect(() => {
    setMonth(currentDate);
  }, [currentDate]);

  return (
    <>
      {active && (
        <DateDropdown
          handleClose={handleClose}
          handleApply={handleApply}
          setCurrentDate={setCurrentDate}
          selectedDate={currentDate !== undefined && formatReportDate(currentDate, true, true)}
          allDates={allDates}
          label={label}
          fromDate={earliestDate}
          toDate={latestDate}
          minDateErrorMessage={minDateErrorMessage}
          maxDateErrorMessage={maxDateErrorMessage}
        >
          <DayPicker
            mode="single"
            selected={currentDate}
            onSelect={setCurrentDate}
            fromDate={earliestDate}
            toDate={latestDate}
            captionLayout="dropdown-buttons"
            modifiersClassNames={{
              selected: datePickerSelected,
            }}
            disabled={isDisabled}
            defaultMonth={selectedDate}
            onMonthChange={setMonth}
            month={month ? month : undefined}
            required
          />
        </DateDropdown>
      )}
    </>
  );
};

export default DaySelector;
