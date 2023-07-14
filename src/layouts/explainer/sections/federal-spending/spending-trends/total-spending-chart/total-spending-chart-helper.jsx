import React from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import * as styles from './total-spending-chart.module.scss';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  semiBoldWeight,
} from '../../../../../../variables.module.scss';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';

const mts = <CustomLink url="/datasets/monthly-treasury-statement/receipts-of-the-u-s-government/"
                        eventNumber="21"
                        id="Monthly Treasury Statement"
            >
              Monthly Treasury Statement (MTS)
            </CustomLink>;
const bea = <CustomLink url={'https://www.bea.gov/'} eventNumber="34">
              Bureau of Economic Analysis
            </CustomLink>;

const bls = <CustomLink url={'https://www.bls.gov/developers/'}>  Bureau of Labor Statistics</CustomLink>

const footer = (
  <p>
    Visit the {mts} dataset to explore and download
    this data.
    The GDP data is sourced from the {bea}.
    The inflation data is sourced from the {bls}.
  </p>
);

export const getChartCopy = (minYear, maxYear, selectedChartView) => {
  return {
  title: `Government Spending and the U.S. Economy (GDP), FY ${minYear} – ${maxYear}`,
  subtitle: `Inflation Adjusted - ${maxYear} Dollars`,
  footer: footer,
  altText: (selectedChartView === "percentageGdp" ? 'A line graph showing the percentage of GDP.' :
    'Line graph comparing the total federal spending to the total GDP dollar amount.'),
  }
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

export const dataHeader = (chartToggleConfig, headingValues, gaEvent, setStartAnimation) => {
  if (!chartToggleConfig) return;
  const {
    setSelectedChartView,
    selectedChartView,
    isMobile,
  } = chartToggleConfig;

  const {fiscalYear, totalSpending, gdp, gdpRatio} = headingValues;

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
          marginBottom: isMobile ? "0.75rem" : "1rem",
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
            gaEvent('19');
            setStartAnimation(true);
          }}
          id={'total-spending-toggle'}
        >
          <span
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color:
                selectedChartView === 'percentageGdp' ? 'inherit' : '#FFFFFF',
              fontWeight: 600,
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
            gaEvent('19')
            setStartAnimation(true);
          }}
          id={'total-spending-toggle'}
        >
          <span
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color:
                selectedChartView === 'percentageGdp' ? '#FFFFFF' : 'inherit',
              fontWeight: 600,
            }}
          >
            Percentage of GDP
          </span>
        </button>
      </div>{' '}
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

const formatCurrency = v => {
  if (parseFloat(v) < 0) {
    return `$${Math.abs(v)} T`;
  } else if (parseFloat(v) > 0) {
    return `$${v} T`;
  } else {
    return `$${v}`;
  }
};

const formatPercent = v => {
  return `${v}%`;
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
  axisLeftSpending: {
    format: formatCurrency,
    orient: "left",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisLeftPercent: {
    format: formatPercent,
    orient: "left",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisBottom: {
    orient: "bottom",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 7,
  },
};

export const getMarkers = (width, selectedChartView, gdpValue, spendingValue) => {
  const markerStyle = {
    axis: "y",
    background: "#666666",
    lineStyle: { strokeWidth: 0 },
    textStyle: {
      fontWeight: semiBoldWeight,
      fill: "#666666",
      fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    },
  };
  return selectedChartView === "percentageGdp"
    ? []
    : [
        {
          ...markerStyle,
          legend: "GDP",
          value: gdpValue-3,
        },
        {
          ...markerStyle,
          legend: "Total Spending",
          value: spendingValue-3,
        },
      ];
};

export const Point = ({ borderWidth, borderColor, point }) => {
  return (
    <>
      <circle
        r={8}
        strokeWidth={borderWidth}
        stroke={borderColor}
        fill="#D8D8D8"
        fillOpacity={0.35}
        cx={point?.x}
        cy={point?.y}
      />
      <circle
        r={2}
        strokeWidth="4"
        stroke="#000000"
        fill="#000000"
        fillOpacity={0.85}
        cx={point?.x}
        cy={point?.y}
      />
    </>
  )
}

export const lineChartCustomPoints = ({ currentSlice, borderWidth, borderColor, points }) => {
  const getLastValue = (values, name) =>
    values.filter(g => g.serieId === name).sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true})).pop();

  const lastSpendingPoints = getLastValue(points, 'Total Spending');

  const lastRevenuePoints = getLastValue(points, 'Total Revenue');

  const lastGdpPoints = getLastValue(points,'GDP');

  const lastGDPPercentagePoints = getLastValue(points,'GDP Percentage');

  const defaultPrimaryPoint = lastSpendingPoints ? lastSpendingPoints
                              : (lastRevenuePoints ? lastRevenuePoints : lastGDPPercentagePoints);

  const currentPrimaryPoint = currentSlice?.points?.length
    ? currentSlice.points[0]
    : defaultPrimaryPoint;

  const currentGdpPoint = currentSlice?.points?.length
    ? currentSlice.points[1]
    : lastGdpPoints;

  return (
    <g data-testid="customPoints">
      {currentPrimaryPoint && (
        <Point borderColor={borderColor} borderWidth={borderWidth} point={currentPrimaryPoint} />
      )}
      {currentGdpPoint && (
        <Point borderColor={borderColor} borderWidth={borderWidth} point={currentGdpPoint} />
      )}
    </g>
  );
};
