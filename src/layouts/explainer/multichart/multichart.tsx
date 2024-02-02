import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { MultichartRenderer } from '../../../components/charts/chart-primary/multichart-renderer';
import { useInView } from 'react-intersection-observer';

type ChartOptions = {
  forceHeight: number;
  maxHeightToWidthRatio?: number;
  forceYAxisWidth?: number;
  forceLabelFontSize: string;
  format: boolean;
  yAxisTickNumber?: number;
  xAxisTickValues?: number[];
  showOuterXAxisTicks: boolean;
  placeInitialMarker: boolean;
  noTooltip: boolean;
  noShaders: boolean;
  noInnerXAxisTicks: boolean;
  inverted?: boolean;
  shading?: {
    side?: string;
    color?: string;
    hatchDirection?: string;
  };
  marginLabelOptions?: {
    fontSize?: number | string;
    fontColor?: string;
    fontWeight?: number | string;
  };
};

export type ChartConfig = {
  name: string;
  dataSourceUrl: string;
  dateField: string;
  fields: string[];
  data?;
  options: ChartOptions;
  chartDimensions?;
  scales?;
  segmentMinY?: number;
  segmentMaxY?: number;
  lines?;
  previousExtent?;
  markers?;
  marginLabelFormatter?;
  zeroMarginLabelLeft?: boolean;
  zeroMarginLabelRight?: boolean;
  marginLabelLeft?: boolean;
  marginLabelRight?: boolean;
};

export type MultichartProperties = {
  chartConfigs: ChartConfig[];
  chartId: string;
  hoverEffectHandler: (recordDate: string | null) => void;
};

const Multichart: FunctionComponent<MultichartProperties> = ({ chartConfigs, chartId, hoverEffectHandler }: MultichartProperties) => {
  const [chartRenderer, setChartRenderer] = useState(null);
  const [animateChart, setAnimateChart] = useState(false);

  const itemRef = useRef();
  // you can access the elements with itemsRef.current[n]

  const handleMouseEnter = event => {
    if (event.target['id'] === chartId && chartRenderer) {
      chartRenderer.addHoverEffects(hoverEffectHandler);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      chartRenderer.removeHoverEffects();
    }, 500);
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

  const { ref: animationRef, inView } = useInView({
    threshold: 0,
    rootMargin: '-50% 0% -50% 0%',
    triggerOnce: true,
  });

  useEffect(() => {
    setChartRenderer(new MultichartRenderer(chartConfigs, itemRef.current, chartId));

    if (inView) {
      // animate data series display on chart upon initial scroll
      setAnimateChart(true);
    }
  }, [inView]);

  return (
    <>
      <div ref={animationRef}>
        <div
          ref={itemRef}
          id={chartId}
          style={{
            display: 'block',
            backgroundColor: '#f1f1f1',
          }}
          data-testid="multichart"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="presentation"
        />
      </div>
    </>
  );
};

export default Multichart;
