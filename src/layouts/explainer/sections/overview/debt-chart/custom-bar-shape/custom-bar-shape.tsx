import React from 'react';

const getBarSizes = (width, countDown) => {
  const splitWidth = (width / countDown).toFixed(1);
  const totalWidth = splitWidth * 10;
  const barWidth = 6.3; //(1 / 13.3) * totalWidth;
  const gapWidth = 1.89; //0.3 * bar;
  return { barWidth, gapWidth };
};

const CustomBarShape = props => {
  const { height, width, y, x, fill, payload, dataKey, year } = props;

  const debtBar = dataKey.includes('debt');
  const deficitBar = dataKey.includes('deficit');

  const debtVal = props[`debt${year}`];
  const debtRemainder = debtVal % 1;
  const deficitInitialIndex = (debtVal + (1 - debtRemainder)) % 10;

  const { barWidth, gapWidth } = getBarSizes(width, payload[dataKey]);
  if (width > 0) {
    let xVal = x;
    const firstBar = barWidth * (1 - debtRemainder);
    const axisGap = deficitInitialIndex % 10 === 0 ? gapWidth : 0;
    const allBars = [];
    let remainingBars = payload[dataKey];
    if (deficitBar) {
      // first deficit bar will be split from the final debt bar
      allBars.push({ x: xVal, width: firstBar });
      xVal = xVal + firstBar + axisGap + gapWidth;
      remainingBars = remainingBars - (1 - debtRemainder);
      console.log(payload[dataKey], remainingBars, debtRemainder);
    } else {
      //first debt bar will start with a gap
      xVal = xVal + gapWidth;
    }
    let barCount = debtBar ? 0 : deficitInitialIndex;
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
            // opacity={getOpacity(focusedYear, year)}
          />
        ))}
      </>
    );
  }
};

export default CustomBarShape;
