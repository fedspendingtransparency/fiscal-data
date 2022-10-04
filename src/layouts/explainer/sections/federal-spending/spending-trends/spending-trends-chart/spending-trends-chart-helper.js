import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {
  chartHeaderContainer,
  dataHeaderContainer, dataLabels, headerTitle, subHeader,
  toggle
} from "./spending-trends-chart.module.scss";
import React from "react";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_10, fontSize_14} from "../../../../../../variables.module.scss";

const title = "Government Spending and the U.S. Economy (GDP), FY 2015 – 2021";
const subtitle = "Inflation Adjusted - 2021 Dollars";

const name = 'MTS - Summary of Receipts and Outlays of the U.S. Government';
const slug = `/datasets/monthly-treasury-statement/receipts-of-the-u-s-government/`;
const footer =
  <p>
    Visit the <CustomLink url={slug}>{name}</CustomLink> to explore
    and download this data.
  </p>;

export const chartCopy = {
    title: title,
    subtitle: subtitle,
    footer: footer
}

export const dataHeader = () => (
  <div className={chartHeaderContainer}>
    <div className={toggle}>
      Toggle Placeholder
    </div>
    <div className={dataHeaderContainer}>
      <div className={dataLabels}>
        <div>
          <div className={headerTitle}>2020</div>
          <span className={subHeader}>Fiscal Year</span>
        </div>
        <div>
          <div className={headerTitle}>$7.6 T</div>
          <span className={subHeader}>Total Spending</span>
        </div>
        <div>
          <div className={headerTitle}>$22.1 T</div>
          <span className={subHeader}>GDP</span>
        </div>
      </div>
    </div>
  </div>
)

export const chartTheme = {
  fontColor: '#666666',
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
    }
  },
  marker: {
    fontSize: fontSize_14,
    fontColor: '#666666'
  }
};

export const layers = [
  'grid',
  'markers',
  'axes',
  'areas',
  'lines',
  'points',
  'slices',
  'crosshair',
  'mesh',
  'legends',
]
