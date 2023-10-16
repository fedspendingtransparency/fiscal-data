import { isAfter, isBefore, isEqual, isValid } from 'date-fns';

export const isValidDateRange = (startDate, endDate, earliestDate, latestDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const earliest = new Date(earliestDate);
  const latest = new Date(`${latestDate} 23:59:59`);

  // start date or end date are invalid
  if (!isValid(start) || !isValid(end)) {
    return false;
  }
  // start date is before the earliest date
  if (isBefore(start, earliest) && !isEqual(start, earliest)) {
    return false;
  }

  // end date is after the latest date
  if (isAfter(end, latest)) {
    return false;
  }

  return true;
};
