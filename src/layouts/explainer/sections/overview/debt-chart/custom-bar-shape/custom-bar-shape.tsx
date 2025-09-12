import React from 'react';
import { getOpacity } from '../debt-chart-helper';

const getBarSizes = (width, totalBars) => {
  if (!!width && !!totalBars) {
    const sections = totalBars % 10;

    const splitWidth = (width / totalBars).toFixed(1);
    const totalWidth = splitWidth * 10; // space for each section of 10 bars, shared between 10 bars and 11 gaps
    const barWidth = (1 / 13.3) * totalWidth;
    const gapWidth = 0.3 * barWidth;
    return { barWidth: barWidth, gapWidth: gapWidth };
  }
  return { barWidth: 0, gapWidth: 0 };
};

const CustomBarShape = props => {
  const { height, width, y, x, fill, payload, dataKey, year, focusedYear, background } = props;

  const debtBar = dataKey.includes('debt');
  const deficitBar = dataKey.includes('deficit');

  const debtVal = props[`debt${year}`];
  const debtRemainder = debtVal % 1;
  const deficitInitialIndex = (debtVal + (1 - debtRemainder)) % 10;

  const { barWidth, gapWidth } = getBarSizes(width, payload[dataKey]);

  if (width > 0 && barWidth > 0) {
    const allBars = [];
    let xVal = x;
    //initial deficit values
    const firstBarValue = 1 - debtRemainder;
    const firstBarWidth = barWidth * firstBarValue;
    const axisGap = deficitInitialIndex % 10 === 0 ? gapWidth : 0;
    let remainingBars = payload[dataKey];

    if (deficitBar) {
      // first deficit bar will be split from the final debt bar
      const debtCalcedWidth = (barWidth + gapWidth) * debtVal + gapWidth * 2;
      xVal = background.x + debtCalcedWidth;
      allBars.push({ x: xVal, width: firstBarWidth });
      xVal = xVal + firstBarWidth + axisGap + gapWidth;
      remainingBars = remainingBars - (1 - debtRemainder);
      console.log(background.x + debtCalcedWidth, x);
    } else {
      //first debt bar will start with a gap
      xVal = xVal + gapWidth;
    }
    let barCount = debtBar ? 0 : deficitInitialIndex;
    // add all full bars on allBars array
    while (remainingBars >= 1) {
      barCount = barCount + 1;
      allBars.push({ x: xVal, width: barWidth });
      xVal = xVal + barWidth + gapWidth;
      if (barCount !== 0 && barCount % 10 === 0) {
        //Add twice the gap around the x-axis bars
        xVal = xVal + gapWidth;
      }
      remainingBars = remainingBars - 1;
    }
    //final partial bar
    allBars.push({ x: xVal, width: barWidth * remainingBars });

    return (
      <>
        {allBars.map(val => (
          <rect
            {...props}
            y={y}
            height={height}
            width={val.width}
            x={val.x}
            strokeWidth={0}
            fill={fill}
            fillOpacity={1}
            opacity={getOpacity(focusedYear, year)}
          />
        ))}
      </>
    );
  }
};

export default CustomBarShape;
