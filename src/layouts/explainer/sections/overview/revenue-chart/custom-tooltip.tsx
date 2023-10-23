import React, { FunctionComponent } from 'react';
import { toolTip, dot, tooltipLabel, tooltipRow, value, title } from '../deficit-chart/deficit-chart.module.scss';
import { longVersionMonth } from '../chart-helper';

interface ICustomTooltip {
  label?: string;
  payload?;
}

const CustomTooltip: FunctionComponent<ICustomTooltip> = ({ payload, label }) => {
  if (payload && payload.length && label) {
    return (
      <div className={toolTip} data-testid="CustomTooltip">
        <div className={tooltipLabel}>{longVersionMonth(label)}</div>
        <div>
          {payload.reverse().map((row, index) => {
            return (
              <div className={tooltipRow} key={index}>
                <div className={value}>
                  <span className={dot} style={{ backgroundColor: row.color }}></span>
                  <span className={title}>{row.name}</span>
                </div>
                <span className={value}>${row.value.toFixed(2)}T</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
