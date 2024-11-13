import { ComposedChart, ResponsiveContainer, XAxis, YAxis, Line, Bar, CartesianGrid, Tooltip } from 'recharts';
import { CustomTooltip, Legend, mockChartData } from './interest-expense-chart-helper';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { interestExpensePrimary } from '../../../insight.module.scss';
import { getShortForm } from '../../../../../utils/rounding-utils';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { useWindowSize } from '../../../../../hooks/windowResize';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
};

export const InterestExpenseChart = () => {
  const [width, height] = useWindowSize();
  const [chartData, setChartData] = useState(mockChartData);
  const [fiscalYear, setFiscalYear] = useState(2024);
  const [curExpenseAmount, setCurExpenseAmount] = useState(890000000000);
  const [curRate, setCurRate] = useState(3.8);
  const [isMobile, setIsMobile] = useState(null);
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const [latestData, setLatestData] = useState<{
    year: number;
    expense: number;
    rate: number;
  }>({ year: 2024, expense: 890000000000, rate: 3.8 });

  const defaultRateAxis: number[] = [0, 1, 2, 3, 4];
  const defaultExpenseAxis: number[] = [0, 300000000000, 600000000000, 900000000000, 1200000000000];

  const resetDataHeader = () => {
    if (latestData) {
      setFiscalYear(latestData.year);
      setCurExpenseAmount(latestData.expense);
      setCurRate(latestData.rate);
    }
  };

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width, height]);

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
      <Legend />
      <div
        role="presentation"
        onBlur={() => {
          setChartFocus(false);
          resetDataHeader();
        }}
        onFocus={() => setChartFocus(true)}
        onMouseOver={() => setChartHover(true)}
        onMouseLeave={() => setChartHover(false)}
      >
        <ResponsiveContainer height={360} width={'99%'}>
          <ComposedChart data={chartData} margin={{ top: 12, bottom: -8, left: 3, right: -18 }} accessibilityLayer onMouseLeave={resetDataHeader}>
            <Tooltip
              cursor={{
                stroke: '#00796B60',
                strokeWidth: isMobile ? 16 : 32,
              }}
              content={<CustomTooltip setYear={setFiscalYear} setExpense={setCurExpenseAmount} setRate={setCurRate} />}
              isAnimationActive={false}
              active={chartFocus || chartHover}
            />
            <CartesianGrid vertical={false} stroke="#d9d9d9" />
            <XAxis dataKey={'year'} ticks={[2010, 2013, 2016, 2019, 2022, 2024]} />
            <YAxis
              dataKey={'interestExpense'}
              tickFormatter={value => getShortForm(value)}
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
            <Bar dataKey={'interestExpense'} barSize={isMobile ? 12 : 19} fill={interestExpensePrimary} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
