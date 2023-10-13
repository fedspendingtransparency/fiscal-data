import React from 'react';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { toolTip, dot, tooltipLabel, tooltipRow, value, title } from './deficit-chart.module.scss';

const CustomTooltip = ({ active, payload, label, setFocused }) => {
  if (payload && payload.length) {
    // console.log(active);
    payload[0].payload.active = label;
    // console.log(payload);
    // if ()
    // payload[1].payload.active = label;
    // setFocused(payload[0].payload.year);
    return (
      <div className={toolTip}>
        <div className={tooltipLabel}>{label}</div>
        <div>
          {payload[0].payload.tooltip?.map((row, index) => {
            return (
              <div className={tooltipRow} key={index}>
                <div className={value}>
                  <span className={dot} style={{ backgroundColor: row.color }}></span>
                  <span className={title}>{row.title}</span>
                </div>
                <span className={value}>{getShortForm(row.value)}</span>
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
