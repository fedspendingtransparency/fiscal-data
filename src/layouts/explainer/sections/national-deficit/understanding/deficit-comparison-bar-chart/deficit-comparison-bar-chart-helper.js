import {
  fontBodyCopy,
} from "../../../../../../variables.module.scss";
import {deficitExplainerSecondary} from "../../national-deficit.module.scss";


export const desktopHeight = 288;
export const mobileHeight = 208;
export const layers = ['axes', 'grid', 'markers', 'bars'];
export const theme = {
  markers: {
    lineStrokeWidth: 0
  },
  grid: {
    line: {
      stroke: fontBodyCopy,
      strokeWidth: 1
    }
  },
};

const spendingBarColor = '#00766c';
const revenueBarColor = '#0a2f5a';
const deficitBarColor = deficitExplainerSecondary;
export const barChartColors = [revenueBarColor, deficitBarColor, spendingBarColor];


