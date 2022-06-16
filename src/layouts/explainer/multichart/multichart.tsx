import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import { MultichartRenderer } from "../../../components/charts/chart-primary/multichart-renderer"

type ChartOptions = {
  forceHeight: number,
  forceYAxisWidth?: number,
  forceLabelFontSize: string,
  format: boolean,
  yAxisTickNumber?: number,
  xAxisTickValues?: any[],
  showOuterXAxisTicks: boolean,
  placeInitialMarker: boolean,
  noTooltip: boolean,
  noShaders: boolean,
  noInnerXAxisTicks: boolean,
  inverted?: boolean
  shading?: {
    side?: string,
    color?: any,
    hatchDirection?: string
  },
  marginLabelOptions?: {
    fontSize?: number | string,
    fontColor?: string,
    fontWeight?: number | string,
  }
}

export type ChartConfig = {
  name: string,
  dataSourceUrl: string,
  dateField: string,
  fields: string[],
  data?: any[],
  options: ChartOptions,
  chartDimensions?: any,
  scales?: any,
  segmentMinY?: number,
  segmentMaxY?: number,
  lines?: any,
  previousExtent?: any,
  markers?: any,
  marginLabelFormatter?: any;
  zeroMarginLabelLeft?: boolean,
  zeroMarginLabelRight?: boolean,
  marginLabelLeft?: boolean,
  marginLabelRight?: boolean
}

export type MultichartProperties = {
  chartConfigs: ChartConfig[],
  chartId: string,
  hoverEffectHandler: any
}

const Multichart: FunctionComponent<MultichartProperties> =
  ({ chartConfigs, chartId, hoverEffectHandler }: MultichartProperties) => {

  const [chartRenderer, setChartRenderer] = useState(null);

  const itemRef = useRef();
  // you can access the elements with itemsRef.current[n]

  const handleMouseEnter = (event) => {

    console.log('event.target[\'id\']', event.target['id']);
    if (event.target['id'] === chartId) {
      chartRenderer.addHoverEffects(hoverEffectHandler);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      chartRenderer.removeHoverEffects();
    }, 500)
  };

    useEffect(() => {
      if (chartRenderer && chartRenderer.rendered) {
        chartRenderer.generateChart();
      }
    }, [window.innerWidth]);

  useEffect(() => {
    setChartRenderer(new MultichartRenderer(chartConfigs, itemRef.current, chartId));
  }, []);

  return (
    <>
      <div ref={itemRef}
           id={chartId}
           style={{
             display: 'block',
             backgroundColor: '#f1f1f1'
           }}
           data-testid="multichart"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
      />
    </>
  );
};

export default Multichart;
