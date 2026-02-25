import React, { FunctionComponent, ReactElement } from 'react';
import {
  legendContainer,
  legendSection,
  legendText,
  line,
  rectangle,
} from '../../state-and-local-government-series/state-and-local-government-series-chart/state-and-local-government-series-chart.module.scss';
import { convertDate } from '../../../../../components/dataset-data/dataset-data-helper/dataset-data-helper';
import { getMonth, getYear } from 'date-fns';
import { monthNames } from '../../../../../utils/api-utils';

type Tooltip = (object: {
  payload: [{ payload: { year: number; expense: number; rate: number }; dataKey: string }];
  setDate: (x: number) => void;
  setCount: (x: number) => void;
  setAmount: (x: number) => void;
}) => void;

export const chartConfig = {
  chartHeight: 395,
  height: 610,
  altText:
    'A bar chart that shows the amount of outstanding securities over the last 12 months with an overlayed ' +
    'line chart showing the count of outstanding securities. Generally, as the amount of outstanding securities ' +
    'increases or decreases, the count also increases or decreases. ',
};

export const CustomTooltip: Tooltip = ({ payload = [], setDate, setCount, setAmount }): null => {
  if (payload.length > 0 && setDate && setCount && setAmount) {
    setDate(payload[0]?.payload.date);
    const count = payload.find(x => x.dataKey === 'totalCount');
    setCount(count.payload.totalCount);
    const amount = payload.find(x => x.dataKey === 'totalAmount');
    setAmount(amount.payload.totalAmount);
  }
  return null;
};

export const infoTipWording =
  'For a date range under two years, the data is presented in a bar chart. For a date range greater than two years, ' +
  'the visualization will display a line chart. ';
export const infoTipTitle = 'More information about the State and Local Government Series Chart';

export const formatDate = dateStr => {
  if (dateStr) {
    const date = convertDate(dateStr);
    if (date) {
      const monthIndex = getMonth(date);
      const monthStr = monthNames[monthIndex];
      return `${monthStr} ${getYear(date)}`;
    }
  }
};
export const formatXAxis = (val, totalMonths) => {
  return totalMonths > 24
    ? convertDate(val)
        .getFullYear()
        .toString()
    : formatDate(val);
};

export const Legend: FunctionComponent = (): ReactElement => {
  return (
    <div className={legendContainer}>
      <div className={legendSection}>
        <span className={legendText}>Amount</span>
        <div className={rectangle} />
      </div>
      <div className={legendSection}>
        <div className={line}>.....</div>

        <span className={legendText}>Count</span>
      </div>
    </div>
  );
};
