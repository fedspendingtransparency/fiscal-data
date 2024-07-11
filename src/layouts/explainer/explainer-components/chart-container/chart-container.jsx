import { chart, chartContainer, headerContainer, footerContainer, chartSubTitle, chartTitle } from './chart-container.module.scss';
import React from 'react';
import { format } from 'date-fns';

const ChartContainer = ({ title, subTitle = null, altText, header, footer, date, children, customHeaderStyles = {}, customTestId = null }) => {
  return (
    <div className={chartContainer} role="figure" aria-label={altText}>
      <div className={chartTitle}>{title}</div>
      <div className={`${chartSubTitle} chartContainerSubTitle`}>{subTitle}</div>
      <div className={`${headerContainer} chartContainerHeader`} style={{ ...customHeaderStyles }}>
        {header}
      </div>
      <div data-testid={customTestId ? customTestId : 'chart'} className={`${chart} chartContainerChart`}>
        {children}
      </div>
      <div className={`${footerContainer} chartContainerFooter`}>
        {footer}
        Last Updated: {format(date, 'MMMM d, yyyy')}
      </div>
    </div>
  );
};

export default ChartContainer;
