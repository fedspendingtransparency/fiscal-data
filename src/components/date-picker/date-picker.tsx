import React, { FunctionComponent, useEffect, useState } from 'react';
import MonthPicker from './month-picker/month-picker';
import DaySelector from './day-selector/day-selector';
import { formatReportDate } from '../../helpers/dataset-detail/report-helpers';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownLabelButton from '../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../dropdown-container/dropdown-container';

interface IDatePicker {
  isDaily: boolean;
  latestDate: Date;
  earliestDate: Date;
  allDates: string[];
  allYears: string[];
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
  label?: string;
  ariaLabel?: string;
  minDateErrorMessage?: string;
  maxDateErrorMessage?: string;
  ignoreDisabled?: boolean;
}

const DatePicker: FunctionComponent<IDatePicker> = ({
  isDaily,
  latestDate,
  earliestDate,
  allDates,
  allYears,
  selectedDate,
  setSelectedDate,
  ignoreDisabled,
  label,
  ariaLabel,
  minDateErrorMessage,
  maxDateErrorMessage,
}: IDatePicker) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active && isDaily && typeof setSelectedDate === 'function') {
      setSelectedDate(selectedDate);
    }
  }, [active, isDaily, selectedDate, setSelectedDate]);

  const dropdownButton = (
    <DropdownLabelButton
      label="Published Date"
      selectedOption={formatReportDate(selectedDate, true, isDaily)}
      icon={faCalendar}
      setActive={setActive}
      active={active}
      ariaLabel="Select Published Date"
    />
  );

  const handleClose = () => {
    setTimeout(() => {
      if (typeof setSelectedDate === 'function') {
        setSelectedDate(selectedDate);
      }
      setActive(false);
    }, 0);
  };

  return (
    <DropdownContainer setActive={setActive} active={active} dropdownButton={dropdownButton}>
      <>
        {active && !isDaily && (
          <MonthPicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleClose={handleClose}
            allReportDates={allDates}
            active={active}
            allReportYears={allYears}
            ignoreDisabled={ignoreDisabled}
            latestDate={latestDate}
            earliestDate={earliestDate}
          />
        )}
        {active && isDaily && (
          <DaySelector
            handleClose={handleClose}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            latestDate={latestDate}
            earliestDate={earliestDate}
            allDates={allDates}
            active={active}
            label={label}
            ariaLabel={ariaLabel}
            minDateErrorMessage={minDateErrorMessage}
            maxDateErrorMessage={maxDateErrorMessage}
          />
        )}
      </>
    </DropdownContainer>
  );
};

export default DatePicker;
