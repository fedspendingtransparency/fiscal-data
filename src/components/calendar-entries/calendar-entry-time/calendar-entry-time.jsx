import React from 'react';
import { useEffect, useState } from 'react';
import { convertDateAndTimeToDateTime } from '../calendar-entry-sort-helper/calendar-entry-sort-helper';
import { getMinutes, getHours, format } from 'date-fns';

const CalendarEntryTime = ({ dateString, timeInUTC }) => {
  const [timeDisplay, setTimeDisplay] = useState();

  const generalTimeWindow = etTime => {
    if (getMinutes(etTime) !== 59) {
      return `${format(etTime, 'h:mm aaa')}`;
    }

    if (getHours(etTime) < 12) return 'Morning';
    if (getHours(etTime) < 16) return 'Afternoon';
    return 'Evening';
  };

  const calculateTime = (dateString, timeStringInUTC) => {
    const etTime = convertDateAndTimeToDateTime(dateString, timeStringInUTC);

    return generalTimeWindow(etTime);
  };

  useEffect(() => {
    setTimeDisplay(calculateTime(dateString, timeInUTC));
  }, []);

  return <span data-testid="time-display">{timeDisplay}</span>;
};

export default CalendarEntryTime;
