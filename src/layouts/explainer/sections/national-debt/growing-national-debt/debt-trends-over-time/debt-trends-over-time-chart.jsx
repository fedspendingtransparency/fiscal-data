import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import {
  breakpointLg,
  debtExplainerPrimary,
  fontSize_10,
  fontSize_14
} from '../../../../../../variables.module.scss';
import React, {useEffect, useState} from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import Analytics from '../../../../../../utils/analytics/analytics';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import {
  container,
  lineChartContainer,
  header,
  headerContainer,
  subHeader,
  inAnimation,
  animationCrosshair
} from './debt-trends-over-time-chart.module.scss';
import { visWithCallout } from '../../../../explainer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Line } from '@nivo/line';
import VisualizationCallout
  from '../../../../../../components/visualization-callout/visualization-callout';
import {
  nationalDebtSectionConfigs,
} from '../../national-debt';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
} from '../../../../explainer-helpers/explainer-charting-helper';
import globalConstants from '../../../../../../helpers/constants';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import {
  LineChartCustomSlices
} from '../../../federal-spending/spending-trends/total-spending-chart/total-spending-chart-helper';

import CustomSlices from '../../../../explainer-helpers/CustomSlice/custom-slice';
let gaTimerDebtTrends;

const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: "Explainers",
    action: action,
    label: `Debt - ${section}`,
  });
};

