import React, { FunctionComponent, ReactElement, useState } from 'react';
import { applyButton, buttonContainer, cancelButton, checkIcon, dropdownContainer, inputContainer } from './date-dropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import DateTextInput from '../date-text-input/date-text-input';
import { analyticsEventHandler } from '../../../helpers/insights/insight-helpers';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';

interface IDateDropdown {
  handleClose: () => void;
  handleApply: () => void;
  setSelectedMonth?: (month: string) => void;
  setSelectedYear?: (year: string) => void;
  setCurrentDate?: (date: Date) => void;
  children: ReactElement;
  allDates: string[];
  selectedDate: string;
  daily?: boolean;
  label?: string;
  ariaLabel?: string;
  minDateErrorMessage?: string;
  maxDateErrorMessage?: string;
  fromDate?: Date;
  toDate?: Date;
  hideFooter?: boolean;
}

const DateDropdown: FunctionComponent<IDateDropdown> = ({
  handleClose,
  handleApply,
  setSelectedMonth,
  setSelectedYear,
  setCurrentDate,
  children,
  allDates,
  selectedDate,
  label,
  ariaLabel,
  minDateErrorMessage,
  maxDateErrorMessage,
  fromDate,
  toDate,
  hideFooter,
}: IDateDropdown) => {
  const [validInput, setValidInput] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const handleApplyGa4Click = () => {
    const eventLabel = selectedDate;
    const eventAction = 'Published Report Date Selection';
    analyticsEventHandler('Data Download', eventLabel, eventAction);
    ga4DataLayerPush({
      event: eventAction,
      eventLabel: eventLabel,
    });
  };

  const handleDropdownApply = () => {
    handleApplyGa4Click();
    handleApply();
  };

  return (
    <>
      <div className={dropdownContainer}>
        <div className={inputContainer}>
          <DateTextInput
            label={label}
            ariaLabel={ariaLabel}
            validInput={validInput}
            setValidInput={setValidInput}
            inputFocus={inputFocus}
            setInputFocus={setInputFocus}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            allDates={allDates}
            selectedDate={selectedDate}
            setCurrentDate={setCurrentDate}
            minDateErrorMessage={minDateErrorMessage}
            maxDateErrorMessage={maxDateErrorMessage}
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>
        {children}
        {!hideFooter && (
          <div className={buttonContainer}>
            <button className={cancelButton} onClick={handleClose}>
              Cancel
            </button>
            <button
              className={applyButton}
              id="apply-date-publish-report"
              onClick={handleDropdownApply}
              aria-label="Apply Selected Date"
              disabled={inputFocus && !validInput}
            >
              <FontAwesomeIcon icon={faCheck} className={checkIcon} />
              Apply
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default DateDropdown;
