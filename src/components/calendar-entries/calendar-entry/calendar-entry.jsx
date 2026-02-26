import React, { useEffect, useState } from 'react';
import { calendarEntry, dateIcon, dateStyle, timeIcon, timeStyle, title, titleAndIcon } from './calendar-entry.module.scss';
import { navigate } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import CalendarEntryStatus from '../calender-entry-status/calendar-entry-status';
import CalendarEntryTime from '../calendar-entry-time/calendar-entry-time';
import Analytics from '../../../utils/analytics/analytics';
import { convertDateAndTimeToDateTime } from '../calendar-entry-sort-helper/calendar-entry-sort-helper';
import { format } from 'date-fns';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';

export const releaseCalendarDatasetClickEvent = {
  category: 'Release Calendar',
  action: 'Dataset Click',
};

const CalendarEntry = ({ dataset, earliestDate }) => {
  const { name, date, time, url, released } = dataset;

  const [formattedDate, setFormattedDate] = useState();

  const handleClick = () => {
    const label = earliestDate === date ? `${name} Current Date` : `${name} Future Date`;
    Analytics.event({
      ...releaseCalendarDatasetClickEvent,
      label,
    });
    ga4DataLayerPush({
      event: releaseCalendarDatasetClickEvent.action,
      eventLabel: label,
    });

    navigate(`/datasets${url}`);
  };

  useEffect(() => {
    const convertedDateTime = convertDateAndTimeToDateTime(date, time);
    setFormattedDate(format(convertedDateTime, 'MM/dd/yyyy'));
  }, []);

  return (
    <button onClick={handleClick} className={calendarEntry} data-testid="calendar-entry">
      <div className={titleAndIcon}>
        <CalendarEntryStatus isReleased={released} />
        <div className={title} data-testid="title">
          {name}
        </div>
      </div>
      <div className={dateStyle} data-testid="date">
        <FontAwesomeIcon icon={faCalendar} className={dateIcon} />
        {formattedDate}
      </div>
      <div className={timeStyle} data-testid="time">
        <FontAwesomeIcon icon={faClock} className={timeIcon} />
        <CalendarEntryTime dateString={date} timeInUTC={time} />
      </div>
    </button>
  );
};

export default CalendarEntry;
