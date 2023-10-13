import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const separateEntriesByName = entries => {
  const separators = {};

  for (const entry of entries) {
    // Group all datasets that begin with a number together, e.g. 120 Day Delinquent Debt
    // Referral Compliance Report
    const firstLetter = !isNaN(parseInt(entry.dataset.name[0])) ? '#' : entry.dataset.name[0];

    if (separators[firstLetter]) {
      const newEntries = [...separators[firstLetter], entry];
      // Sort individual sections by name
      separators[firstLetter] = newEntries.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    } else {
      separators[firstLetter] = [entry];
    }
  }

  return separators;
};

export const separateEntriesByDate = entries => {
  const separators = {};

  for (const entry of entries) {
    const date = format(new Date(convertDateAndTimeToDateTime(entry.date, entry.time)), 'EEEE MMMM d, yyyy');

    if (separators[date]) {
      const newEntries = [...separators[date], entry];
      // Sort individual sections by time and then name
      // TODO: update with time factored in
      separators[date] = newEntries;
    } else {
      separators[date] = [entry];
    }
  }

  return separators;
};

export const convertDateAndTimeToDateTime = (dateString, timeStringInUTC) => {
  const time = `${timeStringInUTC[0]}${timeStringInUTC[1]}:${timeStringInUTC[2]}${timeStringInUTC[3]}:00`;
  const dateTimeString = `${dateString}T${time}.000Z`;
  const utcDateTime = new Date(dateTimeString);
  return utcToZonedTime(utcDateTime, 'America/New_York');
};
