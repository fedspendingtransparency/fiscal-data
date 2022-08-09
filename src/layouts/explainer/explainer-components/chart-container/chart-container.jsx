import {
  chart,
  chartContainer,
  headerContainer,
  footerContainer,
  chartTitle
} from "./chart-container.module.scss";
import React from "react";
import {format} from "date-fns";


const ChartContainer = ({title, altText, header, footer, date, children}) => {
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
      <div className={footerContainer}>
        {footer}
        Last Updated: {format(date, 'MMMM d, yyyy')}
      </div>
    </div>
  )
};

export default ChartContainer;
