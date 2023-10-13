import React from 'react';
import * as styles from './dataset-stats.module.scss';
import { isAfter } from 'date-fns';
import futureDateIcon from '../../../images/futureDateIcon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek, faSyncAlt, faCalendarCheck, faDatabase } from '@fortawesome/free-solid-svg-icons';

export default function DatasetStats({ dataset }) {
  // TODO: clean some of these up a little
  console.log(dataset);
  const earliestDate = dataset && dataset.techSpecs && dataset.techSpecs.earliestDate ? dataset.techSpecs.earliestDate : null;
  const latestDate = dataset && dataset.techSpecs && dataset.techSpecs.latestDate ? dataset.techSpecs.latestDate : null;
  const dateRange = earliestDate && latestDate ? `${earliestDate} - ${latestDate}` : undefined;
  const frequency = dataset && dataset.techSpecs && dataset.techSpecs.updateFrequency ? dataset.techSpecs.updateFrequency : 'no frequency available';
  const lastUpdated = dataset && dataset.techSpecs && dataset.techSpecs.lastUpdated ? dataset.techSpecs.lastUpdated : 'no date available';
  const latestDateParts = dataset && dataset.techSpecs && dataset.techSpecs.latestDate ? latestDate.split('/') : ['', '', ''];
  const useFutureIcon = isAfter(new Date(latestDateParts[2] - 0, latestDateParts[0] - 1, latestDateParts[1] - 0, 0, 0, 0), new Date());

  return (
    <ul className={styles.list}>
      <li data-test-id="dateRange-li" aria-label={'Date Range: ' + dateRange}>
        <div className={styles.statItem}>
          <div>
            {dateRange && useFutureIcon ? (
              <img
                src={futureDateIcon}
                className={styles.futureDateIcon}
                data-test-id={'futureDateIcon'}
                alt={'future date icon'}
                aria-hidden={'true'}
              />
            ) : (
              <FontAwesomeIcon icon={faCalendarWeek} size="1x" className={styles.icon} data-test-id="calendar-week-icon" />
            )}
          </div>
          <div>
            <div className={styles.statHeaderText}> Date Range </div>
            <div className={styles.stateSubHeaderText}> {dateRange} </div>
          </div>
        </div>
      </li>
      <li data-test-id={'lastUpdated'} aria-label={'last updated' + lastUpdated}>
        <div className={styles.statItem}>
          <FontAwesomeIcon icon={faCalendarCheck} size="1x" className={styles.icon} data-test-id={'calendarCheckIcon'} />
          <div>
            <div className={styles.statHeaderText}> Last Updated </div>
            <div className={styles.stateSubHeaderText}> {lastUpdated} </div>
          </div>
        </div>
      </li>
      <li data-testid="updateFrequency-li" aria-label={frequency}>
        <div className={styles.statItem}>
          <FontAwesomeIcon icon={faSyncAlt} size="1x" className={styles.icon} data-testid="sync-alt-icon" />
          <div>
            <div className={styles.statHeaderText}> Release Frequency </div>
            <div className={styles.stateSubHeaderText}> {frequency} </div>
          </div>
        </div>
      </li>
      {dataset.apis && (
        <li data-testid="numTables-li" aria-label={frequency}>
          <div className={styles.statItem}>
            <FontAwesomeIcon icon={faDatabase} size="1x" className={styles.icon} data-testid="database-icon" />
            <div className={styles.dataTableText}>
              {dataset.apis.length} {dataset.apis.length > 1 ? 'Data Tables' : 'Data Table'}
            </div>
          </div>
        </li>
      )}
    </ul>
  );
}
