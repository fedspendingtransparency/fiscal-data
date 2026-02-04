import { pointer, select, selectAll } from 'd3-selection';
import 'd3-selection-multi';
import 'd3-transition';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeParse } from 'd3-time-format';
import { area, line } from 'd3-shape';
import { interpolateNumber } from 'd3-interpolate';
import setAxes from './setAxes';
import initTooltip from './tooltip';

const d3 = {
  select,
  selectAll,
  extent,
  scaleLinear,
  scaleTime,
  timeParse,
  line,
  interpolateNumber,
};
let w,
  data,
  options,
  el,
  dateField,
  fields,
  lines,
  y,
  container,
  dataType,
  labels,
  scales,
  previousExtent,
  toolTipDateKey,
  svgDefs,
  roundingDenomination,
  fieldColors;

const baseYAxisWidth = 72;

const chartDimensions = {
  height: 360,
  xAxisHeight: 30,
  yAxisWidth: baseYAxisWidth,
  marginTop: 10,
  marginRight: 13,
};
const duration = 1000;
const parseTime = d3.timeParse('%Y-%m-%d');

const setWidth = selection => {
  w = selection.node().getBoundingClientRect().width;
  chartDimensions.width = w - chartDimensions.yAxisWidth - chartDimensions.marginRight;
};

const setScales = fields => {
  const scales = {};

  const extent = d3.extent(
    data.reduce((arr, r) => {
      return arr.concat(
        d3.extent(
          fields.map(f => {
            return parseFloat(r[f]);
          })
        )
      );
    }, [])
  );

  //set min to 0 if greater than zero.
  extent[0] = extent[0] > 0 ? 0 : extent[0];

  if (extent[0] !== undefined && extent[1] !== undefined) {
    scales.y = d3
      .scaleLinear()
      .domain(extent)
      .range([chartDimensions.height, 0])
      .nice();

    previousExtent = extent;
  } else {
    scales.y = d3
      .scaleLinear()
      .domain(previousExtent)
      .range([chartDimensions.height, 0])
      .nice();
  }

  scales.x = d3
    .scaleTime()
    .domain(d3.extent(data, d => parseTime(d[dateField])))
    .range([chartDimensions.yAxisWidth, chartDimensions.yAxisWidth + chartDimensions.width]);

  return scales;
};

const lineFn = (field, scales) => {
  if (data) {
    return d3
      .line()
      .x(function(d) {
        return scales.x(parseTime(d[dateField]));
      })
      .y(function(d) {
        return scales.y(d[field]);
      })(data.filter(d => d[field] && d[field] !== 'null')); // remove nulls
  }
};

const draw = (container, scales, fields, fieldColors, _visibleFields) => {
  if (options && options.shading) {
    lines = container
      .append('g')
      .selectAll('path')
      .remove()
      .data(fields);

    const a1 = area()
      .x(d => scales.x(parseTime(d[dateField])))
      .y0(options.shading.side === 'under' ? chartDimensions.height : 0)
      .y1(d => scales.y(d[fields[0]]))(data.filter(d => d[fields[0]] && d[fields[0]] !== 'null'));

    lines
      .enter()
      .append('path')
      .data([data])
      .attr('class', 'area')
      .attr('d', a1)
      .style('fill', options.shading.color || 'transparent');

    // Second area needed for a pattern in addition to a fill
    if (options.shading.hatchDirection) {
      const hatchDirectionUp = 'M6,-2 l4,4 M0,0 l8,8 M-2,6 l4,4';
      const hatchDirectionDown = 'M2,-2 l4,-4 M0,8 l8,-8 M6,10 l4,-4';

      const a2 = area()
        .x(d => scales.x(parseTime(d[dateField])))
        .y0(options.shading.side === 'under' ? chartDimensions.height : 0)
        .y1(d => scales.y(d[fields[0]]))(data.filter(d => d[fields[0]] && d[fields[0]] !== 'null'));

      svgDefs
        .append('pattern')
        .attr('id', 'gradient')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('path')
        .attr('d', options.hatchDirection === 'down' ? hatchDirectionDown : hatchDirectionUp)
        .attr('stroke', '#000000')
        .attr('stroke-width', 0.5);

      lines
        .enter()
        .append('path')
        .data([data])
        .attr('class', 'area')
        .attr('d', a2)
        .style('fill', 'url(#gradient)');
    }

    lines
      .enter()
      .append('path')
      .attr('d', function(d) {
        return lineFn(d, scales);
      })
      .attr('data-name', function(d) {
        return d;
      })
      .classed('dataviz-line', true)
      .attr('data-testid', 'dataviz-line')
      .attr('stroke', function(d, i) {
        return options.shading?.color || '#4971b7';
      })
      .attr('stroke-width', 1)
      .attr('opacity', 1)
      .attr('fill', function(d, i) {
        return 'none';
      });

    if (options.placeInitialMarker) {
      placeMarker(true);
    }
  } else {
    // TODO: this code is very similar to creating the lines with shading, but D3 doesn't like
    // when the .data() function is separated from the rest of it. We should figure out a way to
    // consolidate these into one common function.
    lines = container
      .append('g')
      .selectAll('path')
      .remove()
      .data(fields)
      .enter()
      .append('path')
      .attr('d', function(d) {
        return lineFn(d, scales);
      })
      .attr('data-name', function(d) {
        return d;
      })
      .classed('dataviz-line', true)
      .attr('data-testid', 'dataviz-line')
      .attr('stroke', function(d, i) {
        let color = '#4971b7';
        if (fieldColors) {
          color = fieldColors[d];
        }
        return color;
      })
      .attr('stroke-width', (d, i) => {
        if (Array.isArray(_visibleFields)) {
          return _visibleFields.includes(d) ? 1 : 0;
        } else {
          return 1;
        }
      })
      .attr('opacity', 1)
      .attr('fill', function(d, i) {
        return 'none';
      });
  }
};

