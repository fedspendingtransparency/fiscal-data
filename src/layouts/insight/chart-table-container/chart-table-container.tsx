import React from 'react';
import {
  chart,
  chartTitleHeaderContainer,
  chartContainer,
  headerContainer,
  footerContainer,
  chartTitle,
  downloaderContainer,
} from './chart-table-container.module.scss';

export const ChartTableContainer = ({
  tableView,
  title,
  altText,
  header,
  footer,
  downloader,
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
