import {
  chart,
  chartContainer,
  headerContainer,
  footerContainer,
  chartTitle,
} from "./chart-container.module.scss"
import React from "react"
import { format } from "date-fns"

const ChartContainer = ({
  title,
  altText,
  header,
  footer,
  date,
  children,
  customContainerStyles,
  customHeaderStyles,
  customSpacing,
  customFooterSpacing,
}) => {
  return (
    <div
      className={`${chartContainer}`}
      role={"img"}
      aria-label={altText}
      style={{ ...customSpacing }}
    >
      <div className={chartTitle}>{title}</div>
      <div className={headerContainer} style={{ ...customHeaderStyles }}>
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
