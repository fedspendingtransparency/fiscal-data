import React from "react";
import CustomLink from "../../../../../../../components/links/custom-link/custom-link";
import * as styles from "./total-revenue-chart.module.scss";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  semiBoldWeight
} from "../../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../../helpers/styles-helper/styles-helper";
import {formatCurrency} from "../../../../../explainer-helpers/explainer-charting-helper";

const mts =
  <CustomLink url={`/datasets/monthly-treasury-statement/receipts-of-the-u-s-government`}>
    Monthly Treasury Statement (MTS)
  </CustomLink>;

const bls =
  <CustomLink url={'https://www.bls.gov/'}>
    Bureau of Labor Statistics
  </CustomLink>;

const footer =
  <p>
    Visit the {mts} dataset to further explore and download
    this data. The inflation data is sourced from the {bls}.
  </p>;

export const getChartCopy = (minYear, maxYear) => {
  return {
    title: `Federal Revenue and the U.S. Economy (GDP), FY ${minYear} – ${maxYear}`,
    subtitle: `Inflation Adjusted - ${maxYear} Dollars`,
    footer: footer,
    altText: 'Line graph comparing the total federal revenue to the total GDP dollar amount.'
  }
}

export const dataHeader = (headingValues) => (

  


  <div className={styles.headerContainer}>
    <div className={styles.toggle}>
      Toggle Placeholder
    </div>
    <div className={styles.headerData}>
      <div className={styles.dataElement}>
        <div className={styles.dataValue}>{headingValues.fiscalYear}</div>
        <span className={styles.dataLabel}>Fiscal Year</span>
      </div>
      <div className={styles.dataElement}>
        <div className={styles.dataValue}>${headingValues.totalRevenue}</div>
        <span className={styles.dataLabel}>Total Revenue</span>
      </div>
      <div className={styles.dataElement}>
        <div className={styles.dataValue}>${headingValues.gdp}</div>
        <span className={styles.dataLabel}>GDP</span>
      </div>
    </div>
  </div>
)

const chartTheme = {
  textColor: '#666666',
  axis: {
    domain: {
      line: {
        strokeWidth: 1,
        stroke: '#666666'
      }
    }
  },
  crosshair: {
    line: {
      stroke: '#555555',
      strokeWidth: 2,
      strokeDasharray: '2,2'
    }
  },
  marker: {
    fill: '#666666'
  }
};

const layers = [
  'grid',
  'axes',
  'lines',
  'crosshair',
  'markers',
  'points',
  'mesh',
]

export const chartConfigs = {
  theme: chartTheme,
  layers: layers,
  axisLeft: {
    format: formatCurrency,
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
}

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
          value: gdpValue-1.5,
        },
        {
          ...markerStyle,
          legend: "Total Revenue",
          value: spendingValue-1.5,
        },
      ];
};

