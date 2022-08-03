import {
  fontBodyCopy,
  fontSize_12,
  fontSize_16,
  semiBoldWeight,
  breakpointLg
} from "../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {deficitExplainerSecondary} from "../../national-deficit.module.scss";


export const desktopHeight = 288;
export const mobileHeight = 208;
export const layers = ['axes', 'grid', 'markers', 'bars'];
export const theme = {
  markers: {
    lineStrokeWidth: 0
  },
  grid: {
    line: {
      stroke: fontBodyCopy,
      strokeWidth: 1
    }
  },
};

const spendingBarColor = '#00766c';
const revenueBarColor = '#0a2f5a';
const deficitBarColor = deficitExplainerSecondary;
export const barChartColors = [revenueBarColor, deficitBarColor, spendingBarColor];

export const getMarkers = (data, width) => {
  if (data) {
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


    const deficitDesktopHeight = (data[0]['deficit'] / data[1]['spending']) * desktopHeight;
    const deficitMobileHeight = (data[0]['deficit'] / data[1]['spending']) * mobileHeight;
    const revenueDesktopHeight = (data[0]['revenue'] / data[1]['spending']) * desktopHeight;
    const revenueMobileHeight = (data[0]['revenue'] / data[1]['spending']) * mobileHeight;

    const labelBarAdjustment = {
      desktop: {
        deficit: deficitDesktopHeight / -2,
        revenue: revenueDesktopHeight / -2,
        spending: desktopHeight / -2
      },
      mobile: {
        deficit: deficitMobileHeight / -2,
        revenue: revenueMobileHeight / -2,
        spending: mobileHeight / -2
      }
    }

    const markerHeights = {
      desktop:{
        deficit: {
          label: labelBarAdjustment.desktop.deficit + 13,
          value: labelBarAdjustment.desktop.deficit - 12
        },
        revenue: {
          label: labelBarAdjustment.desktop.revenue  + 13 - deficitDesktopHeight,
          value: labelBarAdjustment.desktop.revenue  - 12 - deficitDesktopHeight
        },
        spending: {
          label:  labelBarAdjustment.desktop.spending + 13,
          value:  labelBarAdjustment.desktop.spending - 12
        }
      },
      mobile: {
        deficit: {
          label: labelBarAdjustment.mobile.deficit + 8,
          value: labelBarAdjustment.mobile.deficit - 8
        },
        revenue: {
          label: labelBarAdjustment.mobile.revenue  + 8 - deficitMobileHeight,
          value: labelBarAdjustment.mobile.revenue  - 8 - deficitMobileHeight
        },
        spending: {
          label:  labelBarAdjustment.mobile.spending + 8,
          value:  labelBarAdjustment.mobile.spending - 8
        }
      }
    }


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
      legend: 'Deficit'
    };
    const deficitValue = {
      ...leftSideMarkerPos,
      textStyle: {...valueMarkerText},
      legend: `$${(data[0]['deficit']/1000000000000).toFixed(2)} T`
    };
    const revenueLabel = {
      ...leftSideMarkerPos,
      textStyle: {...categoryMarkerText},
      legend: 'Revenue'
    };
    const revenueValue = {
      ...leftSideMarkerPos,
      textStyle: {...valueMarkerText},
      legend: `$${(data[0]['revenue']/1000000000000).toFixed(2)} T`
    };
    const spendingLabel = {
      ...rightSideMarkerPos,
      textStyle: {...categoryMarkerText},
      legend: 'Spending'
    };
    const spendingValue = {
      ...rightSideMarkerPos,
      textStyle: {...valueMarkerText},
      legend: `$${(data[1]['spending']/1000000000000).toFixed(2)} T`
    };

    const mobileMarkers = [
      {
        ...deficitLabel,
        legendOffsetY: markerHeights.mobile.deficit.label
      },
      {
        ...deficitValue,
        legendOffsetY: markerHeights.mobile.deficit.value
      },
      {
        ...revenueLabel,
        legendOffsetY: markerHeights.mobile.revenue.label
      },
      {
        ...revenueValue,
        legendOffsetY: markerHeights.mobile.revenue.value
      },
      {
        ...spendingLabel,
        legendOffsetY: markerHeights.mobile.spending.label
      },
      {
        ...spendingValue,
        legendOffsetY: markerHeights.mobile.spending.value
      }
    ];

    const desktopMarkers = [
      {
        ...deficitLabel,
        legendOffsetY: markerHeights.desktop.deficit.label
      },
      {
        ...deficitValue,
        legendOffsetY: markerHeights.desktop.deficit.value
      },
      {
        ...revenueLabel,
        legendOffsetY: markerHeights.desktop.revenue.label
      },
      {
        ...revenueValue,
        legendOffsetY: markerHeights.desktop.revenue.value
      },
      {
        ...spendingLabel,
        legendOffsetY: markerHeights.desktop.spending.label
      },
      {
        ...spendingValue,
        legendOffsetY: markerHeights.desktop.spending.value
      }
    ];

    return [desktopMarkers, mobileMarkers];
  }
}
