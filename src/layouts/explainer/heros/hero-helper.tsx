import { pillDataContainer, pillDataValue, pillDataPercent, explainerArrow } from '../hero-image/hero-image.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong, faUpLong } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { getShortForm } from '../../../utils/rounding-utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { divvyUpFilters } from '../../../components/dataset-data/dataset-data-api-helper/dataset-data-api-helper';

export const getFootNotesDateRange = (priorFY: string, currentFY: string, currentRecordMonth: string): string => {
  const date = new Date();
  date.setDate(15);
  date.setMonth(parseInt(currentRecordMonth) - 1);
  const currentMonth = date.toLocaleString('en-US', { month: 'short' });
  const priorFiscalStartYear = Number(priorFY) - 1;
  return currentRecordMonth === '10' ? `Oct ${priorFiscalStartYear}` : `Oct ${priorFiscalStartYear} - ${currentMonth} ${currentFY}`;
};

export const getPillData = (
  value: number,
  percent: number,
  changeLabel: string,
  desktop: boolean,
  color: string,
  leftPillTooltipText: string,
  rightPillTooltipText: string
): JSX.Element => {
  const displayValue = getShortForm(value.toString());
  const displayPercent = percent.toFixed();
  const valueLength = displayValue.length + 1;
  const percentLength = displayPercent.length + 1;
  const getPillWidth = displayValueLength => (displayValueLength > 4 ? (displayValueLength - 4) / 2 + 4 : 4);

  const iconChange = (labelChanger) => {
    if (labelChanger === 'increased') {
      return (
      <div className={explainerArrow}>
        <FontAwesomeIcon icon={faUpLong as IconProp} title="up arrow" />
      </div>
      )
    }
    else if(labelChanger === 'decreased') {
      return (
      <div className={explainerArrow}>
        <FontAwesomeIcon icon={faDownLong as IconProp} title="down arrow" />
      </div>
      )
    }
    else {
      return (
      <div className={explainerArrow}>
        <FontAwesomeIcon icon={faDownLong as IconProp} title="down arrow" />
      </div>
      )

    }
  }
  return (
    <div className={pillDataContainer}>
      <div className={pillDataValue} title={leftPillTooltipText} style={{ background: color, width: `${getPillWidth(valueLength)}rem` }}>
        ${displayValue}
      </div>
      {iconChange(changeLabel)}
      <div className={pillDataPercent} title={rightPillTooltipText} style={{ background: color, width: `${getPillWidth(percentLength)}rem` }}>
        {displayPercent}%
      </div>
    </div>
  );
};
