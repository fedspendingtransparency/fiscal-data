import React from 'react';
import { list, icon, futureDateIconStyle, dictionary_yes, dictionary_no } from './dataset-stats.module.scss';
import { isAfter } from 'date-fns';
import futureDateIcon from '../../images/futureDateIcon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCode } from '@fortawesome/free-solid-svg-icons/faFileCode';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons/faCalendarWeek';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons/faCalendarCheck';

export default function DatasetStats(props) {
  const earliestDate = props.dataset && props.dataset.techSpecs && props.dataset.techSpecs.earliestDate ? props.dataset.techSpecs.earliestDate : null;
  const latestDate = props.dataset && props.dataset.techSpecs && props.dataset.techSpecs.latestDate ? props.dataset.techSpecs.latestDate : null;
  const dateRange = earliestDate && latestDate ? `${earliestDate} - ${latestDate}` : undefined;
  const frequency =
    props.dataset && props.dataset.techSpecs && props.dataset.techSpecs.updateFrequency
      ? props.dataset.techSpecs.updateFrequency
      : 'no frequency available';
  const lastUpdated =
    props.dataset && props.dataset.techSpecs && props.dataset.techSpecs.lastUpdated ? props.dataset.techSpecs.lastUpdated : 'no date available';
  const dataDictionaryPresent = props.dataset.dictionary;
  const dataDictionaryText = dataDictionaryPresent ? 'data dictionary complete' : 'data dictionary incomplete';
  const latestDateParts = props.dataset && props.dataset.techSpecs && props.dataset.techSpecs.latestDate ? latestDate.split('/') : ['', '', ''];
  const useFutureIcon = isAfter(new Date(latestDateParts[2] - 0, latestDateParts[0] - 1, latestDateParts[1] - 0, 0, 0, 0), new Date());

  return (
    <ul className={list} data-testid="dataset-ul">
      <li data-testid="dateRange-li" aria-label={'Date Range: ' + dateRange}>
        {dateRange && useFutureIcon ? (
          <img src={futureDateIcon} className={futureDateIconStyle} data-testid={'futureDateIcon'} alt={'future date icon'} aria-hidden={'true'} />
        ) : (
          <FontAwesomeIcon icon={faCalendarWeek} size="1x" className={icon} data-testid="calendar-week-icon" />
        )}
        {dateRange}
      </li>
      <li data-testid="updateFrequency-li" aria-label={frequency}>
        <FontAwesomeIcon icon={faSyncAlt} size="1x" className={icon} data-testid="sync-alt-icon" />
        {frequency}
      </li>
      <li data-testid={'lastUpdated'} aria-label={'Last Updated: ' + lastUpdated}>
        <FontAwesomeIcon icon={faCalendarCheck} size="1x" className={icon} data-testid={'calendarCheckIcon'} />
        {'Last Updated ' + lastUpdated}
      </li>
      <li data-testid="fileType-li" aria-label={'CSV, JSON, XML'}>
        <FontAwesomeIcon icon={faFileCode} size="1x" className={icon} data-testid="page-icon" />
        CSV, JSON, XML
      </li>
      <li data-testid="dictionary-li" aria-label={dataDictionaryText}>
        <FontAwesomeIcon
          icon={dataDictionaryPresent ? faCheckCircle : faTimesCircle}
          size="1x"
          className={`${icon} ${dataDictionaryPresent ? dictionary_yes : dictionary_no}`}
          data-testid="dictionary-icon"
        />
        Data Dictionary
      </li>
    </ul>
  );
}
