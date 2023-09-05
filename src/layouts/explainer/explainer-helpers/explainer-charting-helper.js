import {pxToNumber} from "../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../variables.module.scss";


export const applyChartScaling = (parent, chartWidth, chartHeight) => {
  // this function rewrites some element attribs after render to ensure Chart scales with container
  // which doesn't seem to happen naturally when nivo has a flex container
  const svgChart = document.querySelector(`[data-testid= ${parent}] svg`);
  if (svgChart) {
    svgChart.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight}`);
    svgChart.setAttribute('height', '100%');
    svgChart.setAttribute('width', '100%');
  }
};

export const addInnerChartAriaLabel = ( parent ) => {
  const svgChart = document.querySelector(`[data-testid= ${parent}] svg`);
  if (svgChart) {
    svgChart.setAttribute('aria-label', 'Inner chart area');
  }
}

export const applyTextScaling = (parent, chartWidth, pageWidth, fontSize) => {
  const svgChart = document.querySelector(`[data-testid= ${parent}] svg`);
  if (svgChart) {
    if(pageWidth < pxToNumber(breakpointLg)) {
      const containerWidth = document.querySelector(`[data-testid= ${parent}]`).offsetWidth;
      const ratio = chartWidth / containerWidth;
      const textElements = document.querySelectorAll(`[data-testid= ${parent}] text`);
      [...textElements].forEach(text => {
        text.style.fontSize = `${parseFloat(fontSize) * ratio}rem`
      });
    }
  }
};

export const formatCurrency = v => {
  if (parseFloat(v) < 0) {
    return `$${Math.abs(v)} T`;
  }
  else if (parseFloat(v) > 0){
    return `$${v} T`;
  }
  else {
    return `$${v}`;
  }
};

export const formatPercentage = v => {
  return `${v}%`
}
