import React from 'react';
import { tooltip, tooltipLabel, dot, title, value, tooltipRow } from '../spending-chart.module.scss';

const longVersionMonth = (month) => {
  const monthNames = {
    Jan: 'Janurary',
    Feb: 'Feburary',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'Decmber'
  }
  return monthNames[month] || month;
}
const fiveYear = (name) => {
  const shortName = {
    '5 Year Average (2016-2021)': '5 Yr Avg',
  }
  return shortName[name] || name;
}

const CustomTooltip = ({ payload, label }) => {
  if (payload && payload.length) {
    return (
      <div className={tooltip} data-testid="CustomTooltip">
        <div className={tooltipLabel}>{`${longVersionMonth(label)}`}</div>
        {payload.map((entry, index) => (
          <div className={tooltipRow} key={`item-${index}`} style={{color: entry.stroke }}>
            <div className={value}>
              <span className={dot} style={{ backgroundColor: entry.stroke }} />
              <span className={title}>{`${fiveYear(entry.name)}: `}</span>
            </div>
            <span className={value}>{`$${Math.round(entry.value *100) / 100}T`}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
 };

 export default CustomTooltip;