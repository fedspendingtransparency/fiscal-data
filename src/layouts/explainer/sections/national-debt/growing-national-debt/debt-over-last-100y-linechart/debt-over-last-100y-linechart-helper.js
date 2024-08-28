import React from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import { header, subHeader, headerContainer } from './debt-over-last-100y-linechart.module.scss';
import numeral from 'numeral';
import Analytics from '../../../../../../utils/analytics/analytics';

const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: 'Explainers',
    action: action,
    label: `Debt - ${section}`,
  });
};

const hdoLink = (
  <CustomLink
    url="/datasets/historical-debt-outstanding/"
    eventNumber="15"
    // onClick={() => analyticsClickHandler('Citation Click', 'U.S. Federal Debt Trends Over the Last 100 Years')}
    id="Historical Debt Outstanding"
  >
    Historical Debt Outstanding
  </CustomLink>
);

const bls = (
  <CustomLink
    url="https://www.bls.gov/developers/"
    onClick={() => analyticsClickHandler('Citation Click', 'U.S. Federal Debt Trends Over the Last 100 Years')}
  >
    Bureau of Labor Statistics
  </CustomLink>
);

const footer = (
  <p>
    Visit the {hdoLink} dataset to explore and download this data. The inflation data is sourced from the {bls}.
  </p>
);

export const getChartCopy = (minYear, maxYear, selectedChartView) => {
  return {
    title: `U.S. National Debt Over the Last 100 Years`,
    subtitle: `Inflation Adjusted - ${maxYear} Dollars`,
    footer: footer,
    altText:
      'Line graph displaying the amount of debt in trillions from 1922 to 2022. The graph shows a steady trend with an ' +
      'increase beginning around 1940 continuing through today.',
  };
};

export const dataHeader = headingValues => {
  const { fiscalYear, totalDebt } = headingValues;
  return (
    <div className={headerContainer}>
      <div>
        <div className={header} data-testid="dynamic-year-header">
          {fiscalYear}
        </div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
      <div>
        <div className={header} data-testid="dynamic-value-header">
          {totalDebt}
        </div>
        <span className={subHeader}>Total Debt</span>
      </div>
    </div>
  );
};

export const chartConfigs = {
  axisLeft: {
    format: value => {
      const newValue = numeral(value)
        .format('0 a')
        .toUpperCase();
      return `$${newValue}`;
    },
    orient: 'left',
    tickSize: 10,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 7,
  },
  axisBottom: {
    orient: 'bottom',
    tickSize: 10,
    tickPadding: 5,
    tickRotation: 0,
  },
};