export const DebtTrendsOverTimeChart = ({ sectionId, beaGDPData, width }) => {

  const [lineChartHoveredYear, setLineChartHoveredYear] = useState('');
  const [lineChartHoveredValue, setLineChartHoveredValue] = useState('');
  const [debtTrendsData, setDebtTrendsData] = useState([]);
  const [isLoadingDebtTrends, setIsLoadingDebtTrends] = useState(true);
  const [lastDebtValue, setLastDebtValue] = useState({});
  const [startAnimation, setStartAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationPoint, setAnimationPoint] = useState(0);
  const [dataLoadAttemptsLeft, setDataLoadAttemptsLeft] = useState(globalConstants.DEFAULT_FETCH_RETRIES);
  const [dataLoadError, setDataLoadError] = useState(false);

  const {
    name,
    slug
  } = nationalDebtSectionConfigs[sectionId];

  const chartParent = 'debtTrendsChart';
  const chartWidth = 550;
  const chartHeight = 490;

  const historicalDebtOutstanding = (
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


  const debtEndpointUrl =
    "v2/accounting/od/debt_outstanding?sort=-record_date&filter=record_fiscal_year:gte:1948";

  useEffect(() => {
    if (dataLoadAttemptsLeft > 0) {
      const {finalGDPData} = beaGDPData;
      basicFetch(`${apiPrefix}${debtEndpointUrl}`).then(res => {
        setDataLoadAttemptsLeft(-1);
        if (res.data) {
          const debtData = res.data;
          const debtToGDP = [];
          finalGDPData.forEach(GDPEntry => {
            const record = debtData.find(entry =>
              entry.record_date.includes(GDPEntry.fiscalYear)
            );
            if (record) {
              debtToGDP.push({
                x: GDPEntry.x,
                y: Math.round(
                  (parseFloat(record.debt_outstanding_amt) /
                    GDPEntry.actual) *
                  100
                ),
              });
            }
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
          applyChartScaling(
            chartParent,
            chartWidth.toString(),
            chartHeight.toString()
          );
          addInnerChartAriaLabel(chartParent);
        }
      }).catch(error => {
        console.warn('Could not load data', error);
        if (dataLoadAttemptsLeft === 1) { // this was the final attempt that failed
          setDataLoadError(true);
          setIsLoadingDebtTrends(false);
        }
        setTimeout(() => {
          setDataLoadAttemptsLeft((attemptsState) => attemptsState - 1);
        }, globalConstants.DEFAULT_FETCH_RETRY_TIMER);  // wait some time before trying again
      });
    }
  }, [dataLoadAttemptsLeft]);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width]);

  useEffect(() => {
    applyChartScaling(
      chartParent,
      chartWidth.toString(),
      chartHeight.toString()
    );
  }, []);

  const customHeaderStyles = {
    marginTop: "1rem",
  }
  const customFooterSpacing = {
    marginTop: "2rem",
  }

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
    crosshair: {
      line: {
        stroke: '#555555',
        strokeWidth: 2,
        pointerEvents: 'all'
      }
    }
  };

  const formatPercentage = v => `${v}%`;

  useEffect(() => {
    if(startAnimation && debtTrendsData && !animationComplete) {
      if(animationPoint < debtTrendsData[0].data.length -1) {
        const i = animationPoint + 1;
        setTimeout(() => {
          setAnimationPoint(i);
        }, 50)
      } else {
        clearTimeout();
        setAnimationComplete(true);
      }
    }
  }, [animationPoint, startAnimation])

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

  const CustomPoint = props => {
    const { currentSlice, borderWidth, borderColor, points } = props;
    let currentPoint;
    let verticalCrosshair;
    let observer;
    if (!isLoadingDebtTrends && !dataLoadError) {
      if (!animationComplete) {
        if (typeof window !== "undefined") {
          const config = {
            rootMargin: '-50% 0% -50% 0%',
            threshold: 0
          };
          observer = new IntersectionObserver(entries => {
            entries.forEach((entry) => {
              if (!startAnimation && entry.isIntersecting) {
                setStartAnimation(true);
              }
            })
          }, config);
          setTimeout(() =>
            observer.observe(document.querySelector('[data-testid="debtTrendsChart"]')), 1000);

          currentPoint = points[animationPoint];
          verticalCrosshair = (
            <line
              className={animationCrosshair}
              x1={currentPoint.x}
              x2={currentPoint.x}
              y1={0}
              y2={450}
              style={{
                ...chartBorderTheme.crosshair.line,
                strokeDasharray: [6, 6]
                }}
            />
          );
        }
      } else {
        currentPoint = currentSlice?.points?.length
          ? currentSlice.points[0]
          : points[points.length - 1];
      }
      setLineChartHoveredValue(formatPercentage(currentPoint.data.y));
      setLineChartHoveredYear(currentPoint.data.x);
      return (
        <>
          <Point
            currentPoint={currentPoint}
            borderColor={borderColor}
            borderWidth={borderWidth}
          />
          {verticalCrosshair}
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
    setLineChartHoveredValue(formatPercentage(lastDebtValue.y));
    setLineChartHoveredYear(lastDebtValue.x);
  };

  const headerContent = () => (
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
  );

  const footerContent = (
    <p>
      Visit the {historicalDebtOutstanding} dataset
      to explore and download this data. The GDP data is sourced
      from the {beaLink}.
    </p>
  );

  return (
    <>
      {isLoadingDebtTrends && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {dataLoadError && (
        <div data-testid="error-message">
          There was a problem loading data for this chart. Please try again later.
        </div>
      )}
      {(!isLoadingDebtTrends && !dataLoadError && debtTrendsData) && (
        <div className={visWithCallout}>
          <div className={container}>
        <ChartContainer
          title={`Federal Debt Trends Over Time, FY 1948 – ${lastDebtValue.x}`}
          subTitle={'Debt to Gross Domestic Product (GDP)'}
          header={headerContent()}
          footer={footerContent}
          date={getDateWithoutTimeZoneAdjust(`${lastDebtValue.x}-09-30`)}
          altText={
            `Line graph displaying the federal debt to GDP trend over time from ${debtTrendsData[0].data[0].x} to ${lastDebtValue.x}.`
          }
          customHeaderStyles={customHeaderStyles}
          customFooterSpacing={customFooterSpacing}
        >
          <div
            className={`${lineChartContainer} ${!animationComplete ? inAnimation : ''}`}
            data-testid={`${chartParent}`}
            onMouseEnter={handleMouseEnterLineChart}
            onMouseLeave={handleMouseLeaveLineChart}
            role={'presentation'}
          >
            <Line
              data={debtTrendsData}
              width={chartWidth}
              height={chartHeight}
              theme={chartBorderTheme}
              layers={[
                "grid",
                "lines",
                "axes",
                CustomPoint,
                (props) =>
                  CustomSlices({
                      ...props,
                    }
                  ),
                "crosshair"
              ]}
                margin={
                  width < pxToNumber(breakpointLg)
                    ? { top: 10, right: 25, bottom: 40, left: 55 }
                    : { top: 10, right: 25, bottom: 30, left: 50 }
                }
              xScale={{
                type: "linear",
                min: 1948,
                max: lastDebtValue.x,
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
                tickSize: 6,
                tickPadding: 8,
                tickRotation: 0,
                tickValues: 9,
              }}
              axisLeft={{
                format: formatPercentage,
                orient: "left",
                tickSize: 6,
                tickPadding: 8,
                tickValues: 8,
              }}
              enablePoints={false}
              enableSlices="x"
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
              enableCrosshair={true}
              crosshairType="x"
              animate={false}
              isInteractive={true}
              onMouseLeave={lineChartOnMouseLeave}
            />
          </div>
        </ChartContainer>
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
        </div>
      )}
    </>
  );
};
