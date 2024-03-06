import React, {FunctionComponent} from 'react';
import { Sector, CellProps } from 'recharts';

interface ActiveShapeProps extends CellProps {
  cx? : number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload?: any;
  percent?: number;
  name?: string

}

const RenderActiveShape: FunctionComponent<ActiveShapeProps> = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  // This is an example. You can customize the layout and style as needed
  return (
    <g>
      <text x={cx} y={cy - outerRadius - 10} textAnchor="middle" dominantBaseline="central">
        {payload.name}
      </text>
      <text x={cx} y={cy - outerRadius + 10} textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};
export default RenderActiveShape