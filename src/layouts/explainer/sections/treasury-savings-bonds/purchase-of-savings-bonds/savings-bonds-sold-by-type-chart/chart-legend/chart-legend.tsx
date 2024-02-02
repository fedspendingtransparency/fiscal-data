import React, { FunctionComponent } from 'react';

interface IChartLegend {
  lines: string[];
  [colorMap: string]: string;
  handleClick: (val: string) => void;
}

const ChartLegend: FunctionComponent<IChartLegend> = ({ lines, colorMap, handleClick }) => {
  return <>chart legend</>;
};

export default ChartLegend;
