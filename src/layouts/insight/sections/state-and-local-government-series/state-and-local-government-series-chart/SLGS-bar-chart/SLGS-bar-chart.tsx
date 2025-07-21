import { Area, Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { stateAndLocalGovernmentSeriesLight, stateAndLocalGovernmentSeriesPrimary } from '../../../../insight.module.scss';
import { CustomTooltip, formatXAxis } from '../state-and-local-government-series-chart-helper';
import React, { FunctionComponent } from 'react';

const SLGSBarChart: FunctionComponent = ({
  chartData,
  height,
  isMobile,
  xAxisMobileValues,
  xAxisValues,
  setCurCount,
  setCurAmount,
  setCurDate,
  chartFocus,
  chartHover,
  totalMonths,
}) => {
  return (
    <ResponsiveContainer height={height} width="99%">
      <ComposedChart data={chartData} margin={{ top: 12, bottom: -8, left: 3, right: -15 }} accessibilityLayer>
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
        {(!totalMonths || totalMonths <= 24) && (
          <>
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
          </>
        )}
        {totalMonths > 24 && (
          <>
            <Area
              dataKey="totalAmount"
              stroke={stateAndLocalGovernmentSeriesPrimary}
              fill={stateAndLocalGovernmentSeriesPrimary}
              fillOpacity={1}
              isAnimationActive={false}
              activeDot={false}
              dot={false}
            />
            <Tooltip
              cursor={{ strokeDasharray: '4 4', stroke: '#555', strokeWidth: '2px' }}
              content={<CustomTooltip setCount={setCurCount} setAmount={setCurAmount} setDate={setCurDate} />}
              isAnimationActive={false}
              active={chartFocus || chartHover}
            />
          </>
        )}
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
          tickFormatter={value => formatXAxis(value, totalMonths)}
          fontSize={12}
          ticks={isMobile ? xAxisMobileValues : xAxisValues}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
export default SLGSBarChart;
