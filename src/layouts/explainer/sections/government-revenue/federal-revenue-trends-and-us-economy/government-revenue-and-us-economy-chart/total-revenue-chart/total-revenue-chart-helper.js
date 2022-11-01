import React from 'react';
import CustomLink from '../../../../../../../components/links/custom-link/custom-link';
import * as styles from './total-revenue-chart.module.scss';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  semiBoldWeight,
} from '../../../../../../../variables.module.scss';
import { pxToNumber } from '../../../../../../../helpers/styles-helper/styles-helper';
import { formatCurrency } from '../../../../../explainer-helpers/explainer-charting-helper';

const mts = (
  <CustomLink
    url={`/datasets/monthly-treasury-statement/receipts-of-the-u-s-government`}
  >
    Monthly Treasury Statement (MTS)
  </CustomLink>
);

const bls = (
  <CustomLink url={'https://www.bls.gov/'}>
    Bureau of Labor Statistics
  </CustomLink>
);

const footer = (
  <p>
    Visit the {mts} dataset to further explore and download this data. The
    inflation data is sourced from the {bls}.
  </p>
);

export const chartCopy = {
  title: 'Federal Revenue and the U.S. Economy (GDP), FY 2015 – 2021',
  subtitle: 'Inflation Adjusted - 2021 Dollars',
  footer: footer,
  altText:
    'Line graph comparing the total federal revenue to the total GDP dollar amount.',
};

export const dataHeader = chartToggleConfig => {
  console.log(chartToggleConfig, 'chartToggleConfig');
  if (!chartToggleConfig) return;
  const {
    setSelectedChartView,
    selectedChartView,
    isMobile,
  } = chartToggleConfig;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        className={styles.chartToggle}
        style={{
          marginBottom: isMobile ? '0.75rem' : '1rem',
        }}
      >
        <button
          className={styles.toggleButton}
          style={{
            borderBottomLeftRadius: '4px',
            borderTopLeftRadius: '4px',
            color:
              selectedChartView === 'totalSpending' ? '#f1f1f1' : '#00766C',
            background:
              selectedChartView === 'totalSpending' ? '#00766C' : '#f1f1f1',
            borderRight: 'none',
            width: isMobile ? '144px' : '224px',
            height: isMobile ? '1.5rem' : '2rem',
          }}
          onClick={() => {
            setSelectedChartView('totalSpending');
          }}
        >
          <span
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color:
                selectedChartView === 'percentageGdp' ? 'inherit' : '#FFFFFF',
              fontWeight: '600',
            }}
          >
            Total Spending
          </span>
        </button>
        <button
          className={styles.toggleButton}
          style={{
            borderBottomRightRadius: '4px',
            borderTopRightRadius: '4px',
            color:
              selectedChartView === 'percentageGdp' ? '#f1f1f1' : '#00766C',
            background:
              selectedChartView === 'percentageGdp' ? '#00766C' : '#f1f1f1',
            width: isMobile ? '144px' : '224px',
            height: isMobile ? '1.5rem' : '2rem',
          }}
          onClick={() => {
            setSelectedChartView('percentageGdp');
          }}
        >
          <span
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color:
                selectedChartView === 'percentageGdp' ? '#FFFFFF' : 'inherit',
              fontWeight: '600',
            }}
          >
            Percentage of GDP
          </span>
        </button>
      </div>
      <div className={styles.headerContainer}>
        <div className={styles.headerData}>
          <div className={styles.dataElement}>
            <div className={styles.dataValue}>2020</div>
            <span className={styles.dataLabel}>Fiscal Year</span>
          </div>
          <div className={styles.dataElement}>
            <div className={styles.dataValue}>$7.6 T</div>
            <span className={styles.dataLabel}>Total Revenue</span>
          </div>
          <div className={styles.dataElement}>
            <div className={styles.dataValue}>$22.1 T</div>
            <span className={styles.dataLabel}>GDP</span>
          </div>
        </div>
      </div>{' '}
    </div>
  );
};

const chartTheme = {
  textColor: '#666666',
  axis: {
    domain: {
      line: {
        strokeWidth: 1,
        stroke: '#666666',
      },
    },
  },
  crosshair: {
    line: {
      stroke: '#555555',
      strokeWidth: 2,
      strokeDasharray: '2,2',
    },
  },
  marker: {
    fill: '#666666',
  },
};

const layers = [
  'grid',
  'axes',
  'lines',
  'crosshair',
  'markers',
  'points',
  'mesh',
];

export const chartConfigs = {
  theme: chartTheme,
  layers: layers,
  axisLeft: {
    format: formatCurrency,
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

export const getMarkers = width => {
  const markerStyle = {
    axis: 'y',
    lineStyle: { strokeWidth: 0 },
    textStyle: {
      fontWeight: semiBoldWeight,
      fill: '#666666',
      fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    },
  };

  return [
    {
      ...markerStyle,
      legend: 'GDP',
      value: '22.5',
    },
    {
      ...markerStyle,
      legend: 'Total Revenue',
      value: '8.5',
    },
  ];
};
