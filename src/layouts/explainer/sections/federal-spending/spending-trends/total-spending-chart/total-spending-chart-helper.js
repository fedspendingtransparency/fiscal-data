import React from "react";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import * as styles from "./total-spending-chart.module.scss";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  semiBoldWeight
} from "../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";

const name = 'MTS - Summary of Receipts and Outlays of the U.S. Government';
const slug = `/datasets/monthly-treasury-statement/receipts-of-the-u-s-government/`;
const footer =
  <p>
    Visit the <CustomLink url={slug}>{name}</CustomLink> to explore
    and download this data.
  </p>;

export const chartCopy = {
    title: 'Government Spending and the U.S. Economy (GDP), FY 2015 – 2021',
    subtitle: 'Inflation Adjusted - 2021 Dollars',
    footer: footer,
    altText: 'Line graph comparing the total federal spending to the total GDP dollar amount.'
}

export const dataHeader = () => (
  <div className={styles.headerContainer}>
    <div className={styles.toggle}>
      Toggle Placeholder
    </div>
    <div className={styles.headerData}>
      <div className={styles.dataElement}>
        <div className={styles.dataValue}>2020</div>
        <span className={styles.dataLabel}>Fiscal Year</span>
      </div>
      <div className={styles.dataElement}>
        <div className={styles.dataValue}>$7.6 T</div>
        <span className={styles.dataLabel}>Total Spending</span>
      </div>
      <div className={styles.dataElement}>
        <div className={styles.dataValue}>$22.1 T</div>
        <span className={styles.dataLabel}>GDP</span>
      </div>
    </div>
  </div>
)

const formatCurrency = v => {
  if (parseFloat(v) < 0) {
    return `$${Math.abs(v)} T`;
  }
  else if (parseFloat(v) > 0){
    return `$${v} T`;
  }
  else {
    return `$${v}`;
  }
};

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

export const getMarkers = (width) => {
  const markerStyle = {
      axis: 'y',
      lineStyle: {strokeWidth: 0},
      textStyle: {
        fontWeight: semiBoldWeight,
        fill: '#666666',
        fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
      },
    };
    // const markerBackground = {
    //   axis: 'y',
    //   lineStyle: {strokeWidth: 0},
    //   textStyle: {
    //     fill: '#f1f1f1',
    //     fontWeight: 800,
    //     fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    //   },
    // };

  return (
    [
      {
        ...markerStyle,
        legend: 'GDP',
        value: '22.5',
      },
      {
        ...markerStyle,
        legend: 'Total Spending',
        value: '8.5',
      }
    ]
  )
}
