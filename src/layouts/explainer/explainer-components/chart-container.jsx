import {
  chartContainer,
  container,
  footerContainer,
  titleBreakdown
} from "./chart-container.module.scss";
import {chartBackdrop} from "../explainer.module.scss";
import React from "react";


const ChartContainer = ({title, altText, footer, children}) => {
  return(
    <div className={`${container} ${chartBackdrop}`}
         role={"img"}
         aria-label={altText}
    >
      <p className={titleBreakdown}>{title}</p>
      <div
        data-testid="chart"
        className={chartContainer}
      >
        {children}
      </div>
      <div className={footerContainer}>{footer}</div>
    </div>
  )
};

export default ChartContainer;
