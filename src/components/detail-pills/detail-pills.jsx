import React from 'react';
import { pill, pillWrapper, futureDateIconStyle, icon } from './detail-pills.module.scss';
import { faCalendarWeek, faRepeat, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isAfter } from 'date-fns';
import futureDateIcon from '../../images/futureDateIcon.svg';

const DetailPills = ({ techSpecs, dictionary }) => {
  const earliestDate = techSpecs?.earliestDate;
  const latestDate = techSpecs?.latestDate;
  const dateRange = earliestDate && latestDate ? `${earliestDate} — ${latestDate}` : undefined;
  const frequency = techSpecs?.updateFrequency || 'no frequency available';
  const lastUpdated = techSpecs?.lastUpdated || null;
  const latestDateParts = latestDate ? latestDate.split('/') : ['', '', ''];
  const useFutureIcon = isAfter(new Date(latestDateParts[2] - 0, latestDateParts[0] - 1, latestDateParts[1] - 0, 0, 0, 0), new Date());

  return (
    <div data-testid="detailPills" className={pillWrapper}>
      {dateRange && (
        <span className={pill}>
          {useFutureIcon ? (
            <img src={futureDateIcon} className={futureDateIconStyle} data-test-id="futureDateIcon" alt="future date icon" aria-hidden="true" />
          ) : (
            <FontAwesomeIcon icon={faCalendarWeek} size="1x" className={icon} data-test-id="calendar-week-icon" alt="Date Range:" />
          )}
          <span data-test-id="dateRangePill" className="pillText">
            {dateRange}
          </span>
        </span>
      )}
      <span className={pill}>
        <FontAwesomeIcon icon={faRepeat} size="1x" className={icon} data-test-id="repeat-icon" />
        <span className="pillText">Released {frequency}</span>
      </span>
      {lastUpdated && (
        <span className={pill}>
          <FontAwesomeIcon icon={faPen} size="1x" className={icon} data-test-id="lastUpdatedIcon" />
          <span className="pillText">Last Updated {lastUpdated}</span>
        </span>
      )}
    </div>
  );
};

export default DetailPills;
