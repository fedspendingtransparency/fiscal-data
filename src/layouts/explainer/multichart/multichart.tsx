import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import { MultichartRenderer } from "../../../components/charts/chart-primary/multichart-renderer"

type ChartOptions = {
  forceHeight: number,
  maxHeightToWidthRatio?: number,
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
  hoverEffectHandler: (recordDate: string | null) => void
}

const Multichart: FunctionComponent<MultichartProperties> =
  ({ chartConfigs, chartId, hoverEffectHandler }: MultichartProperties) => {

    const [chartRenderer, setChartRenderer] = useState(null);
    const [animateChart, setAnimateChart] = useState(false);

    const itemRef = useRef();
  // you can access the elements with itemsRef.current[n]

  const handleMouseEnter = (event) => {

    if (event.target['id'] === chartId && chartRenderer) {
      chartRenderer.addHoverEffects(hoverEffectHandler);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      chartRenderer.removeHoverEffects();
    }, 500)
  };

  useEffect(() => {
    if (animateChart) {
      chartRenderer.animateChart(hoverEffectHandler);
    }
  }, [animateChart]);

  useEffect(() => {
    if (chartRenderer && chartRenderer.rendered) {
      chartRenderer.generateChart();
    }
  }, [window.innerWidth]);

  useEffect(() => {
    setChartRenderer(new MultichartRenderer(chartConfigs, itemRef.current, chartId));
    let observer;

    if(typeof window !== "undefined") {
      const config = {
        rootMargin: '-50% 0% -50% 0%',
        threshold: 0
      };
      observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // animate data series display on chart upon initial scroll
            setAnimateChart(true);
          }
        });
      }, config);
      observer.observe(document.querySelector('[data-testid="multichart"]'));
    }
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
           role="presentation"
      />
    </>
  );
};

export default Multichart;
