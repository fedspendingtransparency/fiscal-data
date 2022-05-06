
import { area, mouse } from 'd3';
import { BaseType, select, selectAll, Selection, ValueFn } from "d3-selection"
import { transition } from 'd3-transition';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeParse } from 'd3-time-format';
import { line } from 'd3-shape';
import { interpolateNumber} from 'd3-interpolate';
import setAxes from './setAxes';
import initTooltip from './tooltip';
import { ChartConfig } from '../../../layouts/explainer/multichart/multichart';

const d3 = {
  select,
  selectAll,
  extent,
  scaleLinear,
  scaleTime,
  timeParse,
  line,
  transition,
  interpolateNumber
}

const baseYAxisWidth = 66;

const chartDimensions = {
  height: 560,
  xAxisHeight: 30,
  yAxisWidth: baseYAxisWidth,
  marginTop: 10,
  marginRight: 13,
  width: null
}
const duration = 1000;
const parseTime = d3.timeParse('%Y-%m-%d');


export class MultichartRenderer {
  w: number;
  y: any;
  container: Selection<BaseType, unknown, HTMLElement, any>;
  svgDefs: any;
  chartId: string;

/*
,
  toolTipDateKey
,
  ;*/

  setWidth = (selection: Selection<BaseType, unknown, HTMLElement, any>) => {
    this.w = (selection.node() as HTMLElement).getBoundingClientRect().width;
    chartDimensions.width = this.w - chartDimensions.yAxisWidth - chartDimensions.marginRight;
  };

  setScales = (config: any, chartCount:number, chartIndex:number) => {
    const scales: any = {};

    const extent = d3.extent(
      config.data.reduce((arr, r) => {
        return arr.concat(d3.extent(config.fields.map(f => {
          return parseFloat(r[f]);
        })))
      }, [])
    );

    //set min to 0 if greater than zero.
    extent[0] = extent[0] > 0 ? 0 : extent[0];

    // const segmentHeight = (config.chartDimensions.height) / chartCount;
    const segmentHeight = 275;

    config.segmentMinY = segmentHeight * chartIndex;
    config.segmentMaxY = segmentHeight * (chartIndex + 1);
    console.log('config.options.inverted', config.options.inverted);

    if (extent[0] !== undefined && extent[1] !== undefined) {
      scales.y = d3
        .scaleLinear()
        .domain(extent)
        .range(config.options.inverted ?
          [config.segmentMinY, config.segmentMaxY] : [config.segmentMaxY, config.segmentMinY])
        .nice();

      config.previousExtent = extent;
    } else {
      scales.y = d3
        .scaleLinear()
        .domain(config.previousExtent)
        .range(config.options.inverted ?
          [config.segmentMinY, config.segmentMaxY] : [config.segmentMaxY, config.segmentMinY])
        .nice();
    }

    scales.x = d3
      .scaleTime()
      .domain(d3.extent(config.data, d => parseTime(d[config.dateField])))
      .range([
        config.chartDimensions.yAxisWidth,
        config.chartDimensions.yAxisWidth + config.chartDimensions.width]);

    return scales;
  };

  static lineFn = (field: string, config: ChartConfig) => {
    if (config.data) {
      return d3
        .line()
        .x(function(d) {
          return config.scales.x(parseTime(d[config.dateField]))
        })
        .y(function(d) {
          return config.scales.y(d[field])
        })(config.data.filter(d => d[field] && d[field] !== 'null')) // remove nulls
    }
  }

