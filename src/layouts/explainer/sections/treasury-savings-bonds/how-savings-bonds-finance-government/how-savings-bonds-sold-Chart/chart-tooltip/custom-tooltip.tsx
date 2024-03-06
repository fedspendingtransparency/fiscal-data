import React, {FunctionComponent} from 'react';
import { TooltipProps } from 'recharts';
import { tooltipContainer, tooltipTitle, tooltipSecondaryTitle, tooltipPercent, tooltipColorBox } from './custom-tooltip.module.scss'

interface DataItem {
  name: string;
  percent: number;
  color?: string;
  securityType: string;
}

const CustomTooltip: FunctionComponent<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DataItem;
    const color = payload[0].color || '#4A0072';

    return (
      <div className={tooltipContainer} >
        <span>
        <div className={tooltipColorBox}style={{ backgroundColor: color, width: '18px', height:'18px', marginRight: '8px' }}></div>
        </span>
        <span>
        <div className={tooltipTitle} >{data.name}</div>
        <div className={tooltipSecondaryTitle} >{`${data.securityType}`}</div>
        <div className={tooltipPercent}>{`${data.percent}% of National Debt`}</div> 
        </span>

      </div>
    );
  }
  return null;
};

export default CustomTooltip;
