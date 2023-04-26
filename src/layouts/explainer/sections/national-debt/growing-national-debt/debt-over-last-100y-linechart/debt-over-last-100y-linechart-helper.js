import React from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import * as styles from './debt-over-last-100y-linechart.module.scss';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  semiBoldWeight,
} from '../../../../../../variables.module.scss';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import numeral from "numeral";
import Analytics from '../../../../../../utils/analytics/analytics';

const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: "Explainers",
    action: action,
    label: `Debt - ${section}`,
  });
};

const hdoLink = (
  <CustomLink
    url={'/datasets/historical-debt-outstanding/'}
    onClick={() =>
      analyticsClickHandler(
        "Citation Click",
        "U.S. Federal Debt Trends Over the Last 100 Years"
      )
    }
  >
    Historical Debt Outstanding
  </CustomLink>
);

const bls = (
  <CustomLink
    url={'https://www.bls.gov/developers/'}
    onClick={() =>
      analyticsClickHandler(
        "Citation Click",
        "U.S. Federal Debt Trends Over the Last 100 Years"
      )
    }
  >
    Bureau of Labor Statistics
  </CustomLink>
);

const footer = (
  <p>
    Visit the {hdoLink} dataset
    to explore and download this data. The inflation data is
    sourced from the {bls}.
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
    <div className={styles.headerContainer}>
      <div>
        <div className={styles.header}>{fiscalYear}</div>
        <span className={styles.subHeader}>Fiscal Year</span>
      </div>
      <div>
        <div className={styles.header}>{totalDebt}</div>
        <span className={styles.subHeader}>Total Debt</span>
      </div>
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
    format: (value) => {
      const newValue = numeral(value).format('0 a').toUpperCase();
      return `$${newValue}`
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
    tickValues: ['1922', '1942', '1962', '1982', '2002', '2022'],
  },
};

export const getMarkers = (width) => {
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
  return [
    {
      ...markerStyle,
    },
  ];
};

