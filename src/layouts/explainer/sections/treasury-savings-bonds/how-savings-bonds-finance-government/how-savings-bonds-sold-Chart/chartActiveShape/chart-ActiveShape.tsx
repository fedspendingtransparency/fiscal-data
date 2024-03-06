import React from 'react';
import { Sector } from 'recharts';

interface ActiveShapeProps {
  cx?: number;
  cy?: number;
  midAngle?: number; // Middle of the angle for the active slice
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: any;
  value?: number;
  percent?: number;
  activeIndex?: string;
}

const RADIAN = Math.PI / 180;
const RenderActiveShape = (props: ActiveShapeProps) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
    percent,
    activeIndex
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius) * sin;
  const mx = cx + (outerRadius + 80) * cos;
  const my = cy + (outerRadius + 10) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 25;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={(ex + (cos >= 0 ? 1 : -1) * 12) +45 } y={ey - 12} dy={8} textAnchor="middle">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius + .5}
        outerRadius={outerRadius -.5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={activeIndex ? 'rgba(176,	74,	189, .4)' : fill }
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={'#555555'} fill="none" />

      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 13} textAnchor={textAnchor} fill="#333">{`${(percent).toFixed(2)}%`}</text>
    </g>
  );
};

export default RenderActiveShape;
