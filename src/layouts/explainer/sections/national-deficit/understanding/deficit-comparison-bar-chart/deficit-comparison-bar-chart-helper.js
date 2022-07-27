import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {format} from "date-fns";
import React from "react";
import {
  fontBodyCopy,
  fontSize_12,
  fontSize_16,
  semiBoldWeight,
  breakpointLg
} from "../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";



const date = new Date();
const name = 'Monthly Treasury Statement (MTS)';
const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`;
const footer =
  <div>
    Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore and
    download this data.
    <p>
      Please note: This data visual only includes completed fiscal years. The following
      year will be displayed at the end of the fiscal year.
    </p>
    Last Updated: {format(date, 'MMMM d, yyyy')}
  </div>

export const chart = {
  title: 'U.S. Deficit Compared to Revenue and Spending, FY 2021',
  altText: 'Bar chart comparing the differences between the U.S. government’s spending and '+
    'revenue, resulting in a deficit for FY {YYYY (latest complete fiscal year)}.',
  footer: footer
}
export const getMarkers = (data, width) => {
  const styleMap = {
    mobile: {
      rightOffset: -25,
      leftOffset: 200,
      fontWeight: semiBoldWeight,
      fontSize: fontSize_12

    },
    desktop: {
      rightOffset: -28,
      leftOffset: 292,
      fontWeight: 'bold',
      fontSize: fontSize_16
    }
  }

  const style = width < pxToNumber(breakpointLg) ? styleMap.mobile : styleMap.desktop;


  const rightSideMarkerPos = {
    axis: 'y',
    legendOffsetX: style.rightOffset,
  };
  const leftSideMarkerPos = {
    axis: 'y',
    legendOffsetX: style.leftOffset,
  };

  const categoryMarkerText = {
    fontSize: style.fontSize,
    fill: fontBodyCopy,
    fontWeight: style.fontWeight,
    textAnchor: 'middle'
  };
  const valueMarkerText = {
    fontSize: style.fontSize,
    fill: fontBodyCopy,
    fontWeight: 'normal',
    textAnchor: 'middle'
  };


  const deficitLabel = {
    ...leftSideMarkerPos,
    textStyle: {...categoryMarkerText},
    value: 'Deficit',
    legend: 'Deficit'
  };
  const deficitValue = {
    ...leftSideMarkerPos,
    textStyle: {...valueMarkerText},
    value: data[0]['deficit'],
    legend: `$${data[0]['deficit'].toFixed(2)} T`
  };
  const revenueLabel = {
    ...leftSideMarkerPos,
    textStyle: {...categoryMarkerText},
    legend: 'Revenue'
  };
  const revenueValue = {
    ...leftSideMarkerPos,
    textStyle: {...valueMarkerText},
    value: data[0]['revenue'],
    legend: `$${data[0]['revenue'].toFixed(2)} T`
  };
  const spendingLabel = {
    ...rightSideMarkerPos,
    textStyle: {...categoryMarkerText},
    legend: 'Spending'
  };
  const spendingValue = {
    ...rightSideMarkerPos,
    textStyle: {...valueMarkerText},
    value: data[1]['spending'],
    legend: `$${data[1]['spending'].toFixed(2)} T`
  };

  const mobileMarkers = [
    {
      ...revenueLabel,
      legendOffsetY: -154
    },
    {
      ...revenueValue,
      legendOffsetY: -40
    },
    {
      ...deficitLabel,
      legendOffsetY: -58
    },
    {
      ...deficitValue,
      legendOffsetY: 66
    },
    {
      ...spendingLabel,
      legendOffsetY: -112
    },
    {
      ...spendingValue,
      legendOffsetY: -96
    }
  ];

  const desktopMarkers = [
    {
      ...revenueLabel,
      legendOffsetY: -227
    },
    {
      ...revenueValue,
      legendOffsetY: -63
    },
    {
      ...deficitLabel,
      legendOffsetY: -85
    },
    {
      ...deficitValue,
      legendOffsetY: 91
    },
    {
      ...spendingLabel,
      legendOffsetY: -155
    },
    {
      ...spendingValue,
      legendOffsetY: -130
    }
  ];

  return [desktopMarkers, mobileMarkers];
}
