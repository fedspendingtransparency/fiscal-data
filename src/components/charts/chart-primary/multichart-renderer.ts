import { area, mouse } from 'd3';
import { BaseType, select, selectAll, Selection } from "d3-selection"
import { transition } from 'd3-transition';
import { extent } from 'd3-array';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeParse } from 'd3-time-format';
import { line } from 'd3-shape';
import { interpolateNumber} from 'd3-interpolate';
import setAxes from './setAxes';
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

const baseYAxisWidth = 70;
const parseTime = d3.timeParse('%Y-%m-%d');


export class MultichartRenderer {
  w: number;
  y: unknown;
  container: Selection<BaseType, unknown, HTMLElement, unknown>;
  svgDefs: Selection<BaseType, unknown, HTMLElement, unknown>;
  chartId: string;
  chartConfigs: ChartConfig[];
  fields: [];
  markers: unknown;
  hoverFunction: (unknown) => void;
  hoverEffectsId: string;
  elementRef: HTMLElement;
  rendered: boolean = false;
  chartDimensions = {
    height: 400,
    xAxisHeight: 16,
    yAxisWidth: baseYAxisWidth,
    marginTop: 10,
    marginRight: 53,
    marginLeft: 71,
    width: null
  }

  constructor (chartConfigs: ChartConfig[], elementRef: HTMLElement, chartId: string) {
    this.chartConfigs = [];
    this.elementRef = elementRef;
    this.chartId = chartId;

    chartConfigs.forEach((config) => {
      this.chartConfigs.push(Object.assign({}, config));
    });

    this.hoverEffectsId = `${this.chartId}-line-chart-hover-effects`;
    this.generateChart();
  }

  generateChart = (): void => {
    this.setContainer();
    this.chartConfigs.forEach((config, index) => {
      if (config.data) {
        config.chartDimensions = Object.assign({}, this.chartDimensions);
        config.chartDimensions.height = config.options.forceHeight || this.chartDimensions.height;
        config.chartDimensions.yAxisWidth = config.options.forceYAxisWidth || baseYAxisWidth;
        config.scales = this.setScales(config, this.chartConfigs.length, index);
        this.y = setAxes(this.container,
          config.scales,
          this.chartDimensions,
          'RATE',
          config.options);
        this.draw(config);
      }
    });
    this.connectMarkers(this.chartConfigs[0].data.length - 1);
  }

  setWidth = (selection: Selection<BaseType, unknown, HTMLElement, unknown>): void => {
    this.w = (selection.node() as HTMLElement).getBoundingClientRect().width;
    this.chartDimensions.width = this.w - this.chartDimensions.yAxisWidth -
      this.chartDimensions.marginRight;
  };

