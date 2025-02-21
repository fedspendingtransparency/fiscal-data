import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, ReferenceLine, Legend } from 'recharts';
import CustomDualTooltip from './currency-exchange-rates-chart-tooltip';
import ChartLegend from '../../../layouts/explainer/sections/treasury-savings-bonds/purchase-of-savings-bonds/savings-bonds-sold-by-type-chart/chart-legend/chart-legend';

interface ChartDataItem {
  date: string;
  rate: number;
  pctChange: number | null;
  trendRate?: number;
}

interface TrendChartProps {
  chartData: ChartDataItem[];
}

const CurrencyExchangeRateChart: React.FC<TrendChartProps> = ({ chartData }) => {
  const [showCurrentRate, setShowCurrentRate] = useState(true);
  const [showPctChange, setShowPctChange] = useState(true);
  const [showTrend, setShowTrend] = useState(true);

  const hasEnoughData = chartData.length >= 2;
  const displayData = hasEnoughData ? chartData : [{ date: 'No Data', rate: 50, pctChange: 0 }];
  const trendData = useMemo(() => {
    if (!hasEnoughData) return [];
    const n = chartData.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;
    chartData.forEach((d, i) => {
      sumX += i;
      sumY += d.rate;
      sumXY += i * d.rate;
      sumXX += i * i;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return chartData.map((d, i) => ({
      ...d,
      trendRate: slope * i + intercept,
    }));
  }, [chartData, hasEnoughData]);

  const computedDomainRate = useMemo(() => {
    if (!hasEnoughData) return [0, 100];
    const rates = chartData.map(d => d.rate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);
    const buffer = (maxRate - minRate) * 0.1;
    return [minRate - buffer, maxRate + buffer] as [number, number];
  }, [chartData, hasEnoughData]);

  const computedDomainPct = useMemo(() => {
    if (!hasEnoughData) return [-10, 10];
    const pctValues = chartData.filter(d => d.pctChange !== null).map(d => d.pctChange as number);
    if (pctValues.length === 0) return ['auto', 'auto'] as [number | 'auto', number | 'auto'];
    const minPct = Math.min(...pctValues);
    const maxPct = Math.max(...pctValues);
    const buffer = (maxPct - minPct) * 0.1;
    return [minPct - buffer, maxPct + buffer] as [number, number];
  }, [chartData, hasEnoughData]);
  return (
    <div>
      <div style={{ marginTop: '2rem' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayData} margin={{ top: 20, right: 50, bottom: 20, left: 50 }}>
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              label={{
                value: '1 USD',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
              }}
              domain={computedDomainRate}
              tickCount={6}
              tickLine={false}
              tickFormatter={(value: number) => `${value.toFixed(3)}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Pct Change',
                angle: 90,
                position: 'insideRight',
                offset: -10,
              }}
              domain={computedDomainPct}
              tickCount={6}
              tickFormatter={(value: number) => (showTrend ? `${value.toFixed(2)}%` : '')}
              tickLine={false}
            />
            <Tooltip content={props => <CustomDualTooltip {...props} chartData={chartData} />} />
            {hasEnoughData && showCurrentRate && (
              <Line
                dot={false}
                yAxisId="left"
                type="linear"
                strokeWidth={2}
                dataKey="rate"
                stroke="#85bb65"
                activeDot={{ r: 8 }}
                name="Current Rate"
              />
            )}
            {hasEnoughData && showPctChange && (
              <Line
                yAxisId="right"
                dot={false}
                type="linear"
                strokeWidth={2}
                dataKey="pctChange"
                stroke="#4a90e2"
                activeDot={{ r: 8 }}
                name="Percentage Change"
              />
            )}
            {hasEnoughData && showTrend && (
              <Line
                yAxisId="left"
                type="linear"
                dataKey="trendRate"
                data={trendData}
                stroke="#e74c3c"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                name="Trend"
              />
            )}
            {!hasEnoughData && <ReferenceLine yAxisId="left" y={60} stroke="none" label="Not enought data for a graph to generate" />}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
        <label style={{ color: '#85bb65', fontWeight: 600 }}>
          <button
            onClick={() => setShowCurrentRate(!showCurrentRate)}
            style={{
              backgroundColor: '#85bb65',
              width: '1rem',
              height: '1rem',
              border: showCurrentRate ? '2px solid black' : '2px solid #ccc',
              cursor: 'pointer',
            }}
            title="Current Rate"
          />{' '}
          Current Rate
        </label>
        <label style={{ color: '#4a90e2', fontWeight: 600 }}>
          <button
            onClick={() => setShowPctChange(!showPctChange)}
            style={{
              backgroundColor: '#4a90e2',
              width: '1rem',
              height: '1rem',
              border: showPctChange ? '2px solid black' : '2px solid #ccc',
              cursor: 'pointer',
            }}
            title="Percentage Change"
          />{' '}
          Percentage Change
        </label>
        <label style={{ color: '#e74c3c', fontWeight: 600 }}>
          <button
            onClick={() => setShowTrend(!showTrend)}
            style={{
              backgroundColor: '#e74c3c',
              width: '1rem',
              height: '1rem',
              border: showTrend ? '2px solid black' : '2px solid #ccc',
              cursor: 'pointer',
            }}
            title="Trend"
          />{' '}
          Trend
        </label>
      </div>
    </div>
  );
};

export default CurrencyExchangeRateChart;
