import React, { FunctionComponent } from 'react';
import { getOpacity } from '../debt-chart-helper';
import { debtExplainerPrimary } from '../../../../../../variables.module.scss';
import { deficitExplainerPrimary } from '../../../national-deficit/national-deficit.module.scss';

interface ICustomBarShape {
  height: number;
  width: number;
  y: number;
  x: number;
  payload;
  dataKey: string;
  focusedYear: string | number | null;
}

const getBarSizes = (width, totalBars) => {
  if (width && totalBars) {
    const splitWidth = (width / totalBars).toFixed(1);
    const totalWidth = splitWidth * 10; // space for each section of 10 bars, shared between 10 bars and 11 gaps
    const barWidth = totalWidth / 13.3;
    const gapWidth = 0.3 * barWidth;
    return { barWidth: Number(barWidth.toFixed(2)), gapWidth: Number(gapWidth.toFixed(2)) };
  }
  return { barWidth: 0, gapWidth: 0 };
};

const CustomBarShape: FunctionComponent<ICustomBarShape> = ({ height, width, y, x, payload, dataKey, focusedYear }) => {
  const { year } = payload;
  const { barWidth, gapWidth } = getBarSizes(width, payload[dataKey]);
  /*
  Debt Bars
  */
  const debtVal = payload[`debt${year}`];

  if (width > 0) {
    const allBars = [];
    let xVal = x + gapWidth;
    let debtBars = debtVal;
    let barCount = 0;

    // add all full bars on allBars array
    while (debtBars >= 1) {
      barCount = barCount + 1;
      allBars.push({ x: xVal, width: barWidth, color: debtExplainerPrimary });
      xVal = xVal + barWidth + gapWidth;
      if (barCount !== 0 && barCount % 10 === 0) {
        //Add twice the gap around the x-axis bars
        xVal = xVal + gapWidth;
      }
      debtBars = debtBars - 1;
    }
    //final partial debt bar
    const finalDebtBarWidth = barWidth * debtBars;
    allBars.push({ x: xVal, width: finalDebtBarWidth, color: debtExplainerPrimary });
    xVal = xVal + finalDebtBarWidth;

    /*
     Deficit Bars
    */
    let deficitBars = payload[`deficit${year}`];
    const firstBarWidth = barWidth * (1 - debtBars);
    allBars.push({ x: xVal, width: firstBarWidth, color: deficitExplainerPrimary });
    barCount = barCount + 1;
    deficitBars = deficitBars - (1 - debtBars);
    xVal = xVal + firstBarWidth + gapWidth;
    if (barCount % 10 === 0) {
      //Add twice the gap around the x-axis bars
      xVal = xVal + gapWidth;
    }
    while (deficitBars >= 1) {
      barCount = barCount + 1;
      allBars.push({ x: xVal, width: barWidth, color: deficitExplainerPrimary });
      xVal = xVal + barWidth + gapWidth;
      if (barCount % 10 === 0) {
        //Add twice the gap around the x-axis bars
        xVal = xVal + gapWidth;
      }
      deficitBars = deficitBars - 1;
    }
    allBars.push({ x: xVal, width: barWidth * deficitBars, color: deficitExplainerPrimary });

    return (
      <>
        {allBars.map((val, index) => (
          <rect
            key={index}
            y={y}
            height={height}
            width={val.width}
            x={val.x}
            fill={val.color}
            fillOpacity={1}
            opacity={getOpacity(focusedYear, year)}
            aria-hidden={true}
            data-testid="barSegment"
          />
        ))}
      </>
    );
  }
};

export default CustomBarShape;
