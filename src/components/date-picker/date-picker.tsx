import React, { FunctionComponent, useState } from 'react';
import MonthPicker from './month-picker/month-picker';
import DaySelector from './day-selector/day-selector';
import { formatReportDate } from '../../helpers/dataset-detail/report-helpers';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import DropdownLabelButton from '../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../dropdown-container/dropdown-container';
import GridMonthPicker from './grid-month-picker/grid-month-picker';

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
  label = 'Published Date',
  searchLabel,
  ariaLabel,
  minDateErrorMessage,
  maxDateErrorMessage,
  generatedReport,
  buttonDisabled,
}: IDatePicker) => {
  const [active, setActive] = useState(false);

  const dropdownButton = (
    <DropdownLabelButton
      label={label}
      selectedOption={formatReportDate(selectedDate, true, isDaily)}
      icon={faCalendar}
      setActive={setActive}
      active={active}
      ariaLabel="Select Published Date"
      disabled={buttonDisabled}
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
        {active && !isDaily && generatedReport && (
          <GridMonthPicker
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
        {active && !isDaily && !generatedReport && (
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
            label={searchLabel}
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
