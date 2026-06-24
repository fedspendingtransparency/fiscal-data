import React, { FunctionComponent } from 'react';
import { dropdown, dropdownContainer, entriesContainer, mainContainer, pagination } from '../calendar-entries.module.scss';
import { calendarEntry, dateStyle, timeStyle, title, titleAndIcon } from '../calendar-entry/calendar-entry.module.scss';
import { bar, controlPlaceholder, dateBar, paginationPlaceholder, statusDot, timeBar, titleBar } from './calendar-entries-skeleton.module.scss';

interface ICalendarEntriesSkeleton {
  count?: number;
}

const CalendarEntriesSkeleton: FunctionComponent<ICalendarEntriesSkeleton> = ({ count = 25 }) => {
  return (
    <div className={mainContainer} data-testid="calendarEntriesSkeleton" aria-busy="true" aria-label="Loading release calendar">
      <div className={dropdownContainer}>
        <div className={dropdown}>
          <div className={controlPlaceholder} />
        </div>
      </div>
      <div className={entriesContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <div className={calendarEntry} key={i}>
            <div className={titleAndIcon}>
              <div className={statusDot} />
              <div className={title}>
                <span className={`${bar} ${titleBar}`} />
              </div>
            </div>
            <div className={dateStyle}>
              <span className={`${bar} ${dateBar}`} />
            </div>
            <div className={timeStyle}>
              <span className={`${bar} ${timeBar}`} />
            </div>
          </div>
        ))}
      </div>
      <div className={pagination}>
        <div className={paginationPlaceholder} />
      </div>
    </div>
  );
};

export default CalendarEntriesSkeleton;
