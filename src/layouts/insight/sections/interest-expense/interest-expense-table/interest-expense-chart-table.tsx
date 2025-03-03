import React, { useState } from 'react';
import { InterestExpenseChart } from '../interest-expense-chart/interest-expense-chart';
import { interestExpenseTableChartContainer } from './interest-expense-table-chart.module.scss';
import InterestExpenseChartHeader from './interest-expense-chart-header/interest-expense-chart-header';
import { format } from 'date-fns';
import {
  chart,
  chartTitleHeaderContainer,
  chartContainer,
  headerContainer,
  footerContainer,
  chartSubTitle,
  chartTitle,
  downloaderContainer,
} from './interest-expense-chart-container.module.scss';

export const InterestExpenseChartTable = ({
  tableView,
  title,
  subTitle = null,
  altText,
  header,
  footer,
  downloader,
  date,
  children,
  customContainerStyles = {},
  customHeaderStyles = {},
  customSpacing = {},
  customFooterStyles = {},
  customTitleStyles = {},
  customTestId = null,
}) => {
  return (
    <div className={chartContainer} role="figure" aria-label={altText} style={{ ...customSpacing }}>
      <div className={chartTitleHeaderContainer}>
        <div className={chartTitle} style={{ ...customTitleStyles }}>
          {title}
        </div>
        <div className={`${headerContainer} `} style={{ ...customHeaderStyles }}>
          {header}
        </div>
      </div>
      <div style={{ borderBottom: tableView ? '1px solid #d9d9d9' : '' }} />
      <div data-testid={customTestId ? customTestId : 'chart'} className={`${chart} chartContainerChart`} style={{ ...customContainerStyles }}>
        {children}
      </div>
      <div className={`${downloaderContainer} chartContainerFooter`} style={{ ...customFooterStyles }}>
        {downloader}
      </div>
      <div className={`${footerContainer} chartContainerFooter`} style={{ ...customFooterStyles }}>
        {footer}
      </div>
    </div>
  );
};
