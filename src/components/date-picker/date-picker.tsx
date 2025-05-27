import React, {FunctionComponent, useState} from 'react';
import MonthPicker from './month-picker/month-picker';
import DaySelector from './day-selector/day-selector';
import {formatReportDate} from '../../helpers/dataset-detail/report-helpers';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import DropdownLabelButton from '../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../dropdown-container/dropdown-container';

interface IMonthPicker {
  isDaily: boolean;
  latestDate: Date;
  earliestDate: Date;
  allDates: string[];
  allYears: string[];
  selectedDate: Date;
  setSelectedDate: (value: Date) => void;
  label: string;
  minDateErrorMessage: string;
  maxDateErrorMessage: string;
}

const DatePicker: FunctionComponent<IMonthPicker> = ({
  isDaily,
  latestDate,
  earliestDate,
  allDates,
  allYears,
  selectedDate,
  setSelectedDate,
  ignoreDisabled,
  label,
  minDateErrorMessage,
  maxDateErrorMessage,
}: IMonthPicker) => {
  const [active, setActive] = useState(false);

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
      setActive(false);
    });
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
            minDateErrorMessage={minDateErrorMessage}
            maxDateErrorMessage={maxDateErrorMessage}
          />
        )}
      </>
    </DropdownContainer>
  );
};

export default DatePicker;
