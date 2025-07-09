import React, { FunctionComponent, ReactElement } from 'react';
import {
  amountLegend,
  amountText,
  countLegend,
  legendContainer,
  line,
  rectangle,
} from '../../state-and-local-government-series/state-and-local-government-series-chart/state-and-local-government-series-chart.module.scss';

type Tooltip = (object: {
  payload: [{ payload: { year: number; expense: number; rate: number }; dataKey: string }];
  setDate: (x: number) => void;
  setCount: (x: number) => void;
  setAmount: (x: number) => void;
}) => void;
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

export const Legend: FunctionComponent = (): ReactElement => {
  return (
    <div className={legendContainer}>
      <div className={amountLegend}>
        <span className={amountText}>Amount</span>
        <div className={rectangle} />
      </div>
      <div className={countLegend}>
        {/*TODO: Change line from solid to dotted*/}
        <div className={line} />
        <span>Count</span>
      </div>
    </div>
  );
};
