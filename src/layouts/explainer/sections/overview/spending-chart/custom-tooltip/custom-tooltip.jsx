import React from 'react';
import { tooltip, tooltipLabel, dot } from '../spending-chart.module.scss';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={tooltip}>
        <div className={tooltipLabel}>{label}</div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{color: entry.stroke }}>
            <span className={dot} style={{ backgroundColor: entry.stroke }} />
              {`${entry.name}: $${Math.round(entry.value *100) / 100}T`}
          </div>
        ))}
      </div>
    );
  }
  return null;
 };

 export default CustomTooltip;
