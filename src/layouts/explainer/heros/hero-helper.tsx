import { pillDataContainer, pillDataValue, pillDataPercent, explainerArrow, dashes, doubleDashs } from '../hero-image/hero-image.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong } from '@fortawesome/free-solid-svg-icons/faDownLong';
import { faUpLong } from '@fortawesome/free-solid-svg-icons/faUpLong';
import React from 'react';
import { getShortForm } from '../../../utils/rounding-utils';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { apiPrefix } from '../../../utils/api-utils';

// Revenue Hero Data URL Variables / Params
const revFields =
  'fields=current_fytd_net_rcpt_amt,prior_fytd_net_rcpt_amt,record_calendar_month,record_calendar_year,record_fiscal_year,record_date';
const revFilter = 'filter=line_code_nbr:eq:830';
const revSort = 'sort=-record_date';
const revPagination = 'page[size]=1';
const revEndpointUrl = `v1/accounting/mts/mts_table_4?${revFields}&${revFilter}&${revSort}&${revPagination}`;
export const revenueHeroUrl = `${apiPrefix}${revEndpointUrl}`;

// Deficit Hero Data URL Variables / Params
const defFields =
  'fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,record_calendar_month,record_calendar_year,record_fiscal_year';
const defSort = 'sort=-record_date';
const defFilter = 'filter=line_code_nbr:eq:5694';
const defPagination = 'page[size]=13';
const defEndpointUrl = `v1/accounting/mts/mts_table_5?${defFields}&${defFilter}&${defSort}&${defPagination}`;
export const deficitUrl: string = `${apiPrefix}${defEndpointUrl}`;

// Spending Hero Data URL Variables / Params
const spendFields =
  'fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,record_calendar_month,record_calendar_year,record_fiscal_year';
const spendFilter = 'filter=line_code_nbr:eq:5691';
const spendSort = 'sort=-record_date';
const spendPagination = 'page[size]=1';
const spendEndpointUrl = `v1/accounting/mts/mts_table_5?${spendFields}&${spendFilter}&${spendSort}&${spendPagination}`;
export const spendingUrl = `${apiPrefix}${spendEndpointUrl}`;

export const getFootNotesDateRange = (priorFY: string, currentFY: string, currentRecordMonth: string): string => {
  const date = new Date();
  date.setDate(15);
  date.setMonth(parseInt(currentRecordMonth) - 1);
  const currentMonth = date.toLocaleString('en-US', { month: 'short' });
  const priorFiscalStartYear = Number(priorFY) - 1;
  return currentRecordMonth === '10' ? `Oct ${priorFiscalStartYear}` : `Oct ${priorFiscalStartYear} - ${currentMonth} ${currentFY}`;
};

export const getChangeLabel = (current: number, prev: number, altVerbage: boolean): string => {
  if (current > prev) {
    return altVerbage ? 'more than' : 'increased';
  } else if (prev > current) {
    return altVerbage ? 'less than' : 'decreased';
  } else {
    return altVerbage ? 'the same as' : 'not changed';
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
