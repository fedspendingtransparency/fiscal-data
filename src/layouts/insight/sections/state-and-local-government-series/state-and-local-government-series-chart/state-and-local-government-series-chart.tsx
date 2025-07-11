import React, { FunctionComponent, useEffect, useState } from 'react';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import ChartTableContainer from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import { chartConfig, CustomTooltip, formatDate, Legend } from './state-and-local-government-series-chart-helper';
import { useGetStateAndLocalGovernmentSeriesData } from '../useGetStateAndLocalGovernmentSeriesData';
import { Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { stateAndLocalGovernmentSeriesLight, stateAndLocalGovernmentSeriesPrimary } from '../../../insight.module.scss';
import { withWindowSize } from 'react-fns';
import { customNumberFormatter } from '../../../../../helpers/text-format/text-format';
import { chartTableBorder } from './state-and-local-government-series-chart.module.scss';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
};

const StateAndLocalGovernmentSeriesChart: FunctionComponent = ({ width }) => {
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const { chartData, xAxisValues, xAxisMobileValues } = useGetStateAndLocalGovernmentSeriesData();
  const [isMobile, setIsMobile] = useState<boolean>(null);
  const [curDate, setCurDate] = useState<number>(0);
  const [curAmount, setCurAmount] = useState<number>(0);
  const [curCount, setCurCount] = useState<number>(0);

  const { height, altText } = chartConfig;
  const setDefaultHeaderValues = () => {
    if (chartData) {
      setCurDate(chartData[chartData.length - 1].date);
      setCurAmount(chartData[chartData.length - 1].totalAmount);
      setCurCount(chartData[chartData.length - 1].totalCount);
    }
  };

  useEffect(() => {
    setDefaultHeaderValues();
  }, [chartData]);

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  return (
    <>
      <ChartTableContainer
        title="Outstanding State and Local Government Series (SLGS) Securities"
        isLoading={!chartData}
        height={height}
        chart={
          <>
            <div className={chartTableBorder} aria-label={altText}>
              <ChartDataHeader
                dateField="Date"
                fiscalYear={formatDate(curDate)}
                right={{ label: 'Amount', value: `$${getShortForm(curAmount.toString())}` }}
                left={{ label: 'Count', value: customNumberFormatter.format(curCount, 0) }}
              />
              <div>
                <Legend />
                <div
                  data-testid="chartParent"
                  role="presentation"
                  onBlur={() => {
                    setChartFocus(false);
                    setDefaultHeaderValues();
                  }}
                  onFocus={() => setChartFocus(true)}
                  onMouseOver={() => setChartHover(true)}
                  onMouseLeave={() => setChartHover(false)}
                >
                  <ResponsiveContainer height={height} width="99%">
                    <ComposedChart data={chartData} margin={{ top: 12, bottom: -8, left: 3, right: -18 }} accessibilityLayer>
                      <YAxis
                        dataKey="totalAmount"
                        type="number"
                        tickFormatter={value => {
                          if (value === 0) {
                            return '$0';
                          } else {
                            return `$${getShortForm(value)}`;
                          }
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickCount={7}
                      />
                      <YAxis
                        yAxisId={1}
                        dataKey="totalCount"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        type="number"
                        tickFormatter={value => {
                          if (value === 0) {
                            return '0';
                          } else {
                            return `${value / 1000}K`;
                          }
                        }}
                        tickCount={7}
                      />
                      <Tooltip
                        cursor={{
                          stroke: stateAndLocalGovernmentSeriesLight,
                          strokeWidth: 32,
                        }}
                        content={<CustomTooltip setCount={setCurCount} setAmount={setCurAmount} setDate={setCurDate} />}
                        isAnimationActive={false}
                        active={chartFocus || chartHover}
                      />
                      <Bar dataKey="totalAmount" barSize={isMobile ? 12 : 24} fill={stateAndLocalGovernmentSeriesPrimary} isAnimationActive={false}>
                        {chartData?.map((entry, index) => {
                          return <Cell key={`cell-${index}`} fill={stateAndLocalGovernmentSeriesPrimary} />;
                        })}
                      </Bar>
                      <Line
                        dataKey="totalCount"
                        yAxisId={1}
                        stroke="#666666"
                        type="monotone"
                        strokeWidth={2}
                        activeDot={false}
                        dot={false}
                        isAnimationActive={false}
                        strokeDasharray="2 2"
                      />
                      <XAxis
                        dataKey="date"
                        tickFormatter={value => formatDate(value)}
                        tickCount={isMobile ? 6 : 12}
                        fontSize={12}
                        ticks={isMobile ? xAxisMobileValues : xAxisValues}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        }
        table={<>table</>}
      ></ChartTableContainer>
    </>
  );
};

export default withWindowSize(StateAndLocalGovernmentSeriesChart);
