import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { semiBoldWeight, boldWeight, fontBodyCopy, fontSize_12, fontSize_16 } from '../../../national-deficit.module.scss';
import { getShortForm } from '../../../../../../../utils/rounding-utils';

const CustomBar = props => {
  const { x, y, width, height, fill, payload, dataKey, inView,
  } = props;
  const desktop = width >= 80;
  let label;
  if (dataKey === 'revenue') {
    label = 'Revenue';
  } else if (dataKey === 'deficit') {
    label = 'Deficit';
  } else {
    label = 'Spending';
  }
  const isSpending = dataKey === 'spending';
  const xPosDesktop = isSpending ? x + width + 62 : x - 65;
  const yPosDesktop = y + height / 2 - 5;
  const xPosMobile = isSpending ? x + width + 40 : x - 42;
  const yPosMobile = y + height / 2 - 3;
  const xPos = desktop ? xPosDesktop : xPosMobile;
  const yPos = desktop ? yPosDesktop : yPosMobile;
  return (
    <>
      <text
        x={xPos}
        y={yPos}
        textAnchor="middle"
        fill={fontBodyCopy}
        fontSize={desktop ? fontSize_16 : fontSize_12}
      >
        ${getShortForm(payload[dataKey])}
      </text>
      <text
        x={xPos}
        y={desktop ? yPos + 25 : yPos + 15}
        textAnchor="middle"
        fill={fontBodyCopy}
        fontSize={desktop ? fontSize_16 : fontSize_12}
        fontWeight={desktop ? boldWeight : semiBoldWeight}
      >
        {label}
      </text>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
      />
    </>
  );
};

export default CustomBar;
