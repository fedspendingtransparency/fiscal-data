import { axisBottom, mouse } from 'd3';
import { select, selectAll } from 'd3-selection';
import 'd3-transition';
import 'd3-selection-multi';
import { extent } from 'd3-array';
import { scaleLinear, scaleUtc } from 'd3-scale';
import { utcParse } from 'd3-time-format';
import { line } from 'd3-shape';

let data,
  chartId,
  dateField,
  field,
  container,
  fontSize = 16,
  w,
  markers,
  hoverFunction;
const scales = {};

const d3 = { select, selectAll, extent, scaleLinear, scaleUtc, utcParse, line },
  chartDimensions = {
    height: 100,
  },
  parseTime = d3.utcParse('%Y-%m-%d');

const setScales = () => {
  const extent = d3.extent(data.map(d => Number(d[field])));

  scales.y = d3
    .scaleLinear()
    .domain(extent)
    .range([chartDimensions.height - 8, 0]);

  scales.x = d3
    .scaleUtc()
    .domain(d3.extent(data, d => parseTime(d[dateField])))
    .range([0, w - 8]);
};

const setWidth = selection => {
  w = selection.node().getBoundingClientRect().width;
  chartDimensions.width = w - chartDimensions.yAxisWidth;
};

const lineFn = () => {
  return d3
    .line()
    .x(function(d) {
      return scales.x(parseTime(d[dateField]));
    })
    .y(function(d) {
      return scales.y(Number(d[field]));
    });
};

const placeMarkers = () => {
  clearMarkers();
  container
    .select('.ink')
    .selectAll('circle')
    .data(markers)
    .enter()
    .append('circle')
    .attr('data-test-id', 'marker')
    .attr('r', 4)
    .attr('fill', d =>
      d[field] > 0 ? '#4971b7' : '#f2655b' // TODO: replace hard coded hex values with variables?
    )
    .attr('transform', d => `translate(${scales.x(parseTime(d[dateField]))}, ${scales.y(Number(d[field]))})`);
};

const clearMarkers = () => {
  container
    .select('.ink')
    .selectAll('circle')
    .remove();
};

const draw = () => {
  container
    .append('g')
    .classed('ink', true)
    .attr('transform', 'translate(4, 4)')
    .append('path')
    .attr('d', () => {
      return lineFn()(data);
    })
    .attr('data-test-id', 'chart-sparkline')
    .attr('stroke', '#4971b7')
    .attr('stroke-width', 2)
    .attr('opacity', 1)
    .attr('fill', 'none');
};

const drawXLabel = () => {
  container
    .append('g')
    .classed('x-label', true)
    .attr('transform', `translate(4,${chartDimensions.height + 12})`)
    .attr('color', 'red')
    .call(
      axisBottom(scales.x)
        .ticks(0)
        .tickSize(-2)
    );

  // Appending a 2nd X axis so the ticks at the start and end will extend above and below the axis
  container
    .append('g')
    .classed('x-label', true)
    .attr('transform', `translate(4,${chartDimensions.height + 12})`)
    .attr('color', 'red')
    .call(
      axisBottom(scales.x)
        .ticks(0)
        .tickSize(3)
    );
};

const defaultFormatter = {
  'font-size': '0.875rem',
  'font-weight': 'normal',
  'margin-top': '.5rem',
  fill: '#666',
};

const calcLabelY = () => {
  /*
    fontSize
  */
  return chartDimensions.height + Math.floor(35 * (fontSize / 16));
};

const drawXStartLabel = (label, formatter = defaultFormatter) => {
  container
    .append('text')
    .attr('class', 'x-label-text')
    .attr('x', 0)
    .attr('y', calcLabelY())
    .attrs(formatter)
    .text(label);
};

const drawXEndLabel = (label, formatter = defaultFormatter) => {
  container
    .append('text')
    .attr('class', 'x-label-text')
    .attr('text-anchor', 'end')
    .attr('x', w)
    .attr('y', calcLabelY())
    .attrs(formatter)
    .text(label);
};

const drawLineChart = ({ showXLabel, xStartLabel, xEndLabel, formatterXLabel }) => {
  const parentSelection = d3.select(`#${chartId}`);
  fontSize = d3
    .select('html')
    .style('font-size')
    .replace(/px/g, '');

  parentSelection.select('svg').remove();

  setWidth(parentSelection);

  container = parentSelection
    .append('svg')
    .classed('container', true)
    .attr('height', chartDimensions.height + 50)
    .attr('width', w)
    .append('g');

  setScales();

  if (data) {
    draw();
  }

  if (showXLabel) {
    drawXLabel();

    if (xStartLabel) {
      drawXStartLabel(xStartLabel, formatterXLabel);
    }

    if (xEndLabel) {
      drawXEndLabel(xEndLabel, formatterXLabel);
    }
  }
};

const drawChart = (chartType, chartOptions) => {
  if (chartType === 'line') {
    drawLineChart(chartOptions);
  }
};

const initChart = (_data, _chartId, _dateField, _field, _showXLabel, _xStartLabel, _xEndLabel, _formatterXLabel) => {
  data = _data;
  chartId = _chartId;
  dateField = _dateField;
  field = _field;
  markers = [_data[data.length - 1]];

  const chartOptions = {
    showXLabel: _showXLabel,
    xStartLabel: _xStartLabel,
    xEndLabel: _xEndLabel,
    formatterXLabel: _formatterXLabel,
  };

  drawChart('line', chartOptions);
  placeMarkers();
};

const mouseout = function() {
  markers = [data[data.length - 1]];
  placeMarkers();
  hoverFunction(null, null);
};

const mousemove = function() {
  // This index represents the x value closest to where the mouse is on the graph
  const closestXIndex = Math.round((mouse(this)[0] / w) * (data.length - 1));
  const selectedData = data[closestXIndex];

  if (selectedData && selectedData[field]) {
    markers = [data[closestXIndex]];
    placeMarkers();

    // This brings the overlay element to the front so hovering over the markers doesn't prevent
    // hover effects from working. Instead of raising the hover effects <rect> in the DOM (which
    // triggers `mouseout` on Firefox) we can lower the graph.
    d3.selectAll('circle').lower();
    d3.selectAll('path').lower();

    hoverFunction(selectedData[field], selectedData[dateField]);
  } else {
    mouseout();
  }
};

export const hoverEffectsId = 'line-chart-hover-effects';
export const addHoverEffects = (_data, _chartId, _dateField, _field, _hoverFunction) => {
  data = _data;
  chartId = _chartId;
  dateField = _dateField;
  field = _field;
  markers = [_data[data.length - 1]];
  hoverFunction = _hoverFunction;

  const parentSelection = d3.select(`#${chartId}`);
  container = parentSelection.select('.container');

  setScales();

  // On mobile, if you click on one line chart and then on a different one, the hover effects <rect>
  // can be duplicated. This removes potential duplicates of that <rect> before creating a new one.
  removeHoverEffects();

  container
    .select('.ink')
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('id', hoverEffectsId)
    .attr('cursor', 'pointer')
    .attr('width', w)
    .attr('height', chartDimensions.height)
    .on('click', mousemove)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
};

export const removeHoverEffects = () => {
  d3.select(`#${hoverEffectsId}`).remove();
};

export default initChart;
