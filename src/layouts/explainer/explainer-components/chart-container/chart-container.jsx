import {
  chart,
  chartContainer,
  headerContainer,
  footerContainer,
  chartSubTitle,
  chartTitle,
} from "./chart-container.module.scss"
import React from "react"
import { format } from "date-fns"

const ChartContainer = ({
  title,
  subTitle,
  altText,
  header,
  footer,
  date,
  children,
  customContainerStyles,
  customHeaderStyles,
  customSpacing,
  customFooterSpacing,
  customTitleStyles,
  customSubTitleStyles,
  handleMouseLeave
}) => {
  return (
    <div
      className={`${chartContainer}`}
      role={"img"}
      aria-label={altText}
      style={{ ...customSpacing }}
      onMouseLeave={handleMouseLeave}
    >
      <div className={chartTitle} style={{ ...customTitleStyles}}>{title}</div>
      <div className={`${chartSubTitle} chartContainerSubTitle`} style={{ ...customSubTitleStyles}}>
        {subTitle}
      </div>
      <div className={`${headerContainer} chartContainerHeader`} style={{ ...customHeaderStyles }}>
        {header}
      </div>
      <div
        data-testid="chart"
        className={chart}
        style={{ ...customContainerStyles }}
      >
        {children}
      </div>
      <div className={footerContainer} style={{ ...customFooterSpacing }}>
        {footer}
        Last Updated: {format(date, "MMMM d, yyyy")}
      </div>
    </div>
  )
}

export default ChartContainer
