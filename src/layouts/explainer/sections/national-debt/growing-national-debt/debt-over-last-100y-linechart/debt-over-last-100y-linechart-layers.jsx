import React, { useEffect, useMemo } from 'react';
import { usePlotArea, useXAxisScale, useYAxisScale } from 'recharts';
import { fontSize_10 } from '../../../../../../variables.module.scss';
import { chartConfigs } from './debt-over-last-100y-linechart-helper';
import { addInnerChartAriaLabel, applyChartScaling, applyTextScaling } from '../../../../explainer-helpers/explainer-charting-helper';
import CustomSlices from '../../../../../../components/nivo/custom-slice/custom-slice';
import Point from '../../../../../../components/nivo/custom-point/point';

const usePointPositions = data => {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  return useMemo(() => {
    if (!xScale || !yScale) {
      return null;
    }
    return data.map(datum => ({ x: xScale(datum.x), y: yScale(datum.y), data: datum }));
  }, [xScale, yScale, data]);
};

const buildSlices = (points, plotArea) =>
  points.map((point, index) => {
    const previous = points[index - 1];
    const next = points[index + 1];
    const x0 = previous ? point.x - (point.x - previous.x) / 2 : point.x;
    const x1 = next ? point.x + (next.x - point.x) / 2 : plotArea.x + plotArea.width;
    return {
      id: index,
      x: point.x,
      x0,
      y0: plotArea.y,
      width: x1 - x0,
      height: plotArea.height,
      points: [point],
    };
  });

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

export const Crosshair = ({ currentSlice }) => {
  const plotArea = usePlotArea();
  if (!currentSlice || !plotArea) {
    return null;
  }
  return (
    <line x1={currentSlice.x} x2={currentSlice.x} y1={plotArea.y} y2={plotArea.y + plotArea.height} fill="none" style={chartConfigs.crosshair} />
  );
};

export const HoverPoint = ({ data, currentSlice }) => {
  const points = usePointPositions(data);
  const currentPoint = currentSlice ? currentSlice.points[0] : points?.[points.length - 1];
  return <g data-testid="customPoints">{!!currentPoint && <Point currentPoint={currentPoint} />}</g>;
};

export const HoverSlices = ({ data, ...sliceProps }) => {
  const points = usePointPositions(data);
  const plotArea = usePlotArea();
  const slices = useMemo(() => (points && plotArea ? buildSlices(points, plotArea) : []), [points, plotArea]);
  if (!slices.length) {
    return null;
  }
  return <CustomSlices slices={slices} data={data} {...sliceProps} />;
};
