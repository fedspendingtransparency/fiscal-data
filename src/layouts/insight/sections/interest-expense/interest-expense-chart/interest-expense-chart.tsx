import { ComposedChart, ResponsiveContainer, XAxis, YAxis, Line, Bar, CartesianGrid, Tooltip } from 'recharts';
import { CustomTooltip, Legend, mockChartData } from './interest-expense-chart-helper';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { interestExpensePrimary } from '../../../insight.module.scss';
import { getShortForm } from '../../../../../utils/rounding-utils';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { useWindowSize } from '../../../../../hooks/windowResize';
import { useGetInterestExpenseData } from '../useGetInterestExpenseData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
};

export const InterestExpenseChart = () => {
  const [width, height] = useWindowSize();
  const { chartData, currentFY, chartXAxisValues, chartLoading } = useGetInterestExpenseData();
  const [fiscalYear, setFiscalYear] = useState(2025);
  const [curExpenseAmount, setCurExpenseAmount] = useState(890000000000);
  const [curRate, setCurRate] = useState(3.8);
  const [isMobile, setIsMobile] = useState(null);
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const [latestData, setLatestData] = useState<{
    year: number;
    expense: number;
    rate: number;
  }>({ year: 2025, expense: 890000000000, rate: 3.8 });

  const defaultRateAxis: number[] = [0, 1, 2, 3, 4];

  const resetDataHeader = () => {
    if (latestData) {
      setFiscalYear(latestData.year);
      setCurExpenseAmount(latestData.expense);
      setCurRate(latestData.rate);
    }
  };

  const generateExpenseValueTicks = (): number[] => {
    const expenseValues = chartData.map(element => element.expense);
    const max = Math.max(...expenseValues);
    const top = Math.round(max / 300000000000) * 300000000000;
    const ticks = [];
    for (let i = 0; i <= top; i += 300000000000) {
      ticks.push(i);
    }
    return ticks;
  };

  const generateInterestRateTicks = (): number[] => {
    const rateValues = chartData.map(element => element.rate);
    const max = Math.max(...rateValues);
    const top = Math.ceil(max);
    const ticks = [];
    for (let i = 0; i <= top; i++) {
      ticks.push(i);
    }
    return ticks;
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
      {chartLoading ? (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      ) : (
        <>
          <div>
            <ChartDataHeader
              dateField={fiscalYear === latestData.year ? 'FYTD' : 'Fiscal Year'}
              fiscalYear={fiscalYear}
              right={{ label: 'Interest Expense', value: `$${getShortForm(curExpenseAmount.toString())}` }}
              left={{ label: 'Avg. Interest Rate', value: `${curRate}%` }}
            />
          </div>
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
                    ticks={generateExpenseValueTicks()}
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
                    ticks={generateInterestRateTicks()}
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
        </>
      )}
    </div>
  );
};