const onHover = (on, item) => {
  const line = lines.filter(d => d === item);

  line.attr('stroke-width', on ? 2 : 1);
};

const onFieldUpdates = fieldList => {
  const scales = setScales(fieldList);

  y.yAxis.scale(scales.y);

  container.selectAll('.axis--y text').classed('nothing-selected', fieldList.length === 0);

  const yAxisDom = y.yAxisDom
    .transition()
    .duration(duration)
    .call(y.yAxis)
    .ease();

  lines
    .transition()
    .duration(duration)
    .attr('d', function(d) {
      return lineFn(d, scales);
    })
    .attr('opacity', function(d) {
      return fieldList.indexOf(d) !== -1 ? 1 : 0;
    })
    .attr('stroke-width', function(d) {
      return fieldList.indexOf(d) !== -1 ? 1 : 0;
    })
    .call(yAxisDom)
    .ease();

  setTooltips(fieldList, scales);

  container.selectAll('.domain').raise();
};

const onUpdateChartWidth = (ref, _fields, _visibleFields) => {
  el = ref;
  setContainer();
  scales = setScales(_fields);
  y = setAxes(container, scales, chartDimensions, dataType, roundingDenomination, roundingDenomination ? true : false);
  draw(container, scales, fields, fieldColors, _visibleFields);
  setTooltips();
};

const setContainer = () => {
  const parentSelection = d3.select(el);
  parentSelection.select('svg').remove();

  setWidth(parentSelection);

  container = parentSelection
    .append('svg')
    .attr('data-test-id', 'chartContainer')
    .attr('height', chartDimensions.height + chartDimensions.xAxisHeight + chartDimensions.marginTop)
    .attr('width', w)
    .append('g')
    .classed('secondary-container', true)
    .attr('transform', `translate(0,${chartDimensions.marginTop})`);

  svgDefs = parentSelection.select('svg').append('defs');
};

const setTooltips = (fieldsToShow, currentScales) => {
  const visibleFields = fieldsToShow || fields;

  currentScales = currentScales || scales;

  if (data && !options.noTooltip) {
    const visibleContainer = container.select('.shaders');
    initTooltip({
      data,
      currentScales,
      container,
      visibleContainer,
      visibleFields,
      dateField,
      chartDimensions,
      labels,
      dataType,
      toolTipDateKey,
      roundingDenomination,
      fieldColors,
    });
  }
};

