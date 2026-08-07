import React from 'react';
import { header, subHeader, headerContainer } from './debt-over-last-100y-linechart.module.scss';
import numeral from 'numeral';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import { fontSize_14}

const { bls, historicalDebt } = explainerCitationsMap['national-debt'];

const footer = (
  <p>
    Visit the {historicalDebt} dataset to explore and download this data. The inflation data is sourced from the {bls}.
  </p>
);

export const getChartCopy = (minYear, maxYear, selectedChartView) => {
  return {
    title: `U.S. National Debt Over the Last 100 Years`,
    subtitle: `Inflation Adjusted - ${maxYear ?? '--'} Dollars`,
    footer: footer,
    altText:
      'Line graph displaying the amount of debt in trillions from 1922 to 2022. The graph shows a steady trend with an ' +
      'increase beginning around 1940 continuing through today.',
  };
};

export const dataHeader = headingValues => {
  const { fiscalYear, totalDebt } = headingValues;
  return (
    <div className={headerContainer}>
      <div>
        <div className={header} data-testid="dynamic-year-header">
          {fiscalYear}
        </div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
      <div>
        <div className={header} data-testid="dynamic-value-header">
          {totalDebt}
        </div>
        <span className={subHeader}>Total Debt</span>
      </div>
    </div>
  );
};

export const formatDollaraTick = value => {
  const newValue = numeral(value).format('0 a').toUpperCase();
  return `$${newValue}`.replace(' ', '\u00A0');
}

const e10 = Math.sqrt(50);
const e5 = Math.sqrt(10);
const e2 = Math.sqrt(2);

const tickSpacing = (start, stop, count) => {
  const step = Math.abs(stop-start) / Math.max(1, count);
  const power = Math.floor(Math.log10(step));
  const error = step / Math.pow(10, power);
  const factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  return factor * Math.pow(10, power);
};

export const getTicks = (start, stop, count) => {
  const step = tickSpacing(start, stop, count);
  const ticks = []
  for (let i = Math.ceil(start /step); i <= Math.floor(stop/ step); i++) {
    ticks.push(i * step);
  }
  return ticks;
};

export const getNiceDomain = (min, max, count =10) => {
  let start = min;
  let stop = max;
  let previousStep;
  for (let i = 0; i < 10; i++) {
    const step = tickSpacing(start, stop, count);
    if (step === previousStep) break;
    start = Math.floor(start / step) * step;
    stop = Math.ceil(stop/ step) * step;
    previousStep = step;

  }
  return [start, stop];
};

const axisThickness = 1;

export const getChartMargin = isMoible => {
  const margin = isMobile ? { top: 25, right: 25, bottom: 35, left: 65} : { top: 20, right: 15, bottom: 35, left: 50 };
  return {...margin, bottom: margin.bottom - axisThickness, left: margin.left - axisThickness};
}

export const chartConfigs = {
  axisThickness,
  tickSize: 10,
  tickMargin: 5,
  axisLine: {stroke: '#666666', strokeWidth: 1},
  tickLine: {stroke: '#777777', strokeWidth: 1},
  tick: { fill: '#333333', fontFamily: 'sans-serif', fontSize: fontSize_14 },
  crossHair: {
    stoke: '#555555',
    strokeWidth: 2,
    strokeOpacity: .75,
    strokeDasharray: '6 6',
    pointerEvents: 'none',
  },
  zIndex: {axis: 50, point: 600, slice: 700}
};
