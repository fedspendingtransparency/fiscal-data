import React, { FunctionComponent, useState } from 'react';
import { chartCopy } from './i-bond-sales-chart-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { LineChart, ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getShortForm } from '../../../../../../utils/rounding-utils';

const IBondSalesChart: FunctionComponent = () => {
  const lastUpdated = new Date();
  const [curInflation, setCurInflation] = useState();
  const [curSales, setCurSales] = useState();
  const [curYear, setYear] = useState();

  const IBondMockData = [
    { year: 2003, sales: 0, inflation: 0 },
    { year: 2005, sales: 2500000000, inflation: 1 },
    { year: 2008, sales: 3000000000, inflation: 2 },
    { year: 2010, sales: 5000000000, inflation: 1 },
    { year: 2013, sales: 4000000000, inflation: 3 },
    { year: 2018, sales: 9000000000, inflation: 2 },
    { year: 2021, sales: 15000000000, inflation: 7.5 },
    { year: 2023, sales: 17000000000, inflation: 7 },
  ];

  const CustomTooltip = ({ payload }) => {
    console.log(payload);
    return <></>;
  };

  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={lastUpdated} footer={chartCopy.footer} header={chartCopy.header}>
        <ResponsiveContainer height={377} width="99%">
          <LineChart data={IBondMockData} margin={{ top: 16, bottom: 0, left: -18, right: 16 }}>
            <CartesianGrid vertical={false} stroke="#d9d9d9" />
            <XAxis dataKey="year" type="number" domain={[2003, 2023]} ticks={[2003, 2008, 2013, 2018, 2023]} minTickGap={3} />
            <YAxis dataKey="sales" axisLine={false} tickLine={false} domain={[0, 20000000000]} tickFormatter={value => `$${getShortForm(value)}`} />
            <YAxis
              yAxisId={1}
              dataKey="inflation"
              type="number"
              axisLine={false}
              tickLine={false}
              domain={[0, 8]}
              tickFormatter={value => `${value}%`}
              orientation="right"
            />
            <Line dataKey="sales" stroke="#B04ABD" dot={false} strokeWidth={1} activeDot={false} isAnimationActive={false} />
            <Line
              dataKey="inflation"
              stroke="#666"
              strokeDasharray="2 2"
              dot={false}
              strokeWidth={2}
              activeDot={false}
              isAnimationActive={false}
              yAxisId={1}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: '#555', strokeWidth: '2px' }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
};

export default IBondSalesChart;
