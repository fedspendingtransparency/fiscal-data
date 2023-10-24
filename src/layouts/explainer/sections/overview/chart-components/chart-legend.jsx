import React from 'react';
import { dot, legend, legendItem } from '../deficit-chart/deficit-chart.module.scss';

const ChartLegend = ({ legendItems }) => {
  return (
    <div className={legend}>
      {legendItems?.map((row, index) => {
        return (
          <div className={legendItem} key={index}>
            <span className={dot} style={{ backgroundColor: row.color }}></span>
            {row.title}
          </div>
        );
      })}
    </div>
  );
};

export default ChartLegend;
