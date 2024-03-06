import React, {FunctionComponent} from 'react';
import { Sector } from 'recharts';

interface ActiveShapeProps  {
  cx? : number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  percent: number;
  name?: string
}
interface DataItem {
  name: string;
  percent: number;
  color?: string;
  securityType: string;
}

const RenderActiveShape: FunctionComponent<ActiveShapeProps> = (props, payload) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent } = props;

  const data = payload[0].payload as DataItem;
  
  return (
    <g>
      <text x={cx} y={10} textAnchor="middle" dominantBaseline="central">
        {data.name}
      </text>
      <text x={cx} y={30} textAnchor="middle" dominantBaseline="central">
        {`${(data.percent * 100).toFixed(2)}%`}
        {  console.log('percent,', percent)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius + .5}
        outerRadius={outerRadius - .5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};
export default RenderActiveShape