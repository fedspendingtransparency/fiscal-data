import { ComposedChart, ResponsiveContainer, XAxis, YAxis, Line, Bar, CartesianGrid } from 'recharts';
import { mockChartData } from './interest-expense-chart-helper';
import React from 'react';
import { useState } from 'react';
import { yAxisFormatter } from '../../../../explainer/sections/treasury-savings-bonds/purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';

export const InterestExpenseChart = () => {
  const [chartData, setChartData] = useState(mockChartData);

  const defaultRateAxis: number[] = [0, 1, 2, 3, 4];
  const rateAxisInterval = 1.0;
  const defaultExpenseAxis: number[] = [0, 300000000000, 600000000000, 900000000000, 1200000000000];
  const expenseAxisInterval = 300000000000;

  // const formatMockData = () ={
  //
  // }

  return (
    <div>
      <ResponsiveContainer height={360} width={'99%'}>
        <ComposedChart data={chartData}>
          <CartesianGrid vertical={false} stroke="#d9d9d9" />
          <XAxis dataKey={'year'} ticks={[2010, 2013, 2016, 2019, 2022, 2024]} />
          <YAxis
            dataKey={'interestExpense'}
            tickFormatter={value => yAxisFormatter(value)}
            axisLine={false}
            tickLine={false}
            ticks={defaultExpenseAxis}
            tick={{ fill: '#00796B' }}
          />
          <YAxis
            yAxisId={1}
            dataKey={'avgInterestRate'}
            orientation={'right'}
            axisLine={false}
            tickLine={false}
            type="number"
            tickCount={5}
            ticks={defaultRateAxis}
            tickFormatter={value => `${value.toFixed(1)}%`}
          />
          <Line dataKey={'avgInterestRate'} yAxisId={1} stroke={'#666666'} type={'monotone'} strokeWidth={1} />
          <Bar dataKey={'interestExpense'} barSize={18} fill={'#00796B'} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
