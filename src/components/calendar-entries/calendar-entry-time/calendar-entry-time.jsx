import React from 'react';
import { useEffect, useState } from 'react';
import { convertDateAndTimeToUTCDate, getLocalTimeZone } from '../calendar-entry-sort-helper/calendar-entry-sort-helper';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { getMinutes, getHours } from 'date-fns';

const CalendarEntryTime = ({ dateString, timeInUTC }) => {
  const [timeDisplay, setTimeDisplay] = useState();

  const generalTimeWindow = (localTime, utcTime, localZone) => {
    if (getMinutes(localTime) !== 59) {
      // e.g. "8:00 am EST" — the zzz token labels the viewer's timezone so it's
      // clear which zone the time is shown in.
      return formatInTimeZone(utcTime, localZone, 'h:mm aaa zzz');
    }

    if (getHours(localTime) < 12) return 'Morning';
    if (getHours(localTime) < 16) return 'Afternoon';
    return 'Evening';
  };

  const calculateTime = (dateString, timeStringInUTC) => {
    // Convert the UTC instant to the viewer's local timezone for display.
    const utcTime = convertDateAndTimeToUTCDate(dateString, timeStringInUTC);
    const localZone = getLocalTimeZone();
    const localTime = toZonedTime(utcTime, localZone);

    return generalTimeWindow(localTime, utcTime, localZone);
  };

  useEffect(() => {
    setTimeDisplay(calculateTime(dateString, timeInUTC));
  }, []);

  return <span data-testid="time-display">{timeDisplay}</span>;
};

export default CalendarEntryTime;
