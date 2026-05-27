import { timeFormat } from 'd3-time-format';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeDay, timeMonth } from 'd3-time';
import { differenceInCalendarDays } from 'date-fns';
import { formatForDataType } from './utils';

let container,
  scales,
  chartDimensions,
  dataType,
  roundingDenomination,
  isRoundedAxis,
  options = {};
const y = {};

export const complexDate = (d, i) => {
  if (timeFormat('%d')(d) === '01' && timeFormat('%m')(d) === '01') {
    return timeFormat('%Y')(d);
  } else if (i === 0) {
    return timeFormat('%b %d, %Y')(d);
  } else {
    return timeFormat('%b %d')(d);
  }
};

export const markMonths = (d, i) => {
  return timeFormat('%b')(d);
};

const thinXLabels = xAxis => {
  const days = differenceInCalendarDays(scales.x.domain()[1], scales.x.domain()[0]);

  xAxis.ticks(5);

  if (options.xAxisTickValues) {
    xAxis.tickValues(options.xAxisTickValues);
  } else if (days < 10) {
    xAxis.ticks(timeDay.every(1));
  } else if (days < 32) {
    xAxis.ticks(timeDay.every(10));
  } else if (days < 400) {
    xAxis.ticks(timeMonth.every(1));
  } else if (days < 500) {
    xAxis.ticks(timeMonth.every(3));
  } else if (days < 1400) {
    xAxis.ticks(timeMonth.every(12));
  } else {
    xAxis.ticks(5);
  }
  if (days < 180) {
    xAxis.tickFormat(complexDate);
  } else if (days < 400) {
    xAxis.tickFormat(markMonths);
  } else {
    xAxis.tickFormat(timeFormat('%Y'));
  }
};

const setXAxis = () => {
  let innerTickSize = 0;
  if (!options.noInnerXAxisTicks) {
    innerTickSize = options.placeInnerXAxisTicksBelowLine ? 5 : 0 - chartDimensions.height;
  }
  const xAxis = axisBottom(scales.x)
    .tickSizeInner(innerTickSize)
    .tickSizeOuter(options.showOuterXAxisTicks ? 5 : 0);

  thinXLabels(xAxis);
  if (!options.excludeYAxis) {
    container
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + chartDimensions.height + ')')
      .call(xAxis);
  } else {
    container
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + (Number(chartDimensions.height) - Number(chartDimensions.xAxisHeight)) + ')')
      .call(xAxis);
  }
};

const setYAxis = isRoundedAxis => {
  y.yAxis = axisLeft(scales.y)
    .ticks(options.yAxisTickNumber || 10)
    .tickSizeInner(0 - chartDimensions.width)
    .tickFormat(d => {
      return formatForDataType(d, dataType, roundingDenomination, isRoundedAxis);
    })
    .tickSizeOuter(0);

  y.yAxisDom = container
    .append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', `translate(${chartDimensions.yAxisWidth}, 0)`)
    .call(y.yAxis);

  if (options.forceLabelFontSize) {
    container
      .selectAll('.axis--y > .tick > text')
      .attr('dx', options.forceYAxisWidth * 0.25 || '0.32em')
      .style('font-size', options.forceLabelFontSize);

    container.selectAll('.axis--x > .tick > text').style('font-size', options.forceLabelFontSize);
  }
};

const createShaders = noShaders => {
  const tickValues = [];

  container.selectAll('.axis--y g.tick').each(d => tickValues.push(d));

  const rectCount = Math.floor(tickValues.length / 2);

  const shadersContainer = container
    .append('g')
    .classed('shaders', true)
    .attr('transform', `translate(${chartDimensions.yAxisWidth}, 0)`)
    .lower()
    .selectAll('rect')
    .data(new Array(rectCount));

  if (!noShaders) {
    const rectHeight = scales.y(tickValues[0]) - scales.y(tickValues[1]);

    shadersContainer
      .enter()
      .append('rect')
      .attr('width', chartDimensions.width)
      .attr('height', rectHeight)
      .attr('transform', (d, i) => `translate(0, ${scales.y(tickValues[i * 2 + 1])})`)
      .attr('fill', '#f8f8f8');
  }
};

const setAxes = (_container, _scales, _chartDimensions, _dataType, _roundingDenomination, _isRoundedAxis, _options = {}) => {
  container = _container;
  scales = _scales;
  chartDimensions = _chartDimensions;
  isRoundedAxis = _isRoundedAxis;
  roundingDenomination = _roundingDenomination;
  dataType = _dataType;
  options = _options;

  if (!options.excludeXAxis) {
    setXAxis();
  }
  if (!options.excludeYAxis) {
    setYAxis(isRoundedAxis, roundingDenomination);
  }

  createShaders(options.noShaders);

  container.selectAll('.domain').raise();
  container.selectAll('.axis--x text').attr('y', '16');

  return y;
};

export default setAxes;
