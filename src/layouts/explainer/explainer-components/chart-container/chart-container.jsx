import {
  chart,
  chartContainer,
  headerContainer,
  footerContainer,
  chartTitle,
  chartSubTitle,
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
  customSubTitleStyles
}) => {
  return (
    <div
      className={`${chartContainer}`}
      role={"img"}
      aria-label={altText}
      style={{ ...customSpacing }}
    >
      <div className={chartTitle} style={{ ...customTitleStyles }}>{title}</div>
      <div className={chartSubTitle} style={{ ...customSubTitleStyles }}>{subTitle}</div>
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
