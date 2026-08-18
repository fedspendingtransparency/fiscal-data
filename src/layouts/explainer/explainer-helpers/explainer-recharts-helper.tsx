import React, { useEffect, useRef } from 'react';
import { useActiveTooltipDataPoints, usePlotArea, useXAxisScale, useYAxisScale } from 'recharts';
import { fontSize_10, fontSize_14 } from '../../../variables.module.scss';
import { addInnerChartAriaLabel, applyChartScaling, applyTextScaling } from './explainer-charting-helper';
import Point from '../../../components/nivo/custom-point/point';

const e10 = Math.sqrt(50);
const e5 = Math.sqrt(10);
const e2 = Math.sqrt(2);

const tickSpacing = (start, stop, count) => {
  const step = Math.abs(stop - start) / Math.max(1, count);
  const power = Math.floor(Math.log10(step));
  const error = step / Math.pow(10, power);
  const factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  return factor * Math.pow(10, power);
};

export const getTicks = (start, stop, count) => {
  const step = tickSpacing(start, stop, count);
  const ticks = [];
  for (let i = Math.ceil(start / step); i <= Math.floor(stop / step); i++) {
    ticks.push(i * step);
  }
  return ticks;
};

export const getNiceDomain = (min, max, count = 10) => {
  let start = min;
  let stop = max;
  let previousStep;
  for (let i = 0; i < 10; i++) {
    const step = tickSpacing(start, stop, count);
    if (step === previousStep) break;
    start = Math.floor(start / step) * step;
    stop = Math.ceil(stop / step) * step;
    previousStep = step;
  }
  return [start, stop];
};

export const axisThickness = 1;

export const subtractAxisThickness = margin => ({
  ...margin,
  bottom: margin.bottom - axisThickness,
  left: margin.left - axisThickness,
});

export const axisConfigs = {
  axisThickness,
  axisLine: { stroke: '#666666', strokeWidth: 1 },
  tickLine: { stroke: '#777777', strokeWidth: 1 },
  tick: { fill: '#333333', fontFamily: 'sans-serif', fontSize: fontSize_14 },
  crosshair: {
    stroke: '#555555',
    strokeWidth: 2,
    strokeOpacity: 0.75,
    strokeDasharray: '6 6',
    pointerEvents: 'none' as const,
  },
  zIndex: { axis: 50, point: 600, slices: 700 },
};

export const useActiveDatum = () => useActiveTooltipDataPoints()?.[0];

export const ChartScaling = ({ parent, chartWidth, chartHeight, pageWidth }) => {
  const plotArea = usePlotArea();
  const plotWidth = plotArea?.width;
  const plotHeight = plotArea?.height;

  useEffect(() => {
    if (!plotWidth || !plotHeight) {
      return;
    }
    applyChartScaling(parent, chartWidth.toString(), chartHeight.toString());
    addInnerChartAriaLabel(parent);
    applyTextScaling(parent, chartWidth, pageWidth, fontSize_10);
  }, [parent, chartWidth, chartHeight, pageWidth, plotWidth, plotHeight]);

  return null;
};

export const Crosshair = () => {
  const plotArea = usePlotArea();
  const xScale = useXAxisScale();
  const datum = useActiveDatum();
  if (!plotArea || !xScale || !datum) {
    return null;
  }
  const x = xScale(datum.x);
  return <line x1={x} x2={x} y1={plotArea.y} y2={plotArea.y + plotArea.height} fill="none" style={axisConfigs.crosshair} />;
};

export const HoverPoint = ({ data, onActiveChange }) => {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const activeDatum = useActiveDatum();
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    onActiveChangeRef.current?.(activeDatum);
  }, [activeDatum]);

  const datum = activeDatum ?? data?.[data.length - 1];
  return <g data-testid="customPoints">{!!datum && !!xScale && !!yScale && <Point currentPoint={{ x: xScale(datum.x), y: yScale(datum.y) }} />}</g>;
};
