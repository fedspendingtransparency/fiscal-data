import React, { FunctionComponent, useEffect, useRef, useState } from "react"
import { MultichartRenderer } from "../../../components/charts/chart-primary/multichart-renderer"
import { basicFetch } from "../../../utils/api-utils"

type ChartOptions = {
  forceHeight: number,
  forceYAxisWidth?: number,
  forceLabelFontSize: string,
  format: boolean,
  yAxisTickNumber: number,
  xAxisTickValues?: any[],
  showOuterXAxisTicks: boolean,
  placeInitialMarker: boolean,
  noTooltip: boolean,
  noShaders: boolean,
  noInnerXAxisTicks: boolean,
  inverted?: boolean
  shading?: {
    side: string,
    color: any,
    hatchDirection: string
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
  markers?: any
}

export type MultichartProperties = {
  chartConfigs: ChartConfig[],
  chartId: string
}

const Multichart: FunctionComponent<MultichartProperties> =
  ({ chartConfigs, chartId }: MultichartProperties) => {

  // const [data, setData] = useState([]);

  const itemRef = useRef();
  // you can access the elements with itemsRef.current[n]

/*  useEffect(() => {
    if (dataLoaded) {
      dataSetter(data);
    }
  }, [dataLoaded]);*/

  useEffect(() => {
    console.log('Multichart chartConfigs', chartConfigs);
    new MultichartRenderer(chartConfigs, itemRef.current, chartId);
  }, []);

  return (
    <>
      <div ref={itemRef}
           style={{
             height: 600,
             backgroundColor: '#f1f1f1'
           }}
      />
    </>
  );
};

export default Multichart;
