/* istanbul ignore file */
import React from 'react';
import { Tooltip } from 'recharts/es6/component/Tooltip';
import { Legend } from 'recharts/es6/component/Legend';
import { LineChart } from 'recharts/es6/chart/LineChart';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
import { Line } from 'recharts/es6/cartesian/Line';
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
import { XAxis } from 'recharts/es6/cartesian/XAxis';
import { YAxis } from 'recharts/es6/cartesian/YAxis';

const data = [
  {
    name: '2023',
    color: '#0A2F5A',
    duration: 1300,
    data: [
      { category: 'Oct', value: 0.0 },
      { category: 'Nov', value: 0.25 },
      { category: 'Dec', value: 0.35 },
      { category: 'Jan', value: 0.65 },
      { category: 'Feb', value: 0.75 },
      { category: 'Mar', value: 0.95 },
      { category: 'Arp', value: 1.15 },
      { category: 'May', value: 1.25 },
    ],
  },
  {
    name: '2022',
    color: '#9DABBD',
    duration: 2000,
    data: [
      { category: 'Oct', value: 0 },
      { category: 'Nov', value: 0.15 },
      { category: 'Dec', value: 0.33 },
      { category: 'Jan', value: 0.48 },
      { category: 'Feb', value: 0.69 },
      { category: 'Mar', value: 0.88 },
      { category: 'Arp', value: 1.12 },
      { category: 'May', value: 1.13 },
      { category: 'Jun', value: 1.22 },
      { category: 'Jul', value: 1.22 },
      { category: 'Aug', value: 1.35 },
      { category: 'Sep', value: 1.4 },
    ],
  },
  {
    name: '5 year average (2017-2022)',
    color: '#555',
    duration: 2000,
    data: [
      { category: 'Oct', value: 0 },
      { category: 'Nov', value: 0.22 },
      { category: 'Dec', value: 0.63 },
      { category: 'Jan', value: 0.85 },
      { category: 'Feb', value: 0.95 },
      { category: 'Mar', value: 1.25 },
      { category: 'Arp', value: 1.66 },
      { category: 'May', value: 1.75 },
      { category: 'Jun', value: 1.99 },
      { category: 'Jul', value: 2.23 },
      { category: 'Aug', value: 2.55 },
      { category: 'Sep', value: 2.95 },
    ],
  },
];

const ReLineGraph = () => {
  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart width={500} height={300}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
          <YAxis type="number" domain={[0, 10]} tickCount={9} />
          <Tooltip isAnimationActive={true} animationEasing=";inear" />
          <Legend type="circle" />
          {data.map(e => (
            <Line
              dataKey="value"
              data={e.data}
              name={e.name}
              key={e.name}
              stroke={e.color}
              dot={false}
              strokeWidth={3}
              animationDuration={e.duration}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReLineGraph;