  draw(config: ChartConfig):void {

    const createArea = () => area()
      .x((d) => config.scales.x(parseTime(d[config.dateField])))
      .y0(config.options.shading.side === 'under' ? config.segmentMinY : config.segmentMaxY)
      .y1((d) => (
        config.scales.y(d[config.fields[0]])
      ))(config.data.filter(d => d[config.fields[0]] && d[config.fields[0]] !== 'null'));

    if (config.options && config.options.shading) {
      config.lines = this.container.append('g')
        .selectAll("path")
        .data(config.fields);

      const a1 = createArea();

      config.lines.enter()
        .append('path')
        .data([config.data])
        .attr("class", "area")
        .attr("d", a1)
        .style('fill', config.options.shading.color || 'transparent');

      // Second area needed for a pattern in addition to a fill
      if (config.options.shading.hatchDirection) {
        const hatchDirectionUp = 'M6,-2 l4,4 M0,0 l8,8 M-2,6 l4,4';
        const hatchDirectionDown = 'M2,-2 l4,-4 M0,8 l8,-8 M6,10 l4,-4';

        const a2 = createArea();

        this.svgDefs.append('pattern')
          .attr('id', 'gradient')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('width', 8)
          .attr('height', 8)
          .append('path')
          .attr('d', config.options.shading.hatchDirection === 'down' ?
            hatchDirectionDown : hatchDirectionUp)
          .attr('stroke', '#000000')
          .attr('stroke-width', 0.5);

        config.lines.enter()
          .append('path')
          .data([config.data])
          .attr("class", "area")
          .attr("d", a2)
          .style('fill', 'url(#gradient)')
      }

      config.lines.enter()
        .append("path")
        .attr("d", function(d) {
          return MultichartRenderer.lineFn(d, config)
        })
        .attr("data-name", function(d) {
          return d;
        })
        .classed('dataviz-line', true)
        .attr('data-testid', 'dataviz-line')
        .attr("stroke", function(d, i) {
          return config.options.shading?.color || '#4971b7'
        })
        .attr('stroke-width', 1)
        .attr("opacity", 1)
        .attr("fill", function(d, i) {
          return "none"
        })

      if (config.options.placeInitialMarker) {
        placeMarker(true, config, this.container, this.chartId);
      }
    } else {
      // TODO: this code is very similar to creating the lines with shading, but D3 doesn't like
      // when the .data() function is separated from the rest of it. We should figure out a way to
      // consolidate these into one common function.
      config.lines = this.container.append('g')
        .selectAll("path")
        .remove()
        .data(config.fields)
        .enter()
        .append("path")
        .attr("d", function(d) {
          return MultichartRenderer.lineFn(d, config);
        })
        .attr("data-name", function(d) {
          console.log('d', d);
          return d;
        })
        .classed('dataviz-line', true)
        .attr('data-testid', 'dataviz-line')
        .attr("stroke", function(d, i) {
          return '#4971b7'
        })
        .attr('stroke-width', 1)
        .attr("opacity", 1)
        .attr("fill", function(d, i) {
          return "none"
        });
      if (config.options.placeInitialMarker) {
        placeMarker(true, config, this.container, this.chartId);
      }
    }
  }

/*  onHover = (on, item) => {
    const line = lines.filter(d => d === item);

    line.attr('stroke-width', on ? 2 : 1)
  }

  onFieldUpdates = (fieldList) => {
    const scales = setScales(fieldList);

    y.yAxis.scale(scales.y)

    container.selectAll('.axis--y text')
      .classed('nothing-selected', (fieldList.length === 0));

    const yAxisDom = y.yAxisDom
      .transition()
      .duration(duration)
      .call(y.yAxis)
      .ease();

    lines.transition()
      .duration(duration)
      .attr('d', function(d) {
        return lineFn(d, scales)
      })
      .attr('opacity', function(d) {
        return (fieldList.indexOf(d) !== -1) ? 1 : 0;
      })
      .call(yAxisDom)
      .ease();

    setTooltips(fieldList, scales);

    container.selectAll('.domain').raise();
  }
*/
/*  onUpdateChartWidth = (ref, _fields) => {
    el = ref;
    setContainer();
    scales = setScales(_fields);
    y = setAxes(container, scales, chartDimensions, dataType);
    draw(container, scales, _fields);
    setTooltips();
  }*/

