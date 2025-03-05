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
import DirectDownload from '../../data-preview/data-preview-filter-section/data-preview-download-wrapper/download-button/direct-download/direct-download';

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
      <div className={tableView && tableBoarder} />
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
