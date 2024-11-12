import { ComposedChart, ResponsiveContainer, XAxis, YAxis, Line, Bar, CartesianGrid, Tooltip } from 'recharts';
import { CustomTooltip, mockChartData } from './interest-expense-chart-helper';
import React from 'react';
import { useState } from 'react';
import { yAxisFormatter } from '../../../../explainer/sections/treasury-savings-bonds/purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';
import { interestExpensePrimary } from '../../../insight.module.scss';
import { getShortForm } from '../../../../../utils/rounding-utils';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { legendContainer, expenseLegend, rateLegend, expenseText, rectangle, line } from './interest-expense-chart.module.scss';

export const InterestExpenseChart = () => {
  const [chartData, setChartData] = useState(mockChartData);
  const [fiscalYear, setFiscalYear] = useState(2024);
  const [curExpenseAmount, setCurExpenseAmount] = useState(890000000000);
  const [curRate, setCurRate] = useState(3.8);

  const defaultRateAxis: number[] = [0, 1, 2, 3, 4];
  const defaultExpenseAxis: number[] = [0, 300000000000, 600000000000, 900000000000, 1200000000000];

  return (
    <div>
      <div>
        <ChartDataHeader
          dateField={'FYTD'}
          fiscalYear={fiscalYear}
          right={{ label: 'Interest Expense', value: `$${getShortForm(curExpenseAmount)}` }}
          left={{ label: 'Avg. Interest Rate', value: `${curRate}%` }}
        />
      </div>
      <div className={legendContainer}>
        <div className={expenseLegend}>
          <span className={expenseText}>Interest Expense</span>
          <div className={rectangle} />
        </div>
        <div className={rateLegend}>
          <div className={line} />
          <span>Avg. Interest Rate</span>
        </div>
      </div>
      <ResponsiveContainer height={360} width={'99%'}>
        <ComposedChart data={chartData} margin={{ top: 12, bottom: -8, left: 3, right: -18 }} accessibilityLayer>
          <Tooltip
            cursor={{
              stroke: '#00796B60',
              strokeWidth: 32,
            }}
            content={<CustomTooltip setYear={setFiscalYear} setExpense={setCurExpenseAmount} setRate={setCurRate} />}
            isAnimationActive={false}
            active={true}
          />
          <CartesianGrid vertical={false} stroke="#d9d9d9" />
          <XAxis dataKey={'year'} ticks={[2010, 2013, 2016, 2019, 2022, 2024]} />
          <YAxis
            dataKey={'interestExpense'}
            tickFormatter={value => yAxisFormatter(value)}
            axisLine={false}
            tickLine={false}
            ticks={defaultExpenseAxis}
            tick={{ fill: interestExpensePrimary }}
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
          <Line dataKey={'avgInterestRate'} yAxisId={1} stroke={'#666666'} type={'monotone'} strokeWidth={1} activeDot={false} />
          <Bar dataKey={'interestExpense'} barSize={19} fill={interestExpensePrimary} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
