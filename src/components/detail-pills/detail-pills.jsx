import React from 'react';
import { futureDateIconStyle, icon, materialIcon, pill, pillWrapper } from './detail-pills.module.scss';
import { faCalendarWeek, faDatabase, faPen, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import { format, isAfter } from 'date-fns';
import futureDateIcon from '../../images/futureDateIcon.svg';
import { convertDateAndTimeToDateTime } from '../calendar-entries/calendar-entry-sort-helper/calendar-entry-sort-helper';

const DetailPills = ({ techSpecs, dictionary, numTables, dateExpected, timeExpected }) => {
  const earliestDate = techSpecs?.earliestDate;
  const latestDate = techSpecs?.latestDate;
  const dateRange = earliestDate && latestDate ? `${earliestDate} — ${latestDate}` : undefined;
  const frequency = techSpecs?.updateFrequency || 'no frequency available';
  const lastUpdated = techSpecs?.lastUpdated || null;
  const latestDateParts = latestDate ? latestDate.split('/') : ['', '', ''];
  const useFutureIcon = isAfter(new Date(latestDateParts[2] - 0, latestDateParts[0] - 1, latestDateParts[1] - 0, 0, 0, 0), new Date());
  const formattedTime = timeExpected && timeExpected[2] === ':' ? timeExpected.replace(':', '') : timeExpected;
  const formattedDateExpected =
    dateExpected && timeExpected ? format(new Date(convertDateAndTimeToDateTime(dateExpected, formattedTime)), 'MM/d/yyyy') : null;

  return (
    <div data-testid="detailPills" className={pillWrapper}>
      {dateRange && (
        <span className={pill}>
          {useFutureIcon ? (
            <img src={futureDateIcon} className={futureDateIconStyle} data-testid="futureDateIcon" alt="future date icon" aria-hidden="true" />
          ) : (
            <FontAwesomeIcon icon={faCalendarWeek} size="1x" className={icon} data-testid="calendar-week-icon" alt="Date Range:" />
          )}
          <span data-test-id="dateRangePill" className="pillText">
            {dateRange}
          </span>
        </span>
      )}
      <span className={pill}>
        <FontAwesomeIcon icon={faRepeat} size="1x" className={icon} data-testid="repeat-icon" />
        <span className="pillText">Released {frequency}</span>
      </span>
      {lastUpdated && (
        <span className={pill}>
          <FontAwesomeIcon icon={faPen} size="1x" className={icon} data-testid="lastUpdatedIcon" />
          <span className="pillText">Last Updated {lastUpdated}</span>
        </span>
      )}
      {formattedDateExpected && (
        <span className={pill}>
          <AccessAlarm sx={{ width: '18px' }} size="1x" className={materialIcon} data-testid="timerIcon" />
          <span className={'pillText'}>New Data Expected {formattedDateExpected}</span>
        </span>
      )}
      <span className={pill}>
        <FontAwesomeIcon icon={faDatabase} size="1x" className={icon} data-testid={'numTables'} />
        <span className={'pillText'}>
          {numTables} {numTables > 1 ? 'Data Tables' : 'Data Table'}
        </span>
      </span>
    </div>
  );
};

export default DetailPills;
