import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, debtExplainerPrimary } from '../../../../../../variables.module.scss';
import React, { useEffect, useState } from 'react';
import Analytics from '../../../../../../utils/analytics/analytics';
import { container, header, headerContainer, lineChartContainer, loadingIcon, subHeader } from './debt-trends-over-time-chart.module.scss';
import { visWithCallout } from '../../../../explainer.module.scss';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ZIndexLayer } from 'recharts';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import { formatPercentage } from '../../../../explainer-helpers/explainer-charting-helper';
import { axisConfigs, Crosshair, getTicks, HoverPoint, subtractAxisThickness } from '../../../../explainer-helpers/explainer-recharts-helper';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { debtOutstandingData } from '../../../../../../recoil/debtOutstandingDataState';
import { useInView } from 'react-intersection-observer';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { getChangeLabel } from '../../../../heros/hero-helper';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';

let gaTimerDebtTrends;
let ga4Timer;

const axisStartYear = 1940;
const decade = 10;
const percentInterval = 20;
const mobileTickInterval = 15;

const getAxisEndYear = lastYear => Math.ceil(lastYear / decade) * decade;

const getMaxPercent = data => Math.ceil(Math.max(...data.map(({ y }) => y)) / percentInterval) * percentInterval;

const getMobileTicks = endYear => {
  const ticks = [];
  for (let year = axisStartYear; year <= endYear; year += mobileTickInterval) {
    ticks.push(year);
  }
  return ticks;
};

const chartConfigs = {
  ...axisConfigs,
  tickSize: 6,
  tickMargin: 8,
};

const getChartMargin = isMobile =>
  subtractAxisThickness(isMobile ? { top: 10, right: 25, bottom: 40, left: 55 } : { top: 10, right: 25, bottom: 30, left: 50 });

const desktopTickCount = 9;

