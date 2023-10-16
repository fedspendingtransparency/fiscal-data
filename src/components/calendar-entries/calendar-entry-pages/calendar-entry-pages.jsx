import React from 'react';
import CalendarEntry from '../calendar-entry/calendar-entry';
import { separateEntriesByDate, separateEntriesByName } from '../calendar-entry-sort-helper/calendar-entry-sort-helper';
import * as styles from './calendar-entry-pages.module.scss';

const CalendarEntryPages = ({ entries, activePage, selectedOption, entriesPerPage, earliestDate }) => {
  // Separate the entries into separate chunks of (entriesPerPage) length
  // (since they should already be in correct order)
  const chunkedEntries = [];
  for (let i = 0; i < entries.length; i += entriesPerPage) {
    chunkedEntries.push(entries.slice(i, i + entriesPerPage));
  }

  const pages = [];

  for (const group of chunkedEntries) {
    const separatedEntries = selectedOption.id === 'name' ? separateEntriesByName(group) : separateEntriesByDate(group);
    const calendarEntries = [];

    for (const separator in separatedEntries) {
      calendarEntries.push(
        <div className={styles.entriesGroup}>
          <div className={styles.separator}>{separator}</div>
          {separatedEntries[separator].map(d => (
            <CalendarEntry
              key={`${d.dataset.name}${d.date}${d.time}`}
              dataset={{
                name: d.dataset.name,
                date: d.date,
                time: d.time,
                url: d.dataset.slug,
                released: `${d.released}` === 'true',
              }}
              earliestDate={earliestDate}
            />
          ))}
        </div>
      );
    }

    pages.push(calendarEntries.map((entry, key) => ({ ...entry, key })));
  }

  return pages[activePage - 1];
};

export default CalendarEntryPages;
