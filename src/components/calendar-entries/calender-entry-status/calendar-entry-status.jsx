import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from "react"
import {
  calendarEntryStatus,
  updateStatusIcon,
  notYetUpdated
} from './calendar-entry-status.module.scss';

/**
 * @param isUpdated {boolean}
 * @constructor
 */
const CalendarEntryStatus = ({ isReleased }) => {
  const [updatedText, setIsUpdatedText] = useState('Not yet updated');

  useEffect(() => {
    if (isReleased === true) setIsUpdatedText('Updated');
  }, [isReleased]);

  return (
    <div className={calendarEntryStatus}>
      { isReleased
        ? <FontAwesomeIcon icon={faCheckCircle} className={updateStatusIcon} />
        : <div className={notYetUpdated} />
      }
      <span data-testid="updated-text">{updatedText}</span>
    </div>
  );
};
export default CalendarEntryStatus;
