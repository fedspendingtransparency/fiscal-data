import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {Bar} from "@nivo/bar";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {
  analyticsClickHandler,
  nationalDebtSectionConfigs
} from "../../national-debt";
import {format} from "date-fns";
import VisualizationCallout
  from "../../../../../../components/visualization-callout/visualization-callout";
import {
  fontBodyCopy,
  fontSize_16,
  fontSize_36,
  debtExplainerPrimary,
  debtExplainerLightSecondary,
} from "../../../../../../variables.module.scss";
import {
  barChartContainer,
  debtBreakdownSectionGraphContainer,
  footerContainer, titleBreakdown,
} from "../../national-debt.module.scss";
import {chartBackdrop, visWithCallout} from "../../../../explainer.module.scss";
import CustomBar from './custom-bar/customBar'
const IntragovernmentalHoldingsChart = ({sectionId, data, date}) => {
  const [isChartRendered, setIsChartRendered] = useState(false);
  const [debtOpacity, setDebtOpacity] = useState(0);
  const [holdingsOpacity, setHoldingsOpacity] = useState(0);
  const [debtMarkerDelay, setDebtMarkerDelay] = useState(null);
  const [holdingsMarkerDelay, setHoldingsMarkerDelay] = useState(null);

  const setAnimationDurations = (data) => {
    if(data && data.length >= 2) {
      const holdings = Math.max( data[0]["Intragovernmental Holdings"],  data[1]["Intragovernmental Holdings"]);
      const debt = Math.max( data[0]["Debt Held by the Public"],  data[1]["Debt Held by the Public"]);
      const totalDuration = 6000;
      const debt_duration = (debt / (debt + holdings)) * totalDuration;
      const holdings_duration = (holdings / (debt + holdings)) * totalDuration;
      if(!debtMarkerDelay) {
        setDebtMarkerDelay(debt_duration + holdings_duration + 1250);
        setHoldingsMarkerDelay(holdings_duration + 500 );
      }
      data[0]["debt_animation_duration"] = debt_duration;
      data[1]["debt_animation_duration"] = debt_duration;
      data[0]["holdings_animation_duration"] = holdings_duration;
      data[1]["holdings_animation_duration"] = holdings_duration;
      return data;
    }
  }

  const chartData = setAnimationDurations(data);


  useEffect(() => {
    if(debtMarkerDelay) {
      setTimeout(() => {
        setDebtOpacity(1);
      }, (debtMarkerDelay))
    }
    if(holdingsMarkerDelay) {
      setTimeout(() => {
        setHoldingsOpacity(1);
      }, (holdingsMarkerDelay))
    }
  }, [debtMarkerDelay])

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
    "markers",
    "legends",
    "annotations",
    "axes",
  ];

  const markerPos = {
    axis: "y",
    legendOffsetY: -22,
  };

  const markerText = {
    fontSize: fontSize_36,
    fill: fontBodyCopy,
    fontWeight: "bold",
    transition: "opacity .25s ease-in"
  };


  const rightDebtMarker = {
    ...markerPos,
    legendOffsetX: 8,
    textStyle: {
      ...markerText,
      textAnchor: "start",
      opacity: debtOpacity,
    },
  }

  const leftDebtMarker = {
    ...markerPos,
    legendOffsetX: 228,
    textStyle: {
      ...markerText,
      opacity: debtOpacity
    },
  }

  const rightHoldingsMarker = {
    ...markerPos,
    legendOffsetX: 8,
    textStyle: {
      ...markerText,
      textAnchor: "start",
      opacity: holdingsOpacity
    },
  }

  const leftHoldingsMarker = {
    ...markerPos,
    legendOffsetX: 228,
    textStyle: {
      ...markerText,
      opacity: holdingsOpacity
    },
  }


  const calcPercentIncrease = (key, rows) =>
    Math.round(
      ((rows[1][key] - rows[0][key]) / rows[0][key]) * 100
    ).toFixed();

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector(
      '[data-testid="breakdownChart"] svg'
    );
    if (svgChart) {
      svgChart.setAttribute("viewBox", "0 0 524 500");
      svgChart.setAttribute("height", "100%");
      svgChart.setAttribute("width", "100%");
    }
  };

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
      applyChartScaling();
    }
  }, [isChartRendered]);


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
            <div>
              <div
                className={`${debtBreakdownSectionGraphContainer} ${chartBackdrop}`}
                role={"img"}
                aria-label={
                  "Bar chart showing Intergovernmental Holdings and Debt Held by the Public values; " +
                  "comparing the latest complete calendar year values to 10 years prior."
                }
              >
                <p className={titleBreakdown}>
                  Intragovernmental Holdings and Debt Held by the Public, CY{" "}
                  {data[0].record_calendar_year} and CY {data[1].record_calendar_year}
                </p>
                <div
                  data-testid="breakdownChart"
                  className={barChartContainer}
                >
                  <Bar
                    barComponent={CustomBar}
                    width={524}
                    height={468}
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
                    markers={[
                      {
                        ...leftHoldingsMarker,
                        value: data[0]["Intragovernmental Holdings"],
                        legend: `$${data[0]["Intragovernmental Holdings"].toFixed(2)} T`,
                      },
                      {
                        ...leftDebtMarker,
                        value: data[0].total,
                        legend: `$${data[0]["Debt Held by the Public"].toFixed(2)} T`,
                      },
                      {
                        ...rightHoldingsMarker,
                        value: data[1]["Intragovernmental Holdings"],
                        legend: `$${data[1]["Intragovernmental Holdings"].toFixed(2)} T`,
                      },
                      {
                        ...rightDebtMarker,
                        value: data[1].total,
                        legend: `$${data[1]["Debt Held by the Public"].toFixed(2)} T`,
                      },
                    ]}
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
                <div className={footerContainer}>
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
                  <p>Last Updated: {format(date, "MMMM d, yyyy")}</p>
                </div>
              </div>
            </div>
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
