import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, debtExplainerPrimary, fontSize_10, fontSize_14 } from '../../../../../../variables.module.scss';
import React, { useEffect, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import Analytics from '../../../../../../utils/analytics/analytics';
import {
  container,
  lineChartContainer,
  header,
  headerContainer,
  subHeader,
  inAnimation,
  animationCrosshair,
} from './debt-trends-over-time-chart.module.scss';
import { visWithCallout } from '../../../../explainer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Line } from '@nivo/line';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import { nationalDebtSectionConfigs } from '../../national-debt';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
  formatPercentage,
  getChartTheme,
  LineChartCustomPoint,
  nivoCommonLineChartProps,
} from '../../../../explainer-helpers/explainer-charting-helper';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import CustomSlices from '../../../../../../components/nivo/custom-slice/custom-slice';
import { useRecoilValueLoadable } from 'recoil';
import { debtOutstandingData, debtOutstandingLastCachedState } from '../../../../../../recoil/debtOutstandingDataState';
import useShouldRefreshCachedData from '../../../../../../recoil/hooks/useShouldRefreshCachedData';
import { useInView } from 'react-intersection-observer';

let gaTimerDebtTrends;
let ga4Timer;

const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: 'Explainers',
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
  // const [startAnimation, setStartAnimation] = useState(false);
  // const [animationComplete, setAnimationComplete] = useState(false);
  // const [animationPoint, setAnimationPoint] = useState(0);
  const data = useRecoilValueLoadable(debtOutstandingData);
  useShouldRefreshCachedData(Date.now(), debtOutstandingData, debtOutstandingLastCachedState);

  const { name, slug } = nationalDebtSectionConfigs[sectionId];

  const chartParent = 'debtTrendsChart';
  const chartWidth = 550;
  const chartHeight = 490;

  const historicalDebtOutstanding = (
    <CustomLink url={slug} onClick={() => analyticsClickHandler('Citation Click', 'Federal Debt Trends Over Time')} id="Historical Debt Outstanding">
      {name}
    </CustomLink>
  );

  const beaLink = (
    <CustomLink url="https://www.bea.gov/" onClick={() => analyticsClickHandler('Citation Click', 'Federal Debt Trends Over Time')}>
      Bureau of Economic Analysis
    </CustomLink>
  );

  const processData = () => {
    const { finalGDPData } = beaGDPData;
    const debtData = data.contents.payload;
    const debtToGDP = [];
    finalGDPData.forEach(GDPEntry => {
      const record = debtData.find(entry => entry.record_date.includes(GDPEntry.fiscalYear));
      if (record) {
        debtToGDP.push({
          x: GDPEntry.x,
          y: Math.round((parseFloat(record.debt_outstanding_amt) / GDPEntry.actual) * 100),
        });
      }
    });
    const finalData = [
      {
        id: 'us',
        color: 'hsl(219, 70%, 50%)',
        data: debtToGDP,
      },
    ];
    setDebtTrendsData(finalData);
    setLastDebtValue(finalData[0].data[finalData[0].data.length - 1]);
    setIsLoadingDebtTrends(false);
  };

  useEffect(() => {
    if (data.state === 'hasValue') {
      processData();
      addInnerChartAriaLabel(chartParent);
    }
  }, [data.state]);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width]);

  useEffect(() => {
    applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
  }, [isLoadingDebtTrends]);

  const customHeaderStyles = {
    marginTop: '1rem',
  };

  const customFooterSpacing = {
    marginTop: '2rem',
  };

  const handleMouseMove = slice => {
    const debtData = slice.points[0].data;
    if (debtData) {
      setLineChartHoveredValue(formatPercentage(debtData.y));
      setLineChartHoveredYear(debtData.x);
    }
  };

  const handleMouseEnterLineChart = () => {
    gaTimerDebtTrends = setTimeout(() => {
      Analytics.event({
        category: 'Explainers',
        action: 'Chart Hover',
        label: 'Debt - Federal Debt Trends Over Time',
      });
    }, 3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'chart-hover-debt-trends',
      });
    }, 3000);
  };

  const handleMouseLeaveLineChart = () => {
    clearTimeout(gaTimerDebtTrends);
    clearTimeout(ga4Timer);
  };

  const lineChartOnMouseLeave = () => {
    setLineChartHoveredValue(formatPercentage(lastDebtValue.y));
    setLineChartHoveredYear(lastDebtValue.x);
  };

  const headerContent = () => (
    <div className={headerContainer}>
      <div>
        <div className={header}>{lineChartHoveredYear === '' ? lastDebtValue.x : lineChartHoveredYear}</div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
      <div>
        <div className={header}>{lineChartHoveredValue === '' ? lastDebtValue.y + '%' : lineChartHoveredValue}</div>
        <span className={subHeader}>Debt to GDP</span>
      </div>
    </div>
  );

  const footerContent = (
    <p>
      Visit the {historicalDebtOutstanding} dataset to explore and download this data. The GDP data is sourced from the {beaLink}.
    </p>
  );

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <>
      {isLoadingDebtTrends && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!isLoadingDebtTrends && debtTrendsData && (
        <div className={visWithCallout} ref={ref}>
          <div className={container}>
            <ChartContainer
              title={`Federal Debt Trends Over Time, FY 1948 – ${lastDebtValue.x}`}
              subTitle="Debt to Gross Domestic Product (GDP)"
              header={headerContent()}
              footer={footerContent}
              date={getDateWithoutTimeZoneAdjust(`${lastDebtValue.x}-09-30`)}
              altText={`Line graph displaying the federal debt to GDP trend over time from ${debtTrendsData[0].data[0].x} to ${lastDebtValue.x}.`}
              customHeaderStyles={customHeaderStyles}
              customFooterSpacing={customFooterSpacing}
            >
              <div
                className={lineChartContainer}
                data-testid={`${chartParent}`}
                onMouseEnter={handleMouseEnterLineChart}
                onMouseLeave={handleMouseLeaveLineChart}
                id="debt-trends"
                role="presentation"
              >
                <Line
                  {...nivoCommonLineChartProps}
                  data={debtTrendsData}
                  width={chartWidth}
                  height={chartHeight}
                  theme={getChartTheme(width)}
                  layers={[
                    'grid',
                    'crosshair',
                    'lines',
                    'axes',
                    props =>
                      LineChartCustomPoint({
                        ...props,
                        serieId: 'us',
                      }),
                    props =>
                      CustomSlices({
                        ...props,
                        inView,
                        mouseMove: handleMouseMove,
                        groupMouseLeave: lineChartOnMouseLeave,
                      }),
                    'mesh',
                  ]}
                  margin={
                    width < pxToNumber(breakpointLg) ? { top: 10, right: 25, bottom: 40, left: 55 } : { top: 10, right: 25, bottom: 30, left: 50 }
                  }
                  xScale={{
                    type: 'linear',
                    min: 1948,
                    max: lastDebtValue.x,
                  }}
                  yScale={{
                    type: 'linear',
                    min: 0,
                    max: 140,
                    stacked: true,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 6,
                    tickPadding: 8,
                    tickRotation: 0,
                    tickValues: 9,
                  }}
                  axisLeft={{
                    format: formatPercentage,
                    orient: 'left',
                    tickSize: 6,
                    tickPadding: 8,
                    tickValues: 8,
                  }}
                  pointLabelYOffset={-12}
                  colors={debtExplainerPrimary}
                  onMouseLeave={lineChartOnMouseLeave}
                />
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={debtExplainerPrimary}>
            <p>
              When adjusted for inflation, the U.S. federal debt has steadily increased since 2001. Without adjusting for inflation, the U.S. federal
              debt has steadily increased since 1957. Another way to view the federal debt over time is to look at the ratio of federal debt related
              to GDP. This ratio has generally increased since 1981.
            </p>
          </VisualizationCallout>
        </div>
      )}
    </>
  );
};
