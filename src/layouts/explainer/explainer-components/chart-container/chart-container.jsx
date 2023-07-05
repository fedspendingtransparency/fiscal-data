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
  customFooterStyles,
  customTitleStyles,
  customSubTitleStyles,
  customTestId
}) => {
  return (
    <div
      className={`${chartContainer}`}
      role={"figure"}
      aria-label={altText}
      style={{ ...customSpacing }}
    >
      <div className={chartTitle} style={{ ...customTitleStyles}}>{title}</div>
      <div className={`${chartSubTitle} chartContainerSubTitle`} style={{ ...customSubTitleStyles}}>
        {subTitle}
      </div>
      <div className={`${headerContainer} chartContainerHeader`} style={{ ...customHeaderStyles }}>
        {header}
      </div>
      <div
        data-testid={customTestId ? customTestId : 'chart'}
        className={`${chart} chartContainerChart`}
        style={{ ...customContainerStyles }}
      >
        {children}
      </div>
      <div className={`${footerContainer} chartContainerFooter`} style={{ ...customFooterStyles }}>
        {footer}
        Last Updated: {format(date, "MMMM d, yyyy")}
      </div>
    </div>
  )
}

export default ChartContainer
