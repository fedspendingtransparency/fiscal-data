import React from 'react';
import { dataTableText, futureDateIconStyle, icon, list, stateSubHeaderText, statHeaderText, statItem } from './dataset-stats.module.scss';
import { isAfter } from 'date-fns';
import futureDateIcon from '../../../images/futureDateIcon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons/faCalendarWeek';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faRepeat } from '@fortawesome/free-solid-svg-icons/faRepeat';

const DatasetStats = ({ dataset }) => {
  // TODO: clean some of these up a little
  const earliestDate = dataset && dataset.techSpecs && dataset.techSpecs.earliestDate ? dataset.techSpecs.earliestDate : null;
  const latestDate = dataset && dataset.techSpecs && dataset.techSpecs.latestDate ? dataset.techSpecs.latestDate : null;
  const dateRange = earliestDate && latestDate ? `${earliestDate} - ${latestDate}` : undefined;
  const frequency = dataset && dataset.techSpecs && dataset.techSpecs.updateFrequency ? dataset.techSpecs.updateFrequency : 'no frequency available';
  const hideRawDataTable = dataset.hideRawDataTable;
  const noDateDisplayed = hideRawDataTable ? null : 'no date available';
  const lastUpdated = dataset && dataset.techSpecs && dataset.techSpecs.lastUpdated ? dataset.techSpecs.lastUpdated : noDateDisplayed;
  const latestDateParts = dataset && dataset.techSpecs && dataset.techSpecs.latestDate ? latestDate.split('/') : ['', '', ''];
  const useFutureIcon = isAfter(new Date(latestDateParts[2] - 0, latestDateParts[0] - 1, latestDateParts[1] - 0, 0, 0, 0), new Date());

  return (
    <ul className={list}>
      {dateRange && (
        <li data-testid="dateRange-li" aria-label={'Date Range: ' + dateRange}>
          <div className={statItem}>
            <div>
              {dateRange && useFutureIcon ? (
                <img
                  src={futureDateIcon}
                  className={futureDateIconStyle}
                  data-testid={'futureDateIcon'}
                  alt={'future date icon'}
                  aria-hidden={'true'}
                />
              ) : (
                <FontAwesomeIcon icon={faCalendarWeek} size="1x" className={icon} data-testid="calendar-week-icon" />
              )}
            </div>
            <div>
              <div className={statHeaderText}> Date Range</div>
              <div className={stateSubHeaderText}> {dateRange} </div>
            </div>
          </div>
        </li>
      )}
      {lastUpdated && (
        <li data-testid="lastUpdated" aria-label={'last updated' + lastUpdated}>
          <div className={statItem}>
            <FontAwesomeIcon icon={faPen} size="1x" className={icon} data-testid={'pen-icon'} />
            <div>
              <div className={statHeaderText}> Last Updated</div>
              <div className={stateSubHeaderText}> {lastUpdated} </div>
            </div>
          </div>
        </li>
      )}

      <li data-testid="updateFrequency-li" aria-label={frequency}>
        <div className={statItem}>
          <FontAwesomeIcon icon={faRepeat} size="1x" className={icon} data-testid="repeat-icon" />
          <div>
            <div className={statHeaderText}> Release Frequency</div>
            <div className={stateSubHeaderText}> {frequency} </div>
          </div>
        </div>
      </li>
      {dataset.apis && !hideRawDataTable && (
        <li data-testid="numTables-li" aria-label={'number of data tables: ' + dataset.apis.length}>
          <div className={statItem}>
            <FontAwesomeIcon icon={faDatabase} size="1x" className={icon} data-testid="database-icon" />
            <div className={dataTableText}>
              {dataset.apis.length} {dataset.apis.length > 1 ? 'Data Tables' : 'Data Table'}
            </div>
          </div>
        </li>
      )}
    </ul>
  );
};

export default DatasetStats;
