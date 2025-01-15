import { ComposedChart, ResponsiveContainer, XAxis, YAxis, Line, Bar, CartesianGrid, Tooltip } from 'recharts';
import { CustomTooltip, Legend } from './interest-expense-chart-helper';
import React, { useEffect } from 'react';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { interestExpensePrimary } from '../../../insight.module.scss';
import { getShortForm } from '../../../../../utils/rounding-utils';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { useWindowSize } from '../../../../../hooks/windowResize';
import { useGetInterestExpenseData } from '../useGetInterestExpenseData';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
};

export const InterestExpenseChart = () => {
  const [width, height] = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>(null);
  const { chartData, chartXAxisValues, expenseYAxisValues, rateYAxisValues, latestChartData, altText, chartLoading } = useGetInterestExpenseData(
    true,
    isMobile
  );
  const [fiscalYear, setFiscalYear] = useState<number>(0);
  const [curExpenseAmount, setCurExpenseAmount] = useState<number>(0);
  const [curRate, setCurRate] = useState<number>(0);
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);

  const resetDataHeader = () => {
    if (latestChartData) {
      setFiscalYear(latestChartData.year);
      setCurExpenseAmount(latestChartData.expense);
      setCurRate(latestChartData.rate);
    }
  };

  useEffect(() => {
    if (!chartLoading) {
      setFiscalYear(latestChartData.year);
      setCurExpenseAmount(latestChartData.expense);
      setCurRate(latestChartData.rate);
    }
  }, [chartLoading]);

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width, height]);

  return (
    <div>
      {chartLoading ? (
        <div>
          <Skeleton
            width={'99%'}
            variant="rounded"
            sx={{
              minHeight: 360,
              transition: 'opacity 2s',
            }}
          />
        </div>
      ) : (
        <div aria-label={altText}>
          {fiscalYear > 0 && (
            <div>
              <ChartDataHeader
                dateField={fiscalYear === latestChartData.year ? 'FYTD' : 'Fiscal Year'}
                fiscalYear={fiscalYear}
                right={{ label: 'Interest Expense', value: `$${getShortForm(curExpenseAmount.toString())}` }}
                left={{ label: 'Avg. Interest Rate', value: `${curRate}%` }}
              />
            </div>
          )}
          <div data-testid="chartParent">
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
                <ComposedChart
                  data={chartData}
                  margin={{ top: 12, bottom: -8, left: 3, right: -18 }}
                  accessibilityLayer
                  onMouseLeave={resetDataHeader}
                >
                  <CartesianGrid vertical={false} stroke="#d9d9d9" />
                  <XAxis dataKey={'year'} ticks={chartXAxisValues} />
                  <YAxis
                    dataKey={'expense'}
                    type={'number'}
                    tickFormatter={value => {
                      if (value === 0) {
                        return '$0';
                      } else {
                        return `$${getShortForm(value)}`;
                      }
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickCount={5}
                    ticks={expenseYAxisValues}
                    tick={{ fill: interestExpensePrimary }}
                  />
                  <YAxis
                    yAxisId={1}
                    dataKey={'rate'}
                    orientation={'right'}
                    axisLine={false}
                    tickLine={false}
                    type="number"
                    tickCount={5}
                    ticks={rateYAxisValues}
                    tickFormatter={value => `${value.toFixed(1)}%`}
                  />
                  <Tooltip
                    cursor={{
                      stroke: '#00796B20',
                      strokeWidth: isMobile ? 16 : 32,
                    }}
                    content={<CustomTooltip setYear={setFiscalYear} setExpense={setCurExpenseAmount} setRate={setCurRate} />}
                    isAnimationActive={false}
                    active={chartFocus || chartHover}
                  />
                  <Bar dataKey={'expense'} barSize={isMobile ? 12 : 20} fill={interestExpensePrimary} isAnimationActive={false} />
                  <Line
                    dataKey={'rate'}
                    yAxisId={1}
                    stroke={'#666666'}
                    type={'monotone'}
                    strokeWidth={1}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
