import React, { FunctionComponent } from 'react';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { toolTip, tooltipLabel, tooltipRow, value, title } from '../../deficit-chart/deficit-chart.module.scss';
import { dot } from '../chart-legend.module.scss';

interface ICustomTooltip {
  label?: string;
  payload?;
  setFocused: (value: number) => void;
  labelByYear?: boolean;
  curFY?: string;
}

const CustomTooltip: FunctionComponent<ICustomTooltip> = ({ payload, label, setFocused, labelByYear, curFY }) => {
  if (payload && payload.length) {
    const year = payload[0].payload.year;
    const yearLabel = payload[0].payload.year === curFY ? `FYTD ${year}` : year;
    const categoryLabel = label === curFY ? `FYTD ${label}` : label;

    setFocused(year);
    return (
      <div className={toolTip} data-testid="CustomTooltip">
        <div className={tooltipLabel}>{labelByYear ? yearLabel : categoryLabel}</div>
        <div>
          {payload[0].payload.tooltip?.map((row, index) => {
            return (
              <div className={tooltipRow} key={index}>
                <div className={value}>
                  {row.color && <span className={dot} style={{ backgroundColor: row.color }}></span>}
                  <span className={title}>{row.title}</span>
                </div>
                <span className={value}>${getShortForm(row.value)}</span>
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
