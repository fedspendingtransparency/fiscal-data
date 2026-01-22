import { Tooltip } from 'recharts/es6/component/Tooltip';
import { ComposedChart } from 'recharts/es6/chart/ComposedChart';
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
import { Cell } from 'recharts/es6/component/Cell';
import { Bar } from 'recharts/es6/cartesian/Bar';
import { Area } from 'recharts/es6/cartesian/Area';
import { Line } from 'recharts/es6/cartesian/Line';
import { XAxis } from 'recharts/es6/cartesian/XAxis';
import { YAxis } from 'recharts/es6/cartesian/YAxis';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { stateAndLocalGovernmentSeriesLight, stateAndLocalGovernmentSeriesPrimary } from '../../../../insight.module.scss';
import { CustomTooltip, formatDate, formatXAxis } from '../state-and-local-government-series-chart-helper';
import React, { FunctionComponent, useEffect, useState } from 'react';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
};

const SLGSBarChart: FunctionComponent = ({
  chartData,
  height,
  width,
  xAxisValues,
  setCurCount,
  setCurAmount,
  setCurDate,
  chartFocus,
  chartHover,
  totalMonths,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const MobileXAxisLabel = ({ x, y, payload }) => {
    const formattedDate = formatDate(payload.value);
    const splitDate = formattedDate.split(' ');
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize="12px">
          {splitDate[0]}
        </text>
        <text x={0} y={12} dy={16} textAnchor="middle" fill="#666" fontSize="12px">
          {splitDate[1]}
        </text>
      </g>
    );
  };
  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  const getInterval = monthCount => {
    let interval = 1;
    if (isMobile && monthCount > 204) {
      interval = 3;
    } else if ((monthCount > 24 && monthCount <= 72) || !monthCount || monthCount <= 12) {
      interval = 0;
    }
    return interval;
  };

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
                strokeWidth: isMobile ? 16 : 32,
              }}
              content={<CustomTooltip setCount={setCurCount} setAmount={setCurAmount} setDate={setCurDate} />}
              isAnimationActive={false}
              active={chartFocus || chartHover}
            />
            <Bar dataKey="totalAmount" barSize={isMobile ? 12 : 20} fill={stateAndLocalGovernmentSeriesPrimary} isAnimationActive={false}>
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
          tick={isMobile && (!totalMonths || totalMonths <= 24) ? <MobileXAxisLabel /> : undefined}
          fontSize={12}
          ticks={xAxisValues}
          height={48}
          interval={getInterval(totalMonths)}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
export default SLGSBarChart;
