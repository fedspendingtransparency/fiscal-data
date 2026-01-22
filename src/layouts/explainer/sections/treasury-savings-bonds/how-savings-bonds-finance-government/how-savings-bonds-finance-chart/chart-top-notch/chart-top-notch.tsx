import React from 'react';
import { Sector } from 'recharts/es6/shape/Sector';

interface ActiveShapeProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  opacity?: number;
  payload?: any;
  percent?: number;
}

const RADIAN = Math.PI / 180;
const ChartTopNotch = (props: ActiveShapeProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, opacity, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + 80) * cos;
  const my = cy + (outerRadius + 10) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 25;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <>
      <g>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12 + 40} y={ey - 12} dy={8} fill="#555555" textAnchor="middle" fontSize={14} fontWeight={600}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius + 0.5}
          outerRadius={outerRadius - 0.5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={opacity}
          aria-label={`${payload.name}: Value: ${payload.value} Percent: ${payload.percent?.toFixed(2)}%`}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#555555" fill="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 13} textAnchor={textAnchor} fill="#555555" fontSize={14} fontWeight={400}>
          {`${percent.toFixed(1)}%`}
        </text>
      </g>
    </>
  );
};

export default ChartTopNotch;
