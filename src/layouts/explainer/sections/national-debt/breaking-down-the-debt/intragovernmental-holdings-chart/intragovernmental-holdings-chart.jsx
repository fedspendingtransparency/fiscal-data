import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {Bar} from '@nivo/bar';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import { nationalDebtSectionConfigs } from '../../national-debt';
import { analyticsClickHandler } from '../../../../explainer-helpers/national-debt-helper';
import VisualizationCallout
  from '../../../../../../components/visualization-callout/visualization-callout';
import {
  fontBodyCopy,
  fontSize_16,
  fontSize_12,
  debtExplainerPrimary,
  debtExplainerLightSecondary, breakpointLg,
} from '../../../../../../variables.module.scss';
import {
  barChartContainer,
  title
} from './intragovernmental-holdings-chart.module.scss';
import {visWithCallout} from '../../../../explainer.module.scss';
import CustomBar from './custom-bar/customBar';
import {
  addInnerChartAriaLabel,
  applyChartScaling
} from '../../../../explainer-helpers/explainer-charting-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
const IntragovernmentalHoldingsChart = ({sectionId, data, date, width}) => {
  const [isChartRendered, setIsChartRendered] = useState(false);
  const [debtMarkerDelay, setDebtMarkerDelay] = useState(null);

  const chartParent = "breakdownChart";
  const chartWidth = 550;
  const chartHeight = 490;

  const setAnimationDurations = (data) => {
    if(data && data.length >= 2) {
      const holdings = Math.max( data[0]["Intragovernmental Holdings"],  data[1]["Intragovernmental Holdings"]);
      const debt = Math.max( data[0]["Debt Held by the Public"],  data[1]["Debt Held by the Public"]);
      const totalDuration = 6000;
      const debt_duration = (debt / (debt + holdings)) * totalDuration;
      const holdings_duration = (holdings / (debt + holdings)) * totalDuration;
      if(!debtMarkerDelay) {
        setDebtMarkerDelay(debt_duration + holdings_duration + 1250);
      }
      data[0]["debt_animation_duration"] = debt_duration;
      data[1]["debt_animation_duration"] = debt_duration;
      data[0]["holdings_animation_duration"] = holdings_duration;
      data[1]["holdings_animation_duration"] = holdings_duration;
      return data;
    }
  }

  const chartData = setAnimationDurations(data);


  const {
    name,
    slug,
  } = nationalDebtSectionConfigs[sectionId];

  const fiveTheme = {
    fontSize: fontSize_16,
    textColor: fontBodyCopy,
    markers: {
      lineStrokeWidth: 0,
    },
    grid: {
      line: {
        stroke: fontBodyCopy,
        strokeWidth: 2,
      },
    },
    legends: {
      text: {
        fontSize: fontSize_16,
      },
    },
  };

  const layers = [
    "bars",
    "grid",
    "legends",
    "annotations",
    "axes",
  ];

  const calcPercentIncrease = (key, rows) =>
    Math.round(
      ((rows[1][key] - rows[0][key]) / rows[0][key]) * 100
    ).toFixed();

  // generate rectangular color swatches in footer legend
  const CustomSymbolShape = ({x, y, size, fill, borderWidth, borderColor}) => {
    return (
      <rect
        x={x}
        y={y}
        fill={fill}
        strokeWidth={borderWidth}
        stroke={borderColor}
        width={size * 2}
        height={size}
        style={{ pointerEvents: "none" }}
      />
    );
  };

  useEffect(() => {
    if (isChartRendered) {
      applyChartScaling(chartParent, chartWidth, chartHeight+30);
      addInnerChartAriaLabel(chartParent);
    }
  }, [isChartRendered]);

  const chartFooter =
    <p>
      Visit the{" "}
      <CustomLink
        url={slug}
        onClick={() =>
          analyticsClickHandler(
            "Citation Click",
            "Intragovernmental Holdings and Debt Held by the Public"
          )
        }
      >
        {name}
      </CustomLink>{" "}
      to explore and download this data.
    </p>


  return (
    <>
      <div className={visWithCallout}>
        {!data && (
          <div>
            <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
          </div>
        )}
        {data && (
          <>
            <ChartContainer
              title={
                <div className={title}>
                  Intragovernmental Holdings and Debt Held by the Public, CY {data[0].record_calendar_year} and
                  CY {data[1].record_calendar_year}
                </div>
              }
              altText={'Bar chart showing Intergovernmental Holdings and Debt Held by the Public values; comparing the '+
                       'latest complete calendar year values to 10 years prior.'}
              footer={chartFooter}
              date={date}
              customFooterStyles={width < pxToNumber(breakpointLg) ?
                {fontSize: fontSize_12, marginTop: '15px'} : null}
            >
              <div
                data-testid="breakdownChart"
                className={barChartContainer}
              >
                <Bar
                  barComponent={CustomBar}
                  width={chartWidth}
                  height={chartHeight}
                  data={chartData}
                  keys={[
                    "Intragovernmental Holdings",
                    "Debt Held by the Public",
                  ]}
                  indexBy="record_calendar_year"
                  margin={{ top: 30, right: 144, bottom: 50, left: 144 }}
                  padding={0.24}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={[debtExplainerLightSecondary, debtExplainerPrimary]}
                  isInteractive={false}
                  borderColor={fontBodyCopy}
                  axisTop={null}
                  axisRight={null}
                  axisLeft={null}
                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                  }}
                  enableGridY={true}
                  gridYValues={[0]}
                  enableLabel={false}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-left",
                      direction: "row",
                      justify: false,
                      translateX: -125,
                      translateY: 90,
                      itemsSpacing: 15,
                      itemWidth: 250,
                      itemHeight: 40,
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      symbolSize: 20,
                      symbolShape: CustomSymbolShape,
                      symbolSpacing: 28,
                    },
                  ]}
                  layers={[
                    ...layers,
                    () => {
                      // this final empty layer fn is called only after everything else is
                      // rendered, so it serves as a handy postRender hook.
                      // It's wrapped in a setTimout to avoid triggering a browser warning
                      setTimeout(() => setIsChartRendered(true));
                      return <></>;
                    },
                  ]}
                  ariaLabel="Chart of Debt Breakdown"
                  theme={fiveTheme}
                />
              </div>
            </ChartContainer>
            <VisualizationCallout color={debtExplainerPrimary}>
              <p>
                There are two major categories for federal debt: debt held by
                the public and intragovernmental holdings.
              </p>

              <p>
                The debt held by the public has increased by{" "}
                <span data-testid={"public-debt-increase"}>
                    {calcPercentIncrease("Debt Held by the Public", data)}%
                </span>{" "}
                since {data[0].record_calendar_year}. Intragovernmental
                holdings increased by{" "}
                <span data-testid={"govt-debt-increase"}>
                    {calcPercentIncrease("Intragovernmental Holdings", data)}%
                </span>{" "}
                since {data[0].record_calendar_year}.
              </p>
            </VisualizationCallout>
          </>
        )}
      </div>
    </>
  )
};

export default IntragovernmentalHoldingsChart;
