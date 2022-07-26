import {visWithCallout} from "../../../../explainer.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {Bar} from "@nivo/bar";
import VisualizationCallout
  from "../../../../../../components/visualization-callout/visualization-callout";
import React from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {withWindowSize} from "react-fns";
import {barChart, container} from './deficit-comparison-bar-chart.module.scss';
import {
  deficitExplainerPrimary,
  deficitExplainerSecondary
} from "../../national-deficit.module.scss";
import {
  breakpointLg,
  fontBodyCopy
} from "../../../../../../variables.module.scss";
import {chart, getMarkers,} from './deficit-comparison-bar-chart-helper';

const DeficitComparisonBarChart = ({width}) => {
  const desktop = width >= pxToNumber(breakpointLg);
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

  const markers = getMarkers(data, width);

  return(
    <div className={visWithCallout}>
      {!data && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {data && (
        <>
          <div data-testid={'deficitComparisonChart'} className={container}>
              <ChartContainer
                title={chart.title}
                altText={chart.altText}
                footer={chart.footer}
              >
                <div className={barChart} >
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
                    markers={desktop ? markers[0] : markers[1]}
                    enableLabel={false}
                    layers={[...layers]}
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
