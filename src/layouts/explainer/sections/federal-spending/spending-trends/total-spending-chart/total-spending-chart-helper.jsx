import React from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import * as styles from './total-spending-chart.module.scss';
import { breakpointLg, fontSize_10, fontSize_14, semiBoldWeight } from '../../../../../../variables.module.scss';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import ChartToggle from '../../../../../../components/nivo/chart-toggle/chart-toggle';
import { spendingExplainerPrimary } from '../spending-trends.module.scss';
import { formatCurrency, formatPercentage } from '../../../../explainer-helpers/explainer-charting-helper';

const mts = (
  <CustomLink url="/datasets/monthly-treasury-statement/receipts-of-the-u-s-government/" eventNumber="21" id="Monthly Treasury Statement">
    Monthly Treasury Statement (MTS)
  </CustomLink>
);
const bea = (
  <CustomLink url="https://www.bea.gov/" eventNumber="34">
    Bureau of Economic Analysis
  </CustomLink>
);

const bls = <CustomLink url="https://www.bls.gov/developers/">Bureau of Labor Statistics</CustomLink>;

const footer = (
  <p>
    Visit the {mts} dataset to explore and download this data. The GDP data is sourced from the {bea}. The inflation data is sourced from the {bls}.
  </p>
);

export const getChartCopy = (minYear, maxYear, selectedChartView) => {
  return {
    title: `Government Spending and the U.S. Economy (GDP), FY ${minYear} – ${maxYear}`,
    subtitle: `Inflation Adjusted - ${maxYear} Dollars`,
    footer: footer,
    altText:
      selectedChartView === 'percentageGdp'
        ? 'A line graph showing the percentage of GDP.'
        : 'Line graph comparing the total federal spending to the total GDP dollar amount.',
  };
};

const getFirstElPadding = (chartView, isMobile) => {
  if (chartView === 'percentageGdp') {
    return '112px';
  }
  if (chartView === 'totalSpending') {
    if (isMobile) {
      return '52px';
    }
  }
  return '32px';
};

export const dataHeader = (chartToggleConfig, headingValues, gaEvent) => {
  if (!chartToggleConfig) return;
  const { setSelectedChartView, selectedChartView, isMobile } = chartToggleConfig;

  const { fiscalYear, totalSpending, gdp, gdpRatio } = headingValues;

  const toggleClickHandler = selectedChartView => {
    setSelectedChartView(selectedChartView);
    gaEvent('19');
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
        primaryColor={spendingExplainerPrimary}
        toggleClickHandler={toggleClickHandler}
        leftButtonConfig={{
          leftTitle: 'Total Spending',
          leftId: 'totalSpending',
          leftSelected: selectedChartView === 'totalSpending',
        }}
        rightButtonConfig={{
          rightTitle: 'Percentage of GDP',
          rightId: 'percentageGdp',
          rightSelected: selectedChartView === 'percentageGdp',
        }}
        chartId="spending-chart-toggle"
      />
      <div className={styles.headerContainer}>
        <div className={styles.headerData}>
          <div
            className={styles.dataElement}
            style={{
              paddingLeft: getFirstElPadding(selectedChartView, isMobile),
            }}
          >
            <div className={styles.dataValue}>{fiscalYear}</div>
            <span className={styles.dataLabel}>Fiscal Year</span>
          </div>

          {selectedChartView !== 'percentageGdp' && (
            <div className={styles.dataElement}>
              <div className={styles.dataValue}>${totalSpending}</div>
              <span className={styles.dataLabel}>Total Spending</span>
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

const layers = ['grid', 'crosshair', 'markers', 'axes', 'areas', 'lines', 'points'];

export const chartConfigs = {
  layers: layers,
  axisLeftSpending: {
    format: formatCurrency,
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisLeftPercent: {
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

export const getMarkers = (width, selectedChartView, gdpValue, spendingValue) => {
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
          legend: 'Total Spending',
          value: spendingValue - 3,
        },
      ];
};

export const Point = ({ borderWidth, borderColor, point }) => {
  return (
    <>
      <circle r={8} strokeWidth={borderWidth} stroke={borderColor} fill="#D8D8D8" fillOpacity={0.35} cx={point?.x} cy={point?.y} />
      <circle r={2} strokeWidth="4" stroke="#000000" fill="#000000" fillOpacity={0.85} cx={point?.x} cy={point?.y} />
    </>
  );
};

export const lineChartCustomPoints = ({ currentSlice, borderWidth, borderColor, points }) => {
  const getLastValue = (values, name) =>
    values
      .filter(g => g.serieId === name)
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
      .pop();

  const lastSpendingPoints = getLastValue(points, 'Total Spending');

  const lastRevenuePoints = getLastValue(points, 'Total Revenue');

  const lastGdpPoints = getLastValue(points, 'GDP');

  const lastGDPPercentagePoints = getLastValue(points, 'GDP Percentage');

  const defaultPrimaryPoint = lastSpendingPoints ? lastSpendingPoints : lastRevenuePoints ? lastRevenuePoints : lastGDPPercentagePoints;

  const currentPrimaryPoint = currentSlice?.points?.length ? currentSlice.points[0] : defaultPrimaryPoint;

  const currentGdpPoint = currentSlice?.points?.length ? currentSlice.points[1] : lastGdpPoints;

  return (
    <>
      <g data-testid="customPoints">
        {currentPrimaryPoint && <Point borderColor={borderColor} borderWidth={borderWidth} point={currentPrimaryPoint} />}
        {currentGdpPoint && <Point borderColor={borderColor} borderWidth={borderWidth} point={currentGdpPoint} />}
      </g>
    </>
  );
};