const initChart = (_data, _el, _dateField, _fields, _labels, _roundingDenomination, _options = {}) => {
  data = _data;
  el = _el;
  dateField = _dateField;
  fields = _fields;
  options = _options;
  dataType = options.format === true ? 'CURRENCY' : options.format;
  labels = _labels;
  markers = [_data[0]];
  roundingDenomination = _roundingDenomination;
  toolTipDateKey = options.toolTipDateKey;
  chartDimensions.height = options.forceHeight || chartDimensions.height;
  chartDimensions.yAxisWidth = roundingDenomination ? 130 : options.forceYAxisWidth || baseYAxisWidth;
  fieldColors = options.fieldColors;
  setContainer();

  if (data) {
    scales = setScales(fields);
    const isRoundedAxis = !!roundingDenomination;
    y = setAxes(container, scales, chartDimensions, dataType, roundingDenomination, isRoundedAxis, options);

    draw(container, scales, fields, fieldColors);
  }

  setTooltips();

  return {
    onHover: onHover,
    onFieldUpdates: onFieldUpdates,
    onUpdateChartWidth: onUpdateChartWidth,
  };
};

export default initChart;

// Mouseover functions
let hoverFunction, chartId, markers;
const placeMarker = initial => {
  clearMarkers();

  if (initial) {
    d3.select('.secondary-container')
      .append('circle')
      .attr('r', 8)
      .attr('fill', 'rgba(216,216,216,0.5)')
      .attr(
        'transform',
        `translate(
        ${scales.x(parseTime(data[0][dateField]))},
        ${scales.y(Number(data[0][fields[0]]))}
      )`
      );

    d3.select('.secondary-container')
      .append('circle')
      .attr('r', 4)
      .attr('fill', '#000')
      .attr(
        'transform',
        `translate(
        ${scales.x(parseTime(data[0][dateField]))},
        ${scales.y(Number(data[0][fields[0]]))}
      )`
      );
  }

  const m = container
    .select('.secondary-container')
    .selectAll('circle')
    .data(markers);

  m.enter()
    .append('circle')
    .attr('r', 8)
    .attr('fill', 'rgba(216,216,216,0.5)')
    .attr(
      'transform',
      d => `translate(
      ${scales.x(parseTime(d[dateField]))},
      ${scales.y(Number(d[fields[0]]))}
    )`
    );

  m.enter()
    .append('circle')
    .attr('r', 4)
    .attr('fill', '#000')
    .attr(
      'transform',
      d => `translate(
      ${scales.x(parseTime(d[dateField]))},
      ${scales.y(Number(d[fields[0]]))}
    )`
    );
};

const clearMarkers = () => {
  container.selectAll('circle').remove();
};

const mouseout = function() {
  setTimeout(() => {
    markers = [data[0]];
    placeMarker();
    hoverFunction(null, 0);
  }, 500);
};

const mousemove = function(event) {
  // This index represents the x value closest to where the mouse is on the graph
  const [mx] = pointer(event, this);
  const closestXIndex = Math.round((mx / chartDimensions.width) * (data.length - 1));

  const selectedData = data[closestXIndex];

  if (selectedData && selectedData[fields[0]]) {
    markers = [data[closestXIndex]];
    placeMarker();

    // This brings the overlay element to the front so hovering over the markers doesn't prevent
    // hover effects from working. Instead of raising the hover effects <rect> in the DOM (which
    // triggers `mouseout` on Firefox) we can lower the graph.
    d3.selectAll('.secondary-container').lower();

    hoverFunction(selectedData[dateField], selectedData[fields[0]]);
  } else {
    mouseout();
  }
};

export const hoverEffectsId = 'line-chart-hover-effects';
export const addHoverEffects = (_data, _chartId, _dateField, _fields, _hoverFunction) => {
  data = _data;
  chartId = _chartId;
  dateField = _dateField;
  fields = _fields;
  markers = [_data[0]];
  hoverFunction = _hoverFunction;
  const parentSelection = d3.select(`#${chartId}`);
  container = parentSelection.select('svg');

  setWidth(container);
  setScales(fields);

  // On mobile, if you click on one line chart and then on a different one, the hover effects <rect>
  // can be duplicated. This removes potential duplicates of that <rect> before creating a new one.
  removeHoverEffects();

  container
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('id', hoverEffectsId)
    .attr('cursor', 'pointer')
    .attr('width', chartDimensions.width)
    .attr('height', chartDimensions.height + chartDimensions.marginTop)
    .attr('transform', `translate(${chartDimensions.yAxisWidth},0)`)
    .on('click', function(event) {
      mousemove(event);
    })
    .on('mousemove', function(event) {
      mousemove(event);
    })
    .on('mouseout', mouseout);
};

export const removeHoverEffects = () => {
  d3.select(`#${hoverEffectsId}`).remove();
};
