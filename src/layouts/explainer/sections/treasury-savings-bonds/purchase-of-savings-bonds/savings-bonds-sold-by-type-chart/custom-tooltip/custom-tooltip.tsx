import React, { FunctionComponent } from 'react';
import { toolTip, tooltipLabel, box, labelContainer, valueContainer } from './custom-tooltip.module.scss';
import { lines, lineMap } from '../savings-bonds-sold-by-type-chart-helper';
interface ICustomTooltip {
  label?: string;
  payload?;
}

const CustomTooltip: FunctionComponent<ICustomTooltip> = ({ payload, label }) => {
  const content = payload[0]?.payload;
  if (payload && payload.length) {
    return (
      <div className={toolTip} data-testid="CustomTooltip">
        <div className={tooltipLabel}>{label}</div>
        {lines.map(line => {
          const value = content[line];
          const label = lineMap[line].label;
          if (value > 0) {
            return (
              <div className={valueContainer}>
                <div className={labelContainer}>
                  <span className={box} style={{ backgroundColor: lineMap[line].color }} />
                  <span className={tooltipLabel}>{label}</span>
                </div>
                <span>${value}B</span>
              </div>
            );
          }
        })}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
