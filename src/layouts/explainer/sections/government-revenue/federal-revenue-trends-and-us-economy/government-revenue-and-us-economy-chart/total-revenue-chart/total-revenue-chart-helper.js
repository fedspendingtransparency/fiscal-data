import React from 'react';
import CustomLink from '../../../../../../../components/links/custom-link/custom-link';
import * as styles from './total-revenue-chart.module.scss';
import { breakpointLg, fontSize_10, fontSize_14, semiBoldWeight } from '../../../../../../../variables.module.scss';
import { pxToNumber } from '../../../../../../../helpers/styles-helper/styles-helper';
import { formatCurrency, formatPercentage } from '../../../../../explainer-helpers/explainer-charting-helper';
import { revenueExplainerPrimary } from '../../../revenue.module.scss';
import Analytics from '../../../../../../../utils/analytics/analytics';
import ChartToggle from '../../../../../../../components/nivo/chart-toggle/chart-toggle';

const mts = (
  <CustomLink url="/datasets/monthly-treasury-statement/receipts-of-the-u-s-government" eventNumber="21" id="Monthly Treasury Statement">
    Monthly Treasury Statement (MTS)
  </CustomLink>
);

const bls = <CustomLink url={'https://www.bls.gov/developers/'}>Bureau of Labor Statistics</CustomLink>;

const bea = <CustomLink url={'https://www.bea.gov/'}>Bureau of Economic Analysis</CustomLink>;

const footer = (
  <p>
    {/* eslint-disable-next-line max-len */}
    Visit the {mts} dataset to further explore and download this data. The GDP data is sourced from the {bea}. The inflation data is sourced from the{' '}
    {bls}.
  </p>
);

export const getChartCopy = (minYear, maxYear, selectedChartView) => {
  return {
    title: `Federal Revenue and the U.S. Economy (GDP), FY ${minYear} – ${maxYear}`,
    subtitle: `Inflation Adjusted - ${maxYear} Dollars`,
    footer: footer,
    altText:
      selectedChartView === 'percentageGdp'
        ? 'Line graph showing revenue as a percentage of GDP.'
        : 'Line graph comparing the total federal revenue to the total GDP dollar amount.',
  };
};

export const dataHeader = (chartToggleConfig, headingValues) => {
  if (!chartToggleConfig) return;
  const { setSelectedChartView, selectedChartView } = chartToggleConfig;
  const { fiscalYear, totalRevenue, gdp, gdpRatio } = headingValues;

  const toggleButtonEvent = () => {
    return Analytics.event({
      category: 'Explainers',
      action: 'Chart Click',
      label: 'Revenue - Federal Revenue Trends and the U.S. Economy',
    });
  };

  const toggleClickHandler = selectedChartView => {
    setSelectedChartView(selectedChartView);
    toggleButtonEvent();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <ChartToggle
        primaryColor={revenueExplainerPrimary}
        toggleClickHandler={toggleClickHandler}
        leftButtonConfig={{
          leftTitle: 'Total Revenue',
          leftId: 'totalRevenue',
          leftSelected: selectedChartView === 'totalRevenue',
        }}
        rightButtonConfig={{
          rightTitle: 'Percentage of GDP',
          rightId: 'percentageGdp',
          rightSelected: selectedChartView === 'percentageGdp',
        }}
        chartId="revenue-chart-toggle"
      />
      <div className={styles.headerContainer}>
        <div className={styles.headerData}>
          <div className={styles.dataElement}>
            <div className={styles.dataValue}>{fiscalYear}</div>
            <span className={styles.dataLabel}>Fiscal Year</span>
          </div>
          {selectedChartView !== 'percentageGdp' && (
            <div className={styles.dataElement}>
              <div className={styles.dataValue}>${totalRevenue}</div>
              <span className={styles.dataLabel}>Total Revenue</span>
            </div>
          )}

          {selectedChartView !== 'percentageGdp' && (
            <div className={styles.dataElement}>
              <div className={styles.dataValue}>${gdp}</div>
              <span className={styles.dataLabel}>GDP</span>
            </div>
          )}

          {selectedChartView === 'percentageGdp' && (
            <div className={styles.dataElement}>
              <div className={styles.dataValue}>{gdpRatio}</div>
              <span className={styles.dataLabel}>GDP Ratio</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const layers = ['grid', 'axes', 'lines', 'crosshair', 'markers', 'points', 'mesh'];

export const chartConfigs = {
  layers: layers,
  axisLeftTotalRevenue: {
    format: formatCurrency,
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisLeftPercentageGDP: {
    format: formatPercentage,
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisBottom: {
    orient: 'bottom',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 7,
  },
};

export const getMarkers = (width, selectedChartView, gdpValue, revenueValue) => {
  const markerStyle = {
    axis: 'y',
    background: '#666666',
    lineStyle: { strokeWidth: 0 },
    textStyle: {
      fontWeight: semiBoldWeight,
      fill: '#666666',
      fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    },
  };
  return selectedChartView === 'percentageGdp'
    ? []
    : [
        {
          ...markerStyle,
          legend: 'GDP',
          value: gdpValue - 3,
        },
        {
          ...markerStyle,
          legend: 'Total Revenue',
          value: revenueValue - 3,
        },
      ];
};
