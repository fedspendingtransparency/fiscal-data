import { pillDataContainer, pillDataValue, pillDataPercent, explainerArrow, dashes, doubleDashs } from '../hero-image/hero-image.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong, faUpLong } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { getShortForm } from '../../../utils/rounding-utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const getFootNotesDateRange = (priorFY: string, currentFY: string, currentRecordMonth: string): string => {
  const date = new Date();
  date.setDate(15);
  date.setMonth(parseInt(currentRecordMonth) - 1);
  const currentMonth = date.toLocaleString('en-US', { month: 'short' });
  const priorFiscalStartYear = Number(priorFY) - 1;
  return currentRecordMonth === '10' ? `Oct ${priorFiscalStartYear}` : `Oct ${priorFiscalStartYear} - ${currentMonth} ${currentFY}`;
};

export const getChangeLabel = (current: number, prev: number) => {
  if (current > prev) {
    return 'increased';
  } else if (prev > current) {
    return 'decreased';
  } else {
    return 'not changed';
  }
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

  const doubleDash = '/images/double-dash.svg';
  const iconChange = labelChanger => {
    if (labelChanger === 'increased') {
      return <FontAwesomeIcon icon={faUpLong as IconProp} title="up arrow" />;
    } else if (labelChanger === 'decreased') {
      return <FontAwesomeIcon icon={faDownLong as IconProp} title="down arrow" />;
    } else {
      return (
        <div className={doubleDashs}>
          <img src={doubleDash} alt="double dash" className={dashes} />
        </div>
      );
    }
  };
  return (
    <div className={pillDataContainer}>
      <div className={pillDataValue} title={leftPillTooltipText} style={{ background: color, width: `${getPillWidth(valueLength)}rem` }}>
        ${displayValue}
      </div>
      <div className={explainerArrow}>{iconChange(changeLabel)}</div>
      <div className={pillDataPercent} title={rightPillTooltipText} style={{ background: color, width: `${getPillWidth(percentLength)}rem` }}>
        {displayPercent}%
      </div>
    </div>
  );
};
