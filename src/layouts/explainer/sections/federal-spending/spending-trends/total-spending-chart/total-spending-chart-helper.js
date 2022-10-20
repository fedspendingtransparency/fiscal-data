import React from "react";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import * as styles from "./total-spending-chart.module.scss";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  semiBoldWeight,
} from "../../../../../../variables.module.scss";
import { pxToNumber } from "../../../../../../helpers/styles-helper/styles-helper";

const name = "MTS - Summary of Receipts and Outlays of the U.S. Government";
const slug = `/datasets/monthly-treasury-statement/receipts-of-the-u-s-government/`;
const footer = (
  <p>
    Visit the <CustomLink url={slug}>{name}</CustomLink> to explore and download
    this data.
  </p>
);

export const chartCopy = {
  title: "Government Spending and the U.S. Economy (GDP), FY 2015 – 2021",
  subtitle: "Inflation Adjusted - 2021 Dollars",
  footer: footer,
  altText:
    "Line graph comparing the total federal spending to the total GDP dollar amount.",
};

export const dataHeader = chartToggleConfig => {
  if (!chartToggleConfig) return;
  const {
    setSelectedChartView,
    selectedChartView,
    isMobile,
  } = chartToggleConfig;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "1rem",
        marginBottom: "1rem",
        justifyContent: "center",
      }}
    >
      <div className={styles.chartToggle}>
        <button
          className={styles.toggleButton}
          style={{
            borderBottomLeftRadius: "4px",
            borderTopLeftRadius: "4px",
            color:
              selectedChartView === "totalSpending" ? "#f1f1f1" : "#00766C",
            background:
              selectedChartView === "totalSpending" ? "#00766C" : "#f1f1f1",
            borderRight: "none",
            width: isMobile ? "144px" : "224px",
            height: isMobile ? "1.5rem" : "2rem",
          }}
          onClick={() => {
            setSelectedChartView("totalSpending");
          }}
        >
          <span
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color:
                selectedChartView === "percentageGdp" ? "inherit" : "#FFFFFF",
              fontWeight: "600",
            }}
          >
            Total Spending
          </span>
        </button>
        <button
          className={styles.toggleButton}
          style={{
            borderBottomRightRadius: "4px",
            borderTopRightRadius: "4px",
            color:
              selectedChartView === "percentageGdp" ? "#f1f1f1" : "#00766C",
            background:
              selectedChartView === "percentageGdp" ? "#00766C" : "#f1f1f1",
            width: isMobile ? "144px" : "224px",
            height: isMobile ? "1.5rem" : "2rem",
          }}
          onClick={() => {
            setSelectedChartView("percentageGdp");
          }}
        >
          <span
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color:
                selectedChartView === "percentageGdp" ? "#FFFFFF" : "inherit",
              fontWeight: "600",
            }}
          >
            Percentage of GDP
          </span>
        </button>
      </div>{" "}
      <div className={styles.headerContainer}>
        <div className={styles.headerData}>
          <div
            className={styles.dataElement}
            style={{
              paddingLeft:
                selectedChartView === "percentageGdp" ? "112px" : "16px",
            }}
          >
            <div className={styles.dataValue}>2020</div>
            <span className={styles.dataLabel}>Fiscal Year</span>
          </div>

          {selectedChartView !== "percentageGdp" && (
            <div className={styles.dataElement}>
              <div className={styles.dataValue}>$7.6 T</div>
              <span className={styles.dataLabel}>Total Spending</span>
            </div>
          )}

          {selectedChartView !== "percentageGdp" && (
            <div className={styles.dataElement}>
              <div className={styles.dataValue}>$22.1 T</div>
              <span className={styles.dataLabel}>GDP</span>
            </div>
          )}

          {selectedChartView === "percentageGdp" && (
            <div className={styles.dataElement}>
              <div className={styles.dataValue}>32%</div>
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

const chartTheme = {
  textColor: "#666666",
  axis: {
    domain: {
      line: {
        strokeWidth: 1,
        stroke: "#666666",
      },
    },
  },
  crosshair: {
    line: {
      stroke: "#555555",
      strokeWidth: 2,
      strokeDasharray: "2,2",
    },
  },
  marker: {
    fill: "#666666",
  },
};

const layers = [
  "grid",
  "axes",
  "lines",
  "crosshair",
  "markers",
  "points",
  "mesh",
];

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
};

export const getMarkers = (width, selectedChartView) => {
  const markerStyle = {
    axis: "y",
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
          value: "22.5",
        },
        {
          ...markerStyle,
          legend: "Total Spending",
          value: "8.5",
        },
      ];
};
