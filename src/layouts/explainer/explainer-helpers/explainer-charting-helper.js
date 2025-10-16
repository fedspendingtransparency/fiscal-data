import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import Point from '../../../components/nivo/custom-point/point';
import { fontSize_10, fontSize_14 } from '../explainer.module.scss';
import React from 'react';
export const applyChartScaling = (parent, chartWidth, chartHeight) => {
  // this function rewrites some element attribs after render to ensure Chart scales with container
  // which doesn't seem to happen naturally when nivo has a flex container
  const svgChart = document.querySelector(`[data-testid= ${parent}] svg`);
  if (svgChart) {
    svgChart.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
    svgChart.setAttribute('height', '100%');
    svgChart.setAttribute('width', '100%');
  }
};

export const addInnerChartAriaLabel = parent => {
  const svgChart = document.querySelector(`[data-testid= ${parent}] svg`);
  if (svgChart) {
    svgChart.setAttribute('aria-label', 'Inner chart area');
  }
};

export const applyTextScaling = (parent, chartWidth, pageWidth, fontSize) => {
  const svgChart = document.querySelector(`[data-testid= ${parent}] svg`);
  if (svgChart) {
    if (pageWidth < pxToNumber(breakpointLg)) {
      const containerWidth = document.querySelector(`[data-testid= ${parent}]`).offsetWidth;
      const ratio = chartWidth / containerWidth;
      const textElements = document.querySelectorAll(`[data-testid= ${parent}] text`);
      [...textElements].forEach(text => {
        text.style.fontSize = `${parseFloat(fontSize) * ratio}rem`;
      });
    }
  }
};

export const chartInViewProps = {
  threshold: 0,
  triggerOnce: true,
  rootMargin: '-50% 0% -50% 0%',
};

export const formatCurrency = v => {
  if (parseFloat(v) < 0) {
    return `$${Math.abs(v)} T`;
  } else if (parseFloat(v) > 0) {
    return `$${v} T`;
  } else {
    return `$${v}`;
  }
};

export const formatPercentage = v => {
  return `${v}%`;
};

export const getChartTheme = (width, markers) => {
  const fontSize = width
    ? {
        fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
      }
    : {};
  const markerFontSize =
    width && markers
      ? {
          fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
        }
      : {};
  return {
    ...fontSize,
    ...markerFontSize,
    textColor: '#666666',
    axis: {
      domain: {
        line: {
          strokeWidth: 1,
          stroke: '#666666',
        },
      },
      ticks: {
        text: {
          ...fontSize,
        },
      },
    },
    crosshair: {
      line: {
        stroke: '#555555',
        strokeWidth: 2,
        pointerEvents: 'all',
      },
    },
    marker: {
      fill: '#666666',
    },
  };
};

export const nivoCommonLineChartProps = {
  enablePoints: true,
  pointSize: 0,
  enableGridX: false,
  enableGridY: false,
  useMesh: true,
  isInteractive: true,
  enableCrosshair: true,
  crosshairType: 'x',
  animate: false,
  sliceTooltip: () => null,
  tooltip: () => null,
  enableSlices: 'x',
  axisTop: null,
  axisRight: null,
};

const getLastValue = (values, name) =>
  values
    .filter(g => g.seriesId === name)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    .pop();

export const LineChartCustomPoint = ({ currentSlice, borderWidth, borderColor, points, seriesId }) => {
  const lastPoint = getLastValue(points, seriesId);
  const currentPoint = currentSlice?.points?.length ? currentSlice.points[0] : lastPoint;
  return (
    <g data-testid="customPoints">{!!currentPoint && <Point borderColor={borderColor} borderWidth={borderWidth} currentPoint={currentPoint} />}</g>
  );
};

export const LineChartCustomPoints_GDP = ({ currentSlice, borderWidth, borderColor, points, seriesId }) => {
  const lastPrimaryPoint = getLastValue(points, seriesId);

  const lastGdpPoint = getLastValue(points, 'GDP');

  const lastGDPPercentagePoint = getLastValue(points, 'GDP Percentage');

  const defaultPrimaryPoint = lastPrimaryPoint ? lastPrimaryPoint : lastGDPPercentagePoint;

  const currentPrimaryPoint = currentSlice?.points?.length ? currentSlice.points[0] : defaultPrimaryPoint;

  const currentGdpPoint = currentSlice?.points?.length ? currentSlice.points[1] : lastGdpPoint;

  return (
    <g data-testid="customPoints">
      {currentPrimaryPoint && <Point borderColor={borderColor} borderWidth={borderWidth} currentPoint={currentPrimaryPoint} />}
      {currentGdpPoint && <Point borderColor={borderColor} borderWidth={borderWidth} currentPoint={currentGdpPoint} />}
    </g>
  );
};
