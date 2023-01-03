import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {
  breakpointLg,
  debtExplainerPrimary,
  fontSize_10,
  fontSize_14
} from "../../../../../../variables.module.scss";
import React, {useEffect, useRef, useState} from "react";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import drawChart from "../../../../../../components/charts/chart-primary";
import Analytics from "../../../../../../utils/analytics/analytics";
import {apiPrefix, basicFetch} from "../../../../../../utils/api-utils";
import {
  debtTrendsOverTimeSectionGraphContainer,
  footerContainer,
  header,
  headerContainer,
  lineChartContainer,
  subHeader,
  subTitle,
  title
} from "../../national-debt.module.scss";
import {chartBackdrop, visWithCallout} from "../../../../explainer.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {ResponsiveLine} from "@nivo/line";
import VisualizationCallout
  from "../../../../../../components/visualization-callout/visualization-callout";
import {
  chartPatternBackground,
  nationalDebtSectionConfigs,
} from "../../national-debt";

let gaTimerDebtTrends;


const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: "Explainers",
    action: action,
    label: `Debt - ${section}`,
  });
};

export const DebtTrendsOverTimeChart = ({ sectionId, width }) => {

    const [lineChartHoveredYear, setLinechartHoveredYear] = useState("");
    const [lineChartHoveredValue, setLinechartHoveredValue] = useState("");
    const [startAnimation, setStartAnimation] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [animationPoint, setAnimationPoint] = useState(0);
    const {
      name,
      slug,
      dateField,
      valueField,
      endpoint,
    } = nationalDebtSectionConfigs[sectionId];


    const historicalDebtOutstanding_DebtTrends = (
      <CustomLink
        url={slug}
        onClick={() =>
          analyticsClickHandler(
            "Citation Click",
            "Federal Debt Trends Over Time"
          )
        }
      >
        {name}
      </CustomLink>
    );

    const beaLink = (
      <CustomLink
        url={"https://www.bea.gov/"}
        onClick={() =>
          analyticsClickHandler(
            "Citation Click",
            "Federal Debt Trends Over Time"
          )
        }
      >
        Bureau of Economic Analysis
      </CustomLink>
    );



    // Below are the configs for custom properties for the debt trends over time line chart

    const [debtTrendsData, setDebtTrendsData] = useState([]);
    const [isLoadingDebtTrends, setIsLoadingDebtTrends] = useState(true);
    const [lastDebtValue, setLastDebtValue] = useState({});

    const debtEndpointUrl =
      "v2/accounting/od/debt_outstanding?sort=-record_date&filter=record_fiscal_year:gte:1948";

    useEffect(() => {
      basicFetch(`${apiPrefix}${debtEndpointUrl}`).then(res => {
        if (res.data) {
          const debtData = res.data;
          basicFetch(
            `https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON`
          ).then(res => {
            if (res.BEAAPI.Results.Data) {
              const gdpData = res.BEAAPI.Results.Data.filter(
                entry => entry.LineDescription === "Gross domestic product"
              );
              const averagedGDPByYear = [];
              for (
                let i = parseInt(
                  debtData[debtData.length - 1].record_fiscal_year
                );
                i <= parseInt(debtData[0].record_fiscal_year);
                i++
              ) {
                let allQuartersForGivenYear;
                if (i <= 1976) {
                  allQuartersForGivenYear = gdpData.filter(
                    entry =>
                      entry.TimePeriod.includes(i.toString() + "Q1") ||
                      entry.TimePeriod.includes(i.toString() + "Q2") ||
                      entry.TimePeriod.includes((i - 1).toString() + "Q3") ||
                      entry.TimePeriod.includes((i - 1).toString() + "Q4")
                  );
                } else if (i >= 1977) {
                  allQuartersForGivenYear = gdpData.filter(
                    entry =>
                      entry.TimePeriod.includes(i.toString() + "Q1") ||
                      entry.TimePeriod.includes(i.toString() + "Q2") ||
                      entry.TimePeriod.includes(i.toString() + "Q3") ||
                      entry.TimePeriod.includes((i - 1).toString() + "Q4")
                  );
                }
                if (
                  i >= 1977 &&
                  allQuartersForGivenYear.find(entry =>
                    entry.TimePeriod.includes(i.toString() + "Q3")
                  )
                ) {
                  let totalGDP = 0;
                  allQuartersForGivenYear.forEach(quarter => {
                    totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ""));
                  });
                  averagedGDPByYear.push({
                    // Correct BEA data to display in trillions
                    average: parseInt(String(totalGDP) + "000000") / 4,
                    year: i,
                  });
                } else if (i <= 1976) {
                  let totalGDP = 0;
                  allQuartersForGivenYear.forEach(quarter => {
                    totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ""));
                  });
                  averagedGDPByYear.push({
                    // Correct BEA data to display in trillions
                    average: parseInt(String(totalGDP) + "000000") / 4,
                    year: i,
                  });
                }
              }
              const debtToGDP = [];
              averagedGDPByYear.forEach(GDPEntry => {
                const record = debtData.find(entry =>
                  entry.record_date.includes(GDPEntry.year)
                );
                debtToGDP.push({
                  x: GDPEntry.year,
                  y: Math.round(
                    (parseFloat(record.debt_outstanding_amt) /
                      GDPEntry.average) *
                    100
                  ),
                });
              });
              const finalData = [
                {
                  id: "us",
                  color: "hsl(219, 70%, 50%)",
                  data: debtToGDP,
                },
              ];
              setDebtTrendsData(finalData);
              setLastDebtValue(finalData[0].data[finalData[0].data.length - 1]);
              setIsLoadingDebtTrends(false);
            }
          });
        }
      });
    }, []);

    const chartBorderTheme = {
      fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
      textColor: "#666666",
      axis: {
        domain: {
          line: {
            stroke: "#666666",
            strokeWidth: 1,
          },
        },
      },
    };

    const formatPercentage = v => `${v}%`;

    const CustomSlices = ({ slices, setCurrentSlice }) => {
      const allSlices =
        <g>
          {slices.map(slice => (
            <rect
              x={slice.x0}
              y={slice.y0}
              tabIndex={0}
              width={slice.width + 1}
              height={slice.height}
              strokeWidth={1}
              strokeOpacity={0}
              fillOpacity={0}
              onMouseEnter={() => setCurrentSlice(slice)}
              onMouseLeave={() => {
                setCurrentSlice(null);
              }}
              data-testid={"slice"}
            />
          ))}
        </g>;

      return (
        <>
          {allSlices}
        </>
      );
    };

    const Point = ({currentPoint, borderColor, borderWidth}) => {
      return (
        <g>
          <circle
            fill={"#D8D8D8"}
            r={8}
            strokeWidth={borderWidth}
            stroke={borderColor}
            fillOpacity={0.35}
            cx={currentPoint.x}
            cy={currentPoint.y}
          />
          <circle
            r={2}
            strokeWidth={"4"}
            stroke={"#000000"}
            fill={"#000000"}
            fillOpacity={0.85}
            cx={currentPoint.x}
            cy={currentPoint.y}
          />
        </g>
      );
    }

  useEffect(() => {
    if(startAnimation && debtTrendsData && !animationComplete) {
      if(animationPoint < debtTrendsData[0].data.length -1) {
        const i = animationPoint + 1;
        setTimeout(() => {
          console.log(i);
          setAnimationPoint(i);
        }, 25)
      } else {
        console.log("stop");
        clearTimeout();
        setAnimationComplete(true);
      }
    }
  }, [animationPoint, startAnimation])

    const CustomPoint = props => {
      const { currentSlice, borderWidth, borderColor, points } = props;
      let currentPoint;
      if (!isLoadingDebtTrends) {
        if(!animationComplete) {
          setStartAnimation(true);
          currentPoint = points[animationPoint];
        }
        else {
          currentPoint = currentSlice?.points?.length
              ? currentSlice.points[0]
              : points[points.length - 1];
        }
              setLinechartHoveredValue(formatPercentage(currentPoint.data.y));
              setLinechartHoveredYear(currentPoint.data.x);
              return (
                <>
                  <Point
                    currentPoint={currentPoint}
                    borderColor={borderColor}
                    borderWidth={borderWidth}
                  />
                </>
              );
      }
    };

    const handleMouseEnterLineChart = () => {
      gaTimerDebtTrends = setTimeout(() =>{
        Analytics.event({
          category: 'Explainers',
          action: 'Chart Hover',
          label: 'Debt - Federal Debt Trends Over Time'
        });
      }, 3000);
    }
    const handleMouseLeaveLineChart = () => {
      clearTimeout(gaTimerDebtTrends);
    };

    const lineChartOnMouseLeave = () => {
      setLinechartHoveredValue(formatPercentage(lastDebtValue.y));
      setLinechartHoveredYear(lastDebtValue.x);
    };

    return (
      <div className={visWithCallout}>
        {isLoadingDebtTrends && (
          <div>
            <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
          </div>
        )}
        {!isLoadingDebtTrends && (
          <>
            <div>
              <div className={debtTrendsOverTimeSectionGraphContainer}>
                <p className={title}>
                  {" "}
                  Federal Debt Trends Over Time, FY 1948 – {lastDebtValue.x}
                </p>
                <p className={subTitle}>
                  {" "}
                  Debt to Gross Domestic Product (GDP){" "}
                </p>
                <div className={headerContainer}>
                  <div>
                    <div className={header}>
                      {lineChartHoveredYear === ""
                        ? lastDebtValue.x
                        : lineChartHoveredYear}
                    </div>
                    <span className={subHeader}>Fiscal Year</span>
                  </div>
                  <div>
                    <div className={header}>
                      {lineChartHoveredValue === ""
                        ? lastDebtValue.y + "%"
                        : lineChartHoveredValue}
                    </div>
                    <span className={subHeader}>Debt to GDP</span>
                  </div>
                </div>
                <div
                  className={`${lineChartContainer} ${chartBackdrop}`}
                  data-testid={"debtTrendsChart"}
                  onMouseEnter={handleMouseEnterLineChart}
                  onMouseLeave={handleMouseLeaveLineChart}
                  role={"img"}
                  aria-label={`Line graph displaying the federal debt to GDP trend over time
                  from ${debtTrendsData[0].data[0].x} to ${lastDebtValue.x}.`}
                >
                  <ResponsiveLine
                    data={debtTrendsData}
                    theme={chartBorderTheme}
                    layers={[
                      "grid",
                      "lines",
                      "axes",
                      CustomPoint,
                      CustomSlices,
                    ]}
                    margin={
                      width < pxToNumber(breakpointLg)
                        ? { top: 8, right: 25, bottom: 30, left: 35 }
                        : { top: 8, right: 25, bottom: 30, left: 50 }
                    }
                    xScale={{
                      type: "linear",
                      min: 1940,
                      max: 2030,
                    }}
                    yScale={{
                      type: "linear",
                      min: 0,
                      max: 140,
                      stacked: true,
                      reverse: false,
                    }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      orient: "bottom",
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      tickValues: 9,
                    }}
                    axisLeft={{
                      format: formatPercentage,
                      orient: "left",
                      tickSize: 5,
                      tickValues: 8,
                    }}
                    enablePoints={false}
                    enableSlices={"x"}
                    pointSize={0}
                    pointColor={debtExplainerPrimary}
                    pointBorderWidth={2}
                    pointBorderColor={debtExplainerPrimary}
                    pointLabelYOffset={-12}
                    colors={debtExplainerPrimary}
                    useMesh={false}
                    enableGridY={false}
                    enableGridX={false}
                    sliceTooltip={() => <></>}
                    enableCrosshair={false}
                    animate={true}
                    isInteractive={true}
                    onMouseLeave={lineChartOnMouseLeave}
                  />
                </div>
                <div className={footerContainer}>
                  <p>
                    {" "}
                    Visit the {historicalDebtOutstanding_DebtTrends} dataset
                    to explore and download this data. The GDP data is sourced
                    from the {beaLink}.
                  </p>
                  <p>Last Updated: September 30, {lastDebtValue.x}</p>
                </div>
              </div>
            </div>
            <VisualizationCallout color={debtExplainerPrimary}>
              <p>
                When adjusted for inflation, the U.S. federal debt has
                steadily increased since 2001. Without adjusting for
                inflation, the U.S. federal debt has steadily increased since
                1957. Another way to view the federal debt over time is to
                look at the ratio of federal debt related to GDP. This ratio
                has generally increased since 1981.
              </p>
            </VisualizationCallout>
          </>
        )}
      </div>
    );
  };