  setScales = (
    config: ChartConfig,
    chartCount:number,
    chartIndex:number
  ): {x: unknown, y: unknown} => {

    const scales = {} as {x: unknown, y: unknown};

    const extent = d3.extent(
      config.data.reduce((arr, r) => {
        return arr.concat(d3.extent(config.fields.map(f => {
          return parseFloat(r[f]);
        })))
      }, [])
    );

    //set min to 0 if greater than zero.
    extent[0] = extent[0] > 0 ? 0 : extent[0];

    const segmentHeight = ((this.chartDimensions.height - this.chartDimensions.marginTop) / 2) -
      this.chartDimensions.xAxisHeight;

    config.segmentMinY = segmentHeight * chartIndex;
    config.segmentMaxY = segmentHeight * (chartIndex + 1);

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
        config.chartDimensions.marginLeft,
        config.chartDimensions.yAxisWidth + config.chartDimensions.width]);

    return scales;
  };

  static lineFn = (field: string, config: ChartConfig): string => {
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
  };

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
        .attr("stroke", function() {
          return config.options.shading?.color || '#4971b7'
        })
        .attr('stroke-width', 1)
        .attr("opacity", 1)
        .attr("fill", function() {
          return "none"
        })

      if (config.options.placeInitialMarker) {
        this.placeMarker(config,config.data.length - 1);
      }
      this.placeMarginLabels(config);
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
          return d;
        })
        .classed('dataviz-line', true)
        .attr('data-testid', 'dataviz-line')
        .attr("stroke", function() {
          return '#555555'
        })
        .attr('stroke-width', 2)
        .attr("opacity", 1)
        .attr("fill", function() {
          return "none"
        });
      if (config.options.placeInitialMarker) {
        this.placeMarker(config,config.data.length - 1);
      }
      this.placeMarginLabels(config);
    }

    this.rendered = true;
  }

  setContainer = (): void => {
    const parentSelection = d3.select(this.elementRef);
    parentSelection.select("svg").remove();

    this.setWidth(parentSelection);

    // initially retrieve dimensions config from first chart
    const config = this.chartConfigs[0];
    this.chartDimensions.height = config.options.forceHeight || this.chartDimensions.height;

    // scale height-to-width as needed
    if (config.options.maxHeightToWidthRatio) {
      this.chartDimensions.height =
        ((this.chartDimensions.height / this.w) <=
          config.options.maxHeightToWidthRatio) ? this.chartDimensions.height :
          this.w * config.options.maxHeightToWidthRatio;
    }

    this.container = parentSelection
      .append("svg")
      .attr('data-testid', 'multichartContainer')
      .attr(
        "height",
        this.chartDimensions.height +
        this.chartDimensions.xAxisHeight + this.chartDimensions.marginTop
      )
      .attr("width", this.w)
      .append('g')
      .classed(`${this.chartId}-surface`, true)
      .attr('transform', `translate(0,${this.chartDimensions.marginTop})`)

    this.svgDefs = parentSelection.select('svg').append('defs');
  }

  addHoverEffects = (hoverFunction: (dateString: string|null) => void): void => {
    this.hoverFunction = hoverFunction;

    const parentSelection = d3.select(`#${this.chartId}`);
    const svgContainer = parentSelection.select('svg');

    // On mobile, if you click on one line chart and then on a different one,
    // the hover effects <rect> can be duplicated. This removes potential
    // duplicates of that <rect> before creating a new one.
    this.removeHoverEffects();

    const dataSegments = this.chartConfigs[0].data.length;
    const segmentWidth = Math.round(this.chartDimensions.width / dataSegments);
    const mouseMargin = Math.round(segmentWidth / 2);

    const mouseTracker = svgContainer.append('rect')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('id', this.hoverEffectsId)
      .attr('data-testid', this.hoverEffectsId)
      .attr('cursor', 'pointer')
      .attr('width', this.chartDimensions.width + segmentWidth)
      .attr('height', '480')
      .attr('transform', `translate(${this.chartDimensions.yAxisWidth - mouseMargin},0)`)
      .on('mouseout', this.mouseout);

    mouseTracker
      .on('click', this.mousemove)
      .on('mousemove', this.mousemove);
  }

  removeHoverEffects = (): void => {
    d3.select(`#${this.hoverEffectsId}`).remove();
  }

  mouseout = (): void => {
    this.chartConfigs.forEach((config) => {
      setTimeout(() => {
        this.placeMarker(config, 0);
        this.hoverFunction(null);
      }, 500);
    });
    setTimeout(() => {
      this.connectMarkers(0);
    }, 500);
  };

  animateChart = (callback: (recordDate: string) => void): void => {

    let selectedData;

    this.chartConfigs[0].data.forEach((dataRow, index) => {
      setTimeout(() => {
        this.chartConfigs.forEach((config) => {

          selectedData = config.data[index];
          this.placeMarker(config, index);
          d3.selectAll(`.${this.chartId}-surface`).lower();
        });

        this.connectMarkers(index);
        if (selectedData) {
          callback(selectedData[this.chartConfigs[0].dateField]);
        }
        // await the 1.1s (.6s delay + .5s transform) transition,
        // to calculate timeout values in reverse order
      }, 1100 + ((this.chartConfigs[0].data.length - index) * 500));
    });
  };

  mousemove = (): void => {

    const trackingElem = d3.select(`#${this.hoverEffectsId}`);
    let selectedData;
    const dataSegments = this.chartConfigs[0].data.length;
    const segmentWidth = Math.round(this.chartDimensions.width / dataSegments);
    const colWidth = Math.round((this.chartDimensions.width + segmentWidth) / dataSegments);
    const mousePos = mouse(trackingElem.node())[0];
    let closestXIndex =
      Math.floor(((this.chartDimensions.width + segmentWidth) - mousePos) / colWidth);

    // ensure the index value stays within range of available data
    closestXIndex = closestXIndex < 0 ? 0 : closestXIndex;
    closestXIndex = closestXIndex >= this.chartConfigs[0].data.length ?
      this.chartConfigs[0].data.length - 1 : closestXIndex;

    this.chartConfigs.forEach((config) => {

      selectedData = config.data[closestXIndex];

      if (selectedData && selectedData[config.fields[0]]) {
        this.placeMarker(config, closestXIndex);

        // This brings the overlay element to the front so hovering over the markers doesn't prevent
        // hover effects from working. Instead of raising the hover effects <rect> in the DOM (which
        // triggers `mouseout` on Firefox) we can lower the graph.
        d3.selectAll(`.${this.chartId}-surface`).lower();

      } else {
        this.mouseout();
      }
    });
    this.connectMarkers(closestXIndex);
    if (selectedData) {
      this.hoverFunction(selectedData[this.chartConfigs[0].dateField]);
    }
  }

  placeMarginLabels = (config: ChartConfig): void => {
    const elemClass = `.${this.chartId}-surface`;
    if (config.zeroMarginLabelLeft) {
      d3.select(elemClass)
        .append('text')
        .text('0')
        .classed('multichart-margin-label', true)
        .attr('font-weight', config.options.marginLabelOptions.fontWeight || 600)
        .attr('text-anchor', 'end')
        .attr('fill', config.options.marginLabelOptions.fontColor || '#666666')
        .attr('dy', 14)
        .attr('transform',
          `translate(${config
            .scales.x(parseTime(config.data[config.data.length - 1][config.dateField])) - 12},
      ${config.scales.y(0) - 7})`)
    }
    if (config.marginLabelLeft) {
      d3.select(elemClass)
        .append('text')
        .text(config.marginLabelFormatter(config.data[config.data.length - 1][config.fields[0]]))
        .classed('multichart-margin-label', true)
        .attr('font-weight', config.options.marginLabelOptions.fontWeight || 600)
        .attr('text-anchor', 'end')
        .attr('fill', config.options.marginLabelOptions.fontColor || '#666666')
        .attr('dy', 14)
        .attr('transform', `translate(${config
          .scales.x(parseTime(config.data[config.data.length - 1][config.dateField])) - 12},
      ${config.scales.y(Number(config.data[config.data.length - 1][config.fields[0]])) - 9})`)
    }
    if (config.marginLabelRight) {
      d3.select(elemClass)
        .append('text')
        .text(config.marginLabelFormatter(config.data[0][config.fields[0]]))
        .classed('multichart-margin-label', true)
        .attr('font-weight', config.options.marginLabelOptions.fontWeight || 600)
        .attr('fill', config.options.marginLabelOptions.fontColor || '#666666')
        .attr('dy', 14)
        .attr('transform', `translate(${config
          .scales.x(parseTime(config.data[0][config.dateField])) + 13},
      ${config.scales.y(Number(config.data[0][config.fields[0]])) - 9})`)
    }
  }

  placeMarker = (config: ChartConfig, dataIndex: number): void => {
    this.clearMarkers(config.name);

    const elemClass = `.${this.chartId}-surface`;

      d3.select(elemClass)
        .append('circle')
        .classed(`${config.name}-marker`, true)
        .attr('data-testid', `${config.name}-marker`)
        .attr('r', 8)
        .attr('fill', 'rgba(216,216,216,0.5)')
        .attr('transform', `translate(${config
          .scales.x(parseTime(config.data[dataIndex][config.dateField]))},
      ${config.scales.y(Number(config.data[dataIndex][config.fields[0]]))})`)

      d3.select(elemClass)
        .append('circle')
        .classed(`${config.name}-marker`, true)
        .attr('r', 4)
        .attr('fill', '#000')
        .attr('transform', `translate(${config
          .scales.x(parseTime(config.data[dataIndex][config.dateField]))},
      ${config.scales.y(Number(config.data[dataIndex][config.fields[0]]))})`)

  };

  connectMarkers = (dataIndex: number): void => {
    if (this.chartConfigs[0].data && this.chartConfigs[1].data) {
      const elemClass = `.${this.chartId}-surface`;

      // using 2 y values, but the same x value to ensure where rounding/etc. may occur,
      // the connecting line is always truly vertical
      const xPos = this.chartConfigs[0]
        .scales.x(parseTime(this.chartConfigs[0].data[dataIndex][this.chartConfigs[0].dateField]));
      const y1 = this.chartConfigs[0]
        .scales.y(Number(this.chartConfigs[0].data[dataIndex][this.chartConfigs[0].fields[0]]));
      const y2 = this.chartConfigs[1]
        .scales.y(Number(this.chartConfigs[1].data[dataIndex][this.chartConfigs[1].fields[0]]));

      d3.select(elemClass)
        .append('svg:line')
        .classed('marker-connector', true)
        .attr('x1', xPos)
        .attr('y1', y1)
        .attr('x2', xPos)
        .attr('y2', y2)
        .style('stroke-dasharray', ('2, 4'))
        .style('stroke-width', 2)
        .style('stroke', '#555555');
    }
  };

  clearMarkers = (configName: string): void => {
    this.container.selectAll(`.${configName}-marker`)
      .remove();
    this.container.selectAll('.marker-connector')
      .remove();
  }
}

