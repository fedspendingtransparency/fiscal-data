import React from 'react';
import { dot, legend, legendItem, dotMobile } from './chart-legend.module.scss';
import classnames from 'classnames';

const ChartLegend = ({ legendItems, mobileDotSpacing }) => {
  return (
    <div className={legend}>
      {legendItems?.map((row, index) => {
        return (
          <div className={legendItem} key={index}>
            <span className={classnames([dot, mobileDotSpacing ? dotMobile : undefined])} style={{ backgroundColor: row.color }}></span>
            {row.title}
          </div>
        );
      })}
    </div>
  );
};

export default ChartLegend;