  setContainer = (elementRef: any) => {
    const parentSelection = d3.select(elementRef);
    parentSelection.select("svg").remove();

    this.setWidth(parentSelection);

    this.container = parentSelection
      .append("svg")
      .attr('data-testid', 'multichartContainer')
      .attr(
        "height",
        chartDimensions.height + chartDimensions.xAxisHeight + chartDimensions.marginTop
      )
      .attr("width", this.w)
      .append('g')
      .classed(`${this.chartId}-surface`, true)
      .attr('transform', `translate(0,${chartDimensions.marginTop})`)

    this.svgDefs = parentSelection.select('svg').append('defs');
  }

/*  setTooltips = (fieldsToShow, currentScales) => {
    const visibleFields = fieldsToShow || fields;

    currentScales = currentScales || scales;

    if (data && !options.noTooltip) {
      const visibleContainer = container.select('.shaders')
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
        toolTipDateKey
      });
    }
  }*/

  constructor (chartConfigs: ChartConfig[], elementRef: any, chartId: string) {
    console.log('chartConfigs', chartConfigs);

    this.chartId = chartId;

    this.setContainer(elementRef);
    chartConfigs.forEach((config, index) => {
      console.log('config.data', config.data);
      if (config.data) {

        config.chartDimensions = Object.assign({}, chartDimensions);
        config.chartDimensions.height = config.options.forceHeight || chartDimensions.height;
        config.chartDimensions.yAxisWidth = config.options.forceYAxisWidth || baseYAxisWidth;
        config.scales = this.setScales(config, chartConfigs.length, index);
        this.y = setAxes(this.container, config.scales, config.chartDimensions, 'RATE', config.options);
        this.draw(config);
      }
    });
  }
}

/*
export default initChart;

// Mouseover functions
let hoverFunction, chartId, markers;
*/

const placeMarker = (initial, config, container, chartId) => {
  clearMarkers(container, config.name);

  const elemClass =`.${chartId}-surface`;
  console.log('elemClass', elemClass);


  console.log(`translation: (${config.scales.x(parseTime(config.data[0][config.dateField]))},
        ${config.scales.y(Number(config.data[0][config.fields[0]]))})`);
  if (initial) {
    d3.select(elemClass)
      .append('circle')
      .classed(`${config.name}-marker`, true)
      .attr('r', 8)
      .attr('fill', 'rgba(216,216,216,0.5)')
      .attr('transform', `translate(${config.scales.x(parseTime(config.data[0][config.dateField]))},
        ${config.scales.y(Number(config.data[0][config.fields[0]]))})`)

    d3.select(elemClass)
      .append('circle')
      .classed(`${config.name}-marker`, true)
      .attr('r', 4)
      .attr('fill', '#000')
      .attr('transform', `translate(${config.scales.x(parseTime(config.data[0][config.dateField]))},
        ${config.scales.y(Number(config.data[0][config.fields[0]]))})`)
  }

  const m = container
    .select(elemClass)
    .selectAll('circle')
    .data([config.data[0]])

  m.enter()
    .append('circle')
    .classed(`${config.name}-marker`, true)
    .attr('r', 8)
    .attr('fill', 'rgba(216,216,216,0.5)')
    .attr('transform', d => (`translate(70, 70)`))

  m.enter()
    .append('circle')
    .classed(`${config.name}-marker`, true)
    .attr('r', 4)
    .attr('fill', '#000')
    .attr('transform', d => (`translate(70, 70)`))
}

const clearMarkers = (container, configName) => {
  container.selectAll(`.${configName}-marker`)
    .remove()
}

/*const mouseout = function() {
  setTimeout(() => {
    markers = [data[0]];
    placeMarker();
    hoverFunction(null, 0);
  }, 500)
}*/

/*
const mousemove = function() {
  // This index represents the x value closest to where the mouse is on the graph
  const closestXIndex = data.length - Math.round(
    (mouse(this)[0] / chartDimensions.width) * (data.length - 1)
  );
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
}
}

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

  container.append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('id', hoverEffectsId)
    .attr('cursor', 'pointer')
    .attr('width', chartDimensions.width)
    .attr('height', chartDimensions.height + chartDimensions.marginTop)
    .attr('transform', `translate(${chartDimensions.yAxisWidth},0)`)
    .on('click', mousemove)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);
}

export const removeHoverEffects = () => {
  d3.select(`#${hoverEffectsId}`).remove();
}
*/
