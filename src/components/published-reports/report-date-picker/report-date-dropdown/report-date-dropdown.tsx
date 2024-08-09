import React, { FunctionComponent, ReactElement } from 'react';
import {
  applyButton,
  buttonContainer,
  cancelButton,
  checkIcon,
  dropdownContainer,
  publishedDateLabel,
  selectedDateDisplay,
} from './report-date-dropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface IReportDateDropdown {
  handleClose: () => void;
  handleApply: () => void;
  displayDate: string;
  children: ReactElement;
}

const ReportDateDropdown: FunctionComponent<IReportDateDropdown> = ({ handleClose, handleApply, displayDate, children }: IReportDateDropdown) => {
  return (
    <>
      <div className={dropdownContainer}>
        <div className={publishedDateLabel}>Published Date</div>
        <div className={selectedDateDisplay}>{displayDate}</div>
        {children}
        <div className={buttonContainer}>
          <button className={cancelButton} onClick={handleClose}>
            Cancel
          </button>
          <button className={applyButton} onClick={handleApply} aria-label="Apply Selected Date">
            <FontAwesomeIcon icon={faCheck} className={checkIcon} />
            Apply
          </button>
        </div>
      </div>
    </>
  );
};
export default ReportDateDropdown;
