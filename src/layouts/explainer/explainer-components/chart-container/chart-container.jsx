import {
  chart,
  chartContainer,
  footerContainer,
  chartTitle,
  headerContainer
} from "./chart-container.module.scss";
import React from "react";


const ChartContainer = ({title, altText, header, footer, children}) => {
  return(
    <div className={`${chartContainer}`}
         role={"img"}
         aria-label={altText}
    >
      <div className={chartTitle}>{title}</div>
      <div className={headerContainer}>
        {header}
      </div>
      <div
        data-testid="chart"
        className={chart}
      >
        {children}
      </div>
      <div className={footerContainer}>{footer}</div>
    </div>
  )
};

export default ChartContainer;
