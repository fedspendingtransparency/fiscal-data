import {visWithCallout} from "../../../explainer.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {Bar} from "@nivo/bar";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {format} from "date-fns";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import React, {useEffect, useState} from "react";
import ChartContainer from "../../../explainer-components/chart-container";
import {pxToNumber} from "../../../../../helpers/styles-helper/styles-helper";
import {withWindowSize} from "react-fns";
import {chartContainer} from './deficit-comparison-bar-chart.module.scss';
import {
  deficitExplainerPrimary,
  deficitExplainerSecondary
} from "../national-deficit.module.scss";
import {
  breakpointLg,
  fontBodyCopy,
  fontSize_16,
  fontSize_12,
  semiBoldWeight
} from "../../../../../variables.module.scss";

const DeficitComparisonBarChart = ({width}) => {
  const [isChartRendered, setIsChartRendered] = useState(false);
  const desktop = width >= pxToNumber(breakpointLg);
  const date = new Date();
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`;
  const name = 'Monthly Treasury Statement (MTS)';
  const data = [
    {
      id: 0,
      revenue: 3.42,
      deficit: 3.13
    },
    {
      id: 1,
      spending: 6.55
    }
  ];
  const title = 'U.S. Deficit Compared to Revenue and Spending, FY 2021';
  const altText = 'Bar chart comparing the differences between the U.S. government’s spending and '+
  'revenue, resulting in a deficit for FY {YYYY (latest complete fiscal year)}.';
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

  const spendingBarColor = '#00766c';
  const revenueBarColor = '#0a2f5a';
  const deficitBarColor = deficitExplainerSecondary;

  const theme = {
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

  const layers = ['axes', 'grid', 'markers', 'bars'];

  const rightSideMarkerPos = {
    axis: 'y',
    legendOffsetX: desktop ? -28 : -25,
  };
  const leftSideMarkerPos = {
    axis: 'y',
    legendOffsetX: desktop ? 292 : 200,
  };
  const categoryMarkerText = {
    fontSize: desktop ? fontSize_16 : fontSize_12,
    fill: fontBodyCopy,
    fontWeight: desktop ? 'bold' : semiBoldWeight
  };
  const valueMarkerText = {
    fontSize: desktop ? fontSize_16 : fontSize_12,
    fill: fontBodyCopy,
    fontWeight: 'normal'
  };
  const deficitMarker = {
    ...leftSideMarkerPos,
    legendOffsetY: desktop ? -85 : -58,
    textStyle: {
      ...categoryMarkerText,
      textAnchor: 'middle'
    }
  };
  const deficitValueMarker = {
    ...leftSideMarkerPos,
    legendOffsetY: desktop ? 91 : 66,
    textStyle: {
      ...valueMarkerText,
      textAnchor: 'middle'
    }
  };
  const revenueMarker = {
    ...leftSideMarkerPos,
    legendOffsetY: desktop ? -227 : -154,
    textStyle: {
      ...categoryMarkerText,
      textAnchor: 'middle'
    }
  };
  const revenueValueMarker = {
    ...leftSideMarkerPos,
    legendOffsetY: desktop ? -63 : -40,
    textStyle: {
      ...valueMarkerText,
      textAnchor: 'middle'
    }
  };
  const spendingMarker = {
    ...rightSideMarkerPos,
    legendOffsetY: desktop ? -155 : -112,
    textStyle: {
      ...categoryMarkerText,
      textAnchor: 'middle'
    }
  };
  const spendingValueMarker = {
    ...rightSideMarkerPos,
    legendOffsetY: desktop ? -130 : -96,
    textStyle: {
      ...valueMarkerText,
      textAnchor: 'middle'
    }
  };

  const markers = [
    {
      ...revenueMarker,
      legend: 'Revenue'
    },
    {
      ...revenueValueMarker,
      value: data[0]['revenue'],
      legend: `$${data[0]['revenue'].toFixed(2)} T`
    },
    {
      ...deficitMarker,
      value: 'Deficit',
      legend: 'Deficit'
    },
    {
      ...deficitValueMarker,
      value: data[0]['deficit'],
      legend: `$${data[0]['deficit'].toFixed(2)} T`
    },
    {
      ...spendingMarker,
      legend: 'Spending'
    },
    {
      ...spendingValueMarker,
      value: data[1]['spending'],
      legend: `$${data[1]['spending'].toFixed(2)} T`
    }
  ];

  const applyChartScaling = () => {
    const svgChart = document.querySelector('[data-testid="deficitComparisonChart"] svg');
    // if (svgChart) {
    //   svgChart.setAttribute('viewBox', '0 0 520 372');
    //   svgChart.setAttribute('height', '100%');
    //   svgChart.setAttribute('width', '100%');
    // }
  };

  useEffect(() => {
    if (isChartRendered) {
      applyChartScaling();
    }
  }, [isChartRendered]);


  return(
    <div className={visWithCallout}>
      {!data && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {data && (
        <>
          <div data-testid={'deficitComparisonChart'}>
            <ChartContainer
              title={title}
              altText={altText}
              footer={footer}
            >
              <div className={chartContainer}>
                <Bar
                  width={desktop ? 408 : 304}
                  height={desktop ? 288 : 208}
                  axisTop={null}
                  axisRight={null}
                  axisLeft={null}
                  axisBottom={null}
                  data={data}
                  keys={['revenue', 'deficit', 'spending']}
                  margin={ desktop ?
                    { top: 0, right: 74, bottom: 0, left: 74 } :
                    { top: 0, right: 65, bottom: 0, left: 65 }
                  }
                  padding={desktop ? 0.29 : 0.19}
                  valueScale={{ type: 'linear' }}
                  colors={[revenueBarColor, deficitBarColor, spendingBarColor]}
                  isInteractive={false}
                  borderColor={fontBodyCopy}
                  enableGridY={true}
                  gridYValues={[0]}
                  markers={markers}
                  enableLabel={false}
                  layers={[
                    ...layers,
                    () => {
                      // this final empty layer fn is called only after everything else is
                      // rendered, so it serves as a handy postRender hook.
                      // It's wrapped in a setTimout to avoid triggering a browser warning
                      setTimeout(() => setIsChartRendered(true));
                      return (<></>);
                    }
                  ]}
                  theme={theme}
                />
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={deficitExplainerPrimary}>
            <p>
              In FY YYYY (latest complete fiscal year) total government spending was $XX.XX trillion
              and total revenue was $XX.XX trillion, resulting in a deficit of $XX.XX trillion,
              an increase/decrease of $XX.XX trillion from the previous fiscal year.
            </p>
          </VisualizationCallout>
        </>
      )}
    </div>
  )
}

export default withWindowSize(DeficitComparisonBarChart);
