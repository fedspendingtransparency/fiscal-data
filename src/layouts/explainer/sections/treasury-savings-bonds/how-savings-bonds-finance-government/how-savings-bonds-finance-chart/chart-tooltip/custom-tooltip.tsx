import React, { FunctionComponent } from 'react';
import { TooltipProps } from 'recharts/types/component/Tooltip';
import { tooltipColorBox, tooltipContainer, tooltipPercent, tooltipSecondaryTitle, tooltipTitle } from './custom-tooltip.module.scss';

interface DataItem {
  name: string;
  percent: number;
  color?: string;
  securityType: string;
}

const CustomTooltip: FunctionComponent<TooltipProps<number, string>> = ({ active, payload, mouseInactive }) => {
  if (active && !mouseInactive && payload && payload.length) {
    const data = payload[0].payload as DataItem;
    const color = data.securityType === 'Marketable' ? '#4A0072' : '#B04ABD';

    return (
      <div className={tooltipContainer}>
        <span>
          <div className={tooltipColorBox} style={{ backgroundColor: color }} data-testid="tooltip-box-color"></div>
        </span>
        <span>
          <div className={tooltipTitle}>{`${data.name === 'Nonmarketable' ? 'Non-Marketable' : data.name}`}</div>
          <div className={tooltipSecondaryTitle}>{`${data.securityType === 'Nonmarketable' ? 'Non-Marketable' : data.securityType}`}</div>
          <div className={tooltipPercent}>{`${data.percent}% of National Debt`}</div>
        </span>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
