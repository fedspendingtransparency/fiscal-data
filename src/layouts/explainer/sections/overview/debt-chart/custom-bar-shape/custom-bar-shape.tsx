import React from 'react';

const CustomBarShape = props => {
  const { height, width, y, x, fill, payload, dataKey, year } = props;

  const barType = dataKey.includes('debt') ? 'debt' : 'deficit';
  const debtVal = props[`debt${year}`];
  const debtRemainder = debtVal % 1;
  const debtIndexRemainder = (debtVal + (1 - debtRemainder)) % 10;
  let countDown = payload[dataKey];

  const splitWidth = (width / countDown).toFixed(1);
  const totalWidth = splitWidth * 10;
  const bar = 6.3; //(1 / 13.3) * totalWidth;
  const gapWidth = 1.89; //0.3 * bar;
  if (width > 0) {
    let xVal = x;
    const firstBar = bar * (1 - debtRemainder);
    const axisGap = debtIndexRemainder % 10 === 0 ? gapWidth : 0;
    const allBars = [];
    if (barType === 'deficit') {
      allBars.push({ x: xVal, width: firstBar });
      xVal = xVal + firstBar + axisGap + gapWidth;
      countDown = countDown - (1 - debtRemainder);
    } else {
      xVal = xVal + gapWidth;
    }
    let barCount = barType === 'debt' ? 0 : debtIndexRemainder;
    while (countDown >= 1) {
      barCount = barCount + 1;
      const debtAxisGap = barCount !== 0 && barCount % 10 === 0 ? gapWidth : 0;
      const deficitAxisGap = barCount % 10 === 0 ? gapWidth : 0;
      const axisGap = barType === 'debt' ? debtAxisGap : deficitAxisGap;
      allBars.push({ x: xVal, width: bar });
      xVal = xVal + bar + gapWidth + axisGap;
      countDown = countDown - 1;
    }
    console.log(bar, countDown);
    allBars.push({ x: xVal, width: bar * countDown });

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
