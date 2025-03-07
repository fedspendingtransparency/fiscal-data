import React from 'react';
import {
  chart,
  chartTitleHeaderContainer,
  chartContainer,
  headerContainer,
  footerContainer,
  chartTitle,
  downloaderContainer,
  tableBoarder,
} from './chart-table-container.module.scss';

export const ChartTableContainer = ({ tableView, title, altText, header, footer, downloader, children, customTestId = null }) => {
  return (
    <div className={chartContainer} role="figure" aria-label={altText}>
      <div className={chartTitleHeaderContainer}>
        <div className={chartTitle}>{title}</div>
        <div className={`${headerContainer} `}>{header}</div>
      </div>
      <div className={tableView && tableBoarder} />
      <div data-testid={customTestId ? customTestId : 'chart'} className={`${chart} chartContainerChart`}>
        {children}
      </div>
      <div className={`${downloaderContainer} chartContainerFooter`}>{downloader}</div>
      <div className={`${footerContainer} chartContainerFooter`}>{footer}</div>
    </div>
  );
};
