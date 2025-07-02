import React, { FunctionComponent, ReactElement } from 'react';
import {
  amountLegend,
  amountText,
  legendContainer,
  line,
  countLegend,
  rectangle,
} from '../../state-and-local-government-series/state-and-local-government-series-chart/state-and-local-government-series-chart.module.scss';

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
