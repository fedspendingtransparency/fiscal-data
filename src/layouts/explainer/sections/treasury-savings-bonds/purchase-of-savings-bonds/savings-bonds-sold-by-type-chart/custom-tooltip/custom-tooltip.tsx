import React, { FunctionComponent } from 'react';
import { toolTip, tooltipLabel, box, labelContainer, valueContainer } from './custom-tooltip.module.scss';
import { savingsBonds, savingsBondsMap } from '../savings-bonds-sold-by-type-chart-helper';
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
        {savingsBonds.map((id, index) => {
          const value = content[id];
          const label = savingsBondsMap[id].label;
          if (value > 0) {
            return (
              <div className={valueContainer} key={index}>
                <div className={labelContainer}>
                  <span className={box} style={{ backgroundColor: savingsBondsMap[id].color }} />
                  <span className={tooltipLabel}>{label}</span>
                </div>
                <span>${value}B</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
