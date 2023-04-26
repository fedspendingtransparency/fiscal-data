import React from "react";
import * as styles from './dataset-stats.module.scss';
import {isAfter} from 'date-fns';
import futureDateIcon from '../../../images/futureDateIcon.svg';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faFileCode,
  faCheckCircle,
  faTimesCircle,
  faCalendarWeek,
  faSyncAlt,
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons"

export default function DatasetStats({ dataset }) {
  // TODO: clean some of these up a little
  const earliestDate = (dataset && dataset.techSpecs && dataset.techSpecs.earliestDate) ? dataset.techSpecs.earliestDate : null;
  const latestDate = (dataset && dataset.techSpecs && dataset.techSpecs.latestDate) ? dataset.techSpecs.latestDate : null;
  const dateRange = earliestDate && latestDate ? `${earliestDate} - ${latestDate}` : undefined;
  const frequency = (dataset && dataset.techSpecs && dataset.techSpecs.updateFrequency) ?
    dataset.techSpecs.updateFrequency : 'no frequency available';
  const lastUpdated = (dataset && dataset.techSpecs && dataset.techSpecs.lastUpdated) ? dataset.techSpecs.lastUpdated : 'no date available';
  const dataDictionaryPresent = dataset.dictionary;
  const dataDictionaryText = dataDictionaryPresent ? 'data dictionary complete' : 'data dictionary incomplete';
  const latestDateParts = (dataset && dataset.techSpecs && dataset.techSpecs.latestDate) ? latestDate.split('/') : ['','',''];
  const useFutureIcon = isAfter(new Date(latestDateParts[2] - 0, latestDateParts[0] - 1, latestDateParts[1] - 0, 0,0,0), new Date());

  return (
    <ul className={styles.list}>
      <li data-test-id="dateRange-li" aria-label={'Date Range: ' + dateRange}>
        {(dateRange && useFutureIcon)
          ? <img src={futureDateIcon}
                 className={styles.futureDateIcon}
                 data-test-id={'futureDateIcon'}
                 alt={'future date icon'}
                 aria-hidden={'true'}
            />
          : <FontAwesomeIcon
            icon={faCalendarWeek} size="1x"
            className={styles.icon}
            data-test-id="calendar-week-icon"
            />
        }
        {dateRange}
      </li>
      <li data-testid="updateFrequency-li" aria-label={frequency}>
        <FontAwesomeIcon
          icon={faSyncAlt} size="1x"
          className={styles.icon}
          data-testid="sync-alt-icon"
        />
          {frequency}
      </li>
      <li data-test-id={'lastUpdated'} aria-label={'last updated' + lastUpdated}>
        <FontAwesomeIcon
          icon={faCalendarCheck} size="1x"
          className={styles.icon}
          data-test-id={'calendarCheckIcon'}
        />
          {'Last Updated ' + lastUpdated}
      </li>
      <li data-testid="fileType-li" aria-label={'CSV, JSON, XML'}>
        <FontAwesomeIcon
          icon={faFileCode} size="1x"
          className={styles.icon}
          data-testid="page-icon"
        />
          CSV, JSON, XML
      </li>
      <li data-testid="dictionary-li" aria-label={dataDictionaryText}>
        <FontAwesomeIcon
          icon={dataDictionaryPresent ? faCheckCircle : faTimesCircle} size="1x"
          className={`${styles.icon} ${dataDictionaryPresent ? styles.dictionary_yes : styles.dictionary_no}`}
          data-testid="dictionary-icon"
        />
          Data Dictionary
      </li>
    </ul>
  )
}
