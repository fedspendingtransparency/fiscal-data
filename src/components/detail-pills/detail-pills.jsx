import React, { useEffect, useState } from 'react';
import { futureDateIconStyle, icon, materialIcon, pill, pillWrapper } from './detail-pills.module.scss';
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons/faCalendarWeek';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faRepeat } from '@fortawesome/free-solid-svg-icons/faRepeat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import { format, isAfter } from 'date-fns';
import futureDateIcon from '../../images/futureDateIcon.svg';
import { convertDateAndTimeToDateTime } from '../calendar-entries/calendar-entry-sort-helper/calendar-entry-sort-helper';
import { basicFetch } from '../../utils/api-utils';
import { API_BASE_URL } from 'gatsby-env-variables';

const DetailPills = ({ techSpecs, numTables, dateExpected, timeExpected, datasetId, hideRawDataTable }) => {
  const earliestDate = techSpecs?.earliestDate;
  const latestDate = techSpecs?.latestDate;
  const dateRange = earliestDate && latestDate ? `${earliestDate} — ${latestDate}` : undefined;
  const frequency = techSpecs?.updateFrequency || 'no frequency available';
  const lastUpdated = techSpecs?.lastUpdated || null;
  const latestDateParts = latestDate ? latestDate.split('/') : ['', '', ''];
  const useFutureIcon = isAfter(new Date(latestDateParts[2] - 0, latestDateParts[0] - 1, latestDateParts[1] - 0, 0, 0, 0), new Date());
  const formattedTime = timeExpected && timeExpected[2] === ':' ? timeExpected.replace(':', '') : timeExpected;
  const formattedDateExpected =
    dateExpected && timeExpected ? format(new Date(convertDateAndTimeToDateTime(dateExpected, formattedTime)), 'MM/dd/yyyy') : null;
  const [dateTimeExpected, setDateTimeExpected] = useState(formattedDateExpected);
  const releaseCalendarUrl = `${API_BASE_URL}/services/calendar/release`;
  const generateSortKey = entry => `${entry.date}_${entry.time}`;

  useEffect(() => {
    (async () => {
      const res = await basicFetch(releaseCalendarUrl);
      if (res && res.length > 0) {
        const sortedRes = res.filter(rcDataset => rcDataset.datasetId === datasetId && rcDataset.released === 'false');
        const rcEntries = await sortedRes;
        rcEntries.sort((a, b) => {
          const aKey = generateSortKey(a);
          const bKey = generateSortKey(b);
          if (aKey > bKey) return 1;
          else if (aKey < bKey) return -1;
          else return 0;
        });
        if (rcEntries?.length > 0) {
          const date = rcEntries[0]?.date;
          const time = rcEntries[0].time;
          const formattedTime = time && time[2] === ':' ? time.replace(':', '') : time;
          const formattedDateExpected = date && time ? format(new Date(convertDateAndTimeToDateTime(date, formattedTime)), 'MM/dd/yyyy') : null;
          setDateTimeExpected(formattedDateExpected);
        }
      }
    })();
  }, []);

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
      {dateTimeExpected && (
        <span className={pill}>
          <AccessAlarm size="1x" className={materialIcon} data-testid="timerIcon" />
          <span className="pillText">New Data Expected {dateTimeExpected}</span>
        </span>
      )}
      {!hideRawDataTable && numTables && (
        <span className={pill}>
          <FontAwesomeIcon icon={faDatabase} size="1x" className={icon} data-testid="numTables" />
          <span className="pillText">
            {numTables} {numTables > 1 ? 'Data Tables' : 'Data Table'}
          </span>
        </span>
      )}
    </div>
  );
};

export default DetailPills;