export const DebtTrendsOverTimeChart = ({ sectionId, beaGDPData, width }) => {
  const [lineChartHoveredYear, setLineChartHoveredYear] = useState('');
  const [lineChartHoveredValue, setLineChartHoveredValue] = useState('');
  const [debtTrendsData, setDebtTrendsData] = useState([]);
  const [isLoadingDebtTrends, setIsLoadingDebtTrends] = useState(true);
  const [lastDebtValue, setLastDebtValue] = useState({});
  const [lastRawDebtValue, setLastRawDebtValue] = useState('');
  const [lastGDPValue, setLastGDPValue] = useState('');
  const [defaultIndex, setDefaultIndex] = useState(null);
  const [animationTriggeredOnce, setAnimationTriggeredOnce] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [chartFocus, setChartFocus] = useState(false);
  const [chartHover, setChartHover] = useState(false);
  const payload = debtOutstandingData(state => state.payload);
  const status = debtOutstandingData(state => state.status);
  const refreshIfStale = debtOutstandingData(state => state.refreshIfStale);

  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const chartParent = 'debtTrendsChart';
  const chartWidth = 550;
  const chartHeight = 490;

  const { bea, historicalDebt } = explainerCitationsMap['national-debt'];

  const processData = () => {
    const { finalGDPData } = beaGDPData;
    const debtData = payload;
    const lastGDPValue = finalGDPData[finalGDPData.length - 1];
    const debtToGDP = [];
    const lastRawDebtMatchedValue = debtData.find(entry => entry.record_date.includes(lastGDPValue.fiscalYear));
    finalGDPData.forEach(GDPEntry => {
      const record = debtData.find(entry => entry.record_date.includes(GDPEntry.fiscalYear));
      if (record) {
        debtToGDP.push({
          x: GDPEntry.x,
          y: Math.round((parseFloat(record.debt_outstanding_amt) / GDPEntry.actual) * 100),
        });
      }
    });
    setDebtTrendsData(debtToGDP);
    setLastDebtValue(debtToGDP[debtToGDP.length - 1]);
    if (lastRawDebtMatchedValue) setLastRawDebtValue(lastRawDebtMatchedValue.debt_outstanding_amt);
    setLastGDPValue(lastGDPValue);
    setIsLoadingDebtTrends(false);
  };

  useEffect(() => {
    if (status === 'hasValue' && payload) {
      processData();
    }
  }, [status, payload]);

  const handleActiveDatumChange = datum => {
    setLineChartHoveredYear(datum ? datum.x : '');
    setLineChartHoveredValue(datum ? formatPercentage(datum.y) : '');
  };

  useEffect(() => {
    if (inView && debtTrendsData?.length && !animationTriggeredOnce) {
      setAnimationTriggeredOnce(true);
      const stepDuration = 50;
      const timers = [];

      debtTrendsData.forEach((point, index) => {
        timers.push(
          setTimeout(() => {
            setDefaultIndex(index);
          }, stepDuration * index + 550)
        );
      });
      timers.push(
        setTimeout(() => {
          setDefaultIndex(null);
          setAnimationComplete(true);
        }, stepDuration * debtTrendsData.length + 550)
      );
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [inView, debtTrendsData]);

  const chartActive = chartFocus || chartHover || !animationComplete;

  const handleMouseEnterLineChart = () => {
    setChartHover(true);
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
    setChartHover(false);
    clearTimeout(gaTimerDebtTrends);
    clearTimeout(ga4Timer);
  };

  const headerContent = () => {
    const yearDisplay = lastDebtValue.x === undefined ? '--' : lineChartHoveredYear === '' ? lastDebtValue.x : lineChartHoveredYear;
    const debtToGDPDisplay = lastDebtValue.y === undefined ? '--%' : lineChartHoveredValue === '' ? lastDebtValue.y + '%' : lineChartHoveredValue;
    return (
      <div className={headerContainer}>
        <div>
          <div className={header} data-testid="debtTrendsYearHeader">
            {yearDisplay}
          </div>
          <span className={subHeader}>Fiscal Year</span>
        </div>
        <div>
          <div className={header} data-testid="debtTrendsValueHeader">
            {debtToGDPDisplay}
          </div>
          <span className={subHeader}>Debt to GDP</span>
        </div>
      </div>
    );
  };

  const footerContent = (
    <>
      <p>
        Visit the {historicalDebt} dataset to explore and download this data. The GDP data is sourced from the {bea}.
      </p>
      <p>Please note: This chart is updated as new GDP data is released, even if new debt data is available.</p>
    </>
  );

  const isMobile = width < pxToNumber(breakpointLg);
  const axisEndYear = lastDebtValue.x ? getAxisEndYear(lastDebtValue.x) : axisStartYear;
  const maxPercent = debtTrendsData.length ? getMaxPercent(debtTrendsData) : percentInterval;

  return (
    <>
      {debtTrendsData && (
        <figure className={visWithCallout} ref={ref}>
          <div className={container}>
            <ChartContainer
              title={`Federal Debt Trends Over Time, FY 1948 – ${lastDebtValue.x ?? '--'}`}
              subTitle="Debt to Gross Domestic Product (GDP)"
              header={headerContent()}
              footer={footerContent}
              date={lastDebtValue?.x ? getDateWithoutTimeZoneAdjust(`${lastDebtValue.x}-09-30`) : null}
              altText={`Line graph displaying the federal debt to GDP trend over time from ${debtTrendsData[0]?.x ?? '--'} to ${lastDebtValue.x}.`}
            >
              {isLoadingDebtTrends ? (
                <LoadingIndicator loadingClass={loadingIcon} />
              ) : (
                <div
                  className={lineChartContainer}
                  style={{ pointerEvents: animationComplete ? 'auto' : 'none' }}
                  data-testid={`${chartParent}`}
                  onMouseEnter={handleMouseEnterLineChart}
                  onMouseLeave={handleMouseLeaveLineChart}
                  onFocus={() => setChartFocus(true)}
                  onBlur={() => setChartFocus(false)}
                  id="debt-trends"
                  role="presentation"
                >
                  <ResponsiveContainer width="100%" aspect={chartWidth / chartHeight} initialDimension={{ width: chartWidth, height: chartHeight }}>
                    <LineChart data={debtTrendsData} margin={getChartMargin(isMobile)} aria-label="Inner chart area">
                      <Tooltip
                        active={chartActive}
                        defaultIndex={defaultIndex ?? undefined}
                        content={() => null}
                        cursor={false}
                        isAnimationActive={false}
                        wrapperStyle={{ display: 'none' }}
                      />
                      <Crosshair />
                      <XAxis
                        dataKey="x"
                        type="number"
                        domain={[axisStartYear, axisEndYear]}
                        ticks={isMobile ? getMobileTicks(axisEndYear) : getTicks(axisStartYear, axisEndYear, desktopTickCount)}
                        interval={0}
                        height={chartConfigs.axisThickness}
                        tickSize={chartConfigs.tickSize}
                        tickMargin={chartConfigs.tickMargin}
                        axisLine={chartConfigs.axisLine}
                        tickLine={chartConfigs.tickLine}
                        tick={chartConfigs.tick}
                        zIndex={chartConfigs.zIndex.axis}
                      />
                      <YAxis
                        dataKey="y"
                        type="number"
                        domain={[0, maxPercent]}
                        ticks={getTicks(0, maxPercent, 8)}
                        interval={0}
                        width={chartConfigs.axisThickness}
                        tickFormatter={formatPercentage}
                        tickSize={chartConfigs.tickSize}
                        tickMargin={chartConfigs.tickMargin}
                        axisLine={chartConfigs.axisLine}
                        tickLine={chartConfigs.tickLine}
                        tick={chartConfigs.tick}
                        zIndex={chartConfigs.zIndex.axis}
                      />
                      <Line
                        dataKey="y"
                        type="linear"
                        stroke={debtExplainerPrimary}
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                        isAnimationActive={false}
                      />
                      <ZIndexLayer zIndex={chartConfigs.zIndex.point}>
                        <HoverPoint data={debtTrendsData} onActiveChange={handleActiveDatumChange} />
                      </ZIndexLayer>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartContainer>
          </div>
          <VisualizationCallout color={debtExplainerPrimary}>
            <p>
              The average GDP for fiscal year {lastDebtValue.x || '--'} was ${lastGDPValue ? getShortForm(lastGDPValue.actual) : '--'}, which was{' '}
              {lastGDPValue ? getChangeLabel(lastGDPValue.actual, lastRawDebtValue, true) : '--'} the U.S. debt of $
              {lastRawDebtValue ? getShortForm(lastRawDebtValue) : '--'}. This resulted in a Debt to GDP Ratio of {lastDebtValue.y || '--'} percent.
              Generally, a higher Debt to GDP ratio indicates a government will have greater difficulty in repaying its debt.
            </p>
          </VisualizationCallout>
        </figure>
      )}
    </>
  );
};
