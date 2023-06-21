import React, { useEffect, useState } from "react"
import * as styles from './calendar-entry.module.scss';
import { navigate } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-solid-svg-icons';
import CalendarEntryStatus from "../calender-entry-status/calendar-entry-status";
import CalendarEntryTime from "../calendar-entry-time/calendar-entry-time";
import Analytics from "../../../utils/analytics/analytics";
import { convertDateAndTimeToDateTime } from "../calendar-entry-sort-helper/calendar-entry-sort-helper";
import { format } from 'date-fns';

export const releaseCalendarDatasetClickEvent = {
  category: 'Release Calendar',
  action: 'Dataset Click'
}

const CalendarEntry = ({ dataset, earliestDate }) => {
  const { name, date, time, url, released } = dataset;

  const [formattedDate, setFormattedDate] = useState();

  const handleClick = () => {
    const label = earliestDate === date ? `${name} Current Date` : `${name} Future Date`
    Analytics.event({
      ...releaseCalendarDatasetClickEvent,
      label
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': releaseCalendarDatasetClickEvent.action,
      'eventLabel': label,
    });

    navigate(`/datasets${url}`);
  }

  useEffect(() => {
    const convertedDateTime = convertDateAndTimeToDateTime(date, time);

    setFormattedDate(format(convertedDateTime, 'MM/dd/yyyy'));
  }, []);

  return (
    <button
      onClick={handleClick}
      className={styles.calendarEntry}
      data-testid="calendar-entry"
    >
      <div className={styles.titleAndIcon}>
        <CalendarEntryStatus isReleased={released} />
        <div className={styles.title} data-testid="title">
          {name}
        </div>
      </div>
      <div className={styles.date} data-testid="date">
        <FontAwesomeIcon icon={faCalendar} className={styles.dateIcon} />
        {formattedDate}
      </div>
      <div className={styles.time} data-testid="time">
        <FontAwesomeIcon icon={faClock} className={styles.timeIcon} />
        <CalendarEntryTime dateString={date} timeInUTC={time} />
      </div>
    </button>
  );
}

export default CalendarEntry;
