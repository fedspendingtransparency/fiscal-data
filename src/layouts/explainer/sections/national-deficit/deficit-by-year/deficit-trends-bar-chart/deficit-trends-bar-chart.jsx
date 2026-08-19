import React, { useEffect, useState, useCallback, useRef } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { deficitExplainerPrimary } from '../../national-deficit.module.scss';
import { barChart, container, headerTitle, subHeader, headerContainer, loadingIcon, customGrid } from './deficit-trends-bar-chart.module.scss';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, fontBodyCopy, fontSize_12, fontSize_14, fontTitle } from '../../../../../../variables.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { endpointUrl, generateTickValues, preAPIData } from './deficit-trends-bar-chart-helpers';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';
import { addInnerChartAriaLabel } from '../../../../explainer-helpers/explainer-charting-helper';
import { useInView } from 'react-intersection-observer';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';
import { useErrorBoundary } from 'react-error-boundary';
import { useWindowSize } from 'usehooks-ts';

let gaTimerChart;
let ga4Timer;

// move to own component in future?
export const HeaderSync = ({ active, payload, onActivePoint }) => {
  const point = active && payload && payload.length ? payload[0].payload : null;
  const year = point ? point.year : null;
  const deficit = point ? point.deficit : null;

  useEffect(() => {
    if (year !== null && deficit !== null) {
      onActivePoint(year, deficit);
    }
  }, [year, deficit, onActivePoint]);

  return null;
};

export const DeficitTrendsBarChart = () => {
  const { getGAEvent } = useGAEventTracking(null, 'DeficitExplainer');
  const { width } = useWindowSize();
  const desktop = width >= pxToNumber(breakpointLg);
  const [date, setDate] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [tickValuesX, setTickValuesX] = useState([]);
  const [tickValuesY, setTickValuesY] = useState([]);
  const [mostRecentFiscalYear, setMostRecentFiscalYear] = useState('');
  const [mostRecentDeficit, setMostRecentDeficit] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const [headerYear, setHeaderYear] = useState('--');
  const [headerDeficit, setHeaderDeficit] = useState('--');
  const [shouldAnimate, setShouldAnimate] = useState(false); // chart has scrolled into view
  const [entranceDone, setEntranceDone] = useState(false); // bar growth animation finished
  const [chartFocus, setChartFocus] = useState(false);
  const [chartHover, setChartHover] = useState(false); // separate from focus to prevent mouse/key mix-ups
  const [sweepIndex, setSweepIndex] = useState(null); // bar highlight wave position
  const [waveComplete, setWaveComplete] = useState(false); // wave finished or was skipped; chart is interactive

  const sweepRan = useRef(false);
  const sweepStartTimer = useRef(null);
  const sweepFrame = useRef(null);

  const { showBoundary } = useErrorBoundary();

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `-$${Math.abs(v)} T`;
    } else {
      return `$${v} T`;
    }
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const chartConfigs = {
    parent: 'deficitTrendsChartParent',
    width: 495,
    height: 388,
    fontSize: desktop ? fontSize_14 : fontSize_12,
    highlightColor: fontTitle,
  };

  const tickStyle = {
    fill: fontBodyCopy,
    fontSize: desktop ? fontSize_14 : fontSize_12,
    fontFamily: 'sans-serif',
  };

  const startingYear = '2001';
  const barGrowthAnimation = 1250;
  const delayIncrement = 1250; // total length of the bar highlight wave
  const sweepStartDelay = 150; // beat between bars finishing and the wave kicking off

  const getChartData = () => {
    const apiData = [];
    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then(result => {
        result.data.forEach(entry => {
          const deficitValue = Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000;
          apiData.push({
            year: entry.record_fiscal_year,
            deficit: deficitValue.toFixed(2),
            deficitColor: deficitExplainerPrimary,
          });
        });
        setDate(getDateWithoutTimeZoneAdjust(new Date(result.data[result.data.length - 1].record_date)));
        const newData = preAPIData.concat(apiData);
        const latestYear = newData[newData.length - 1].year;
        const latestDeficit = newData[newData.length - 1].deficit;
        setMostRecentFiscalYear(latestYear);
        setHeaderYear(latestYear);
        setMostRecentDeficit(latestDeficit);
        setHeaderDeficit(latestDeficit);
        setChartData(newData);
      })
      .catch(err => {
        showBoundary(err);
      });
  };

  const handleActivePoint = useCallback((year, deficit) => {
    setHeaderYear(year);
    setHeaderDeficit(deficit);
  }, []);

  const resetHeaderValues = useCallback(() => {
    setHeaderYear(mostRecentFiscalYear);
    setHeaderDeficit(mostRecentDeficit);
  }, [mostRecentFiscalYear, mostRecentDeficit]);

  const stopSweep = useCallback(() => {
    clearTimeout(sweepStartTimer.current);
    cancelAnimationFrame(sweepFrame.current);
    setSweepIndex(null);
    setWaveComplete(true);
  }, []);

  const handleChartBlur = useCallback(
    e => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setChartFocus(false);
        resetHeaderValues();
      }
    },
    [resetHeaderValues]
  );

  const handleChartMouseLeave = useCallback(() => {
    setChartHover(false);
    resetHeaderValues();
  }, [resetHeaderValues]);

  const handleGoogleAnalyticsMouseEnter = () => {
    const gaEvent = getGAEvent('30');
    gaTimerChart = setTimeout(() => {
      gaEvent &&
        Analytics.event({
          category: gaEvent.eventCategory.replace('Fiscal Data - ', ''),
          action: gaEvent.eventAction,
          label: gaEvent.eventLabel,
        });
    }, 3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'chart-hover-deficit-trends',
      });
    }, 3000);
  };

  const handleGoogleAnalyticsMouseLeave = () => {
    clearTimeout(gaTimerChart);
    clearTimeout(ga4Timer);
  };

  useEffect(() => {
    if (inView && chartData) {
      setShouldAnimate(true);
    }
  }, [inView, chartData]);

  useEffect(() => {
    if (!!chartData && shouldAnimate) {
      const timer = setTimeout(() => setEntranceDone(true), barGrowthAnimation + 100);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, chartData]);

  // Run bar highlight wave
  useEffect(() => {
    if (!chartData || !entranceDone || sweepRan.current) return;
    const sweepData = chartData.filter(entry => entry.year >= startingYear);

    sweepRan.current = true;

    if (!sweepData.length) {
      setWaveComplete(true);
      return;
    }

    const offset = chartData.length - sweepData.length;
    const step = delayIncrement / sweepData.length;

    // Index is derived from elapsed time rather than counted up, so a slow frame
    // skips a bar instead of pushing every remaining step back
    sweepStartTimer.current = setTimeout(() => {
      const start = performance.now();
      setSweepIndex(offset);
      const tick = now => {
        const i = Math.floor((now - start) / step);
        if (i >= sweepData.length) {
          stopSweep(); // final bar handed off to the idle highlight
          return;
        }
        setSweepIndex(offset + i);
        sweepFrame.current = requestAnimationFrame(tick);
      };
      sweepFrame.current = requestAnimationFrame(tick);
    }, sweepStartDelay);

    return () => {
      clearTimeout(sweepStartTimer.current);
      cancelAnimationFrame(sweepFrame.current);
    };
  }, [chartData, entranceDone, stopSweep]);

  // Run animation for header values
  useEffect(() => {
    if (sweepIndex === null || !chartData) return;
    setHeaderYear(chartData[sweepIndex].year);
    setHeaderDeficit(chartData[sweepIndex].deficit);
  }, [sweepIndex, chartData]);

  // Keyboard users skip the wave rather than waiting it out
  useEffect(() => {
    if (!chartFocus || waveComplete) return;
    stopSweep();
    resetHeaderValues();
  }, [chartFocus, waveComplete, stopSweep, resetHeaderValues]);

  useEffect(() => {
    getChartData();
  }, []);

  useEffect(() => {
    if (!!chartData) {
      addInnerChartAriaLabel(chartConfigs.parent);
      const tickValues = generateTickValues(chartData);

      setMinValue(tickValues[1][0]);
      setMaxValue(tickValues[1][tickValues[1].length - 1]);
      setTickValuesX(tickValues[0]);
      setTickValuesY(tickValues[1]);
    }
  }, [chartData]);

  const idle = !chartHover && !chartFocus;
  const highlightYear = chartData && sweepIndex !== null ? chartData[sweepIndex].year : waveComplete && idle ? mostRecentFiscalYear : null;

  const { mtsSummary } = explainerCitationsMap['national-deficit'];

  const footer = (
    <div>
      Visit the {mtsSummary} dataset to explore and download this data.
      <p>Please note: This data visual only includes completed fiscal years.</p>
    </div>
  );

  const header = (
    <div className={headerContainer}>
      <div>
        <div className={headerTitle} data-testid="deficitFiscalYearHeader">
          {headerYear}
        </div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
      <div>
        <div className={headerTitle} data-testid="deficitTotalHeader">
          {chartData ? `$${headerDeficit} T` : `$${headerDeficit}`}
        </div>
        <span className={subHeader}>Total Deficit</span>
      </div>
    </div>
  );

  return (
    <>
      <div className={container} onMouseEnter={handleGoogleAnalyticsMouseEnter} onMouseLeave={handleGoogleAnalyticsMouseLeave} role="presentation">
        <ChartContainer
          title={`Federal Deficit Trends Over Time, FY ${startingYear || '--'}-${mostRecentFiscalYear || '--'}`}
          altText={
            `Bar graph that shows the federal deficit trend from ${startingYear} to ` +
            `${mostRecentFiscalYear}. Over the years, the data fluctuates with a spiked increase starting in 2019.`
          }
          header={header}
          footer={footer}
          date={date}
        >
          {!chartData ? (
            <LoadingIndicator loadingClass={loadingIcon} />
          ) : (
            <div
              className={barChart}
              data-testid="deficitTrendsChartParent"
              role="presentation"
              ref={ref}
              onFocus={() => setChartFocus(true)}
              onBlur={handleChartBlur}
              onMouseOver={() => setChartHover(true)}
              onMouseLeave={handleChartMouseLeave}
              style={{ pointerEvents: entranceDone && waveComplete ? 'auto' : 'none' }}
            >
              {shouldAnimate && (
                <ResponsiveContainer width="100%" height={388}>
                  <BarChart
                    width={chartConfigs.width}
                    height={chartConfigs.height}
                    data={chartData}
                    margin={{ top: 15, right: 15, bottom: 15, left: 0 }}
                    accessibilityLayer
                  >
                    <CartesianGrid stroke="#ccc" horizontal={true} vertical={true} className={customGrid} />
                    <XAxis
                      dataKey="year"
                      tick={tickStyle}
                      tickLine={false}
                      axisLine={false}
                      ticks={tickValuesX}
                      interval={0}
                      padding={{ left: 0, right: 0 }}
                    />
                    <YAxis
                      tick={tickStyle}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatCurrency}
                      ticks={tickValuesY}
                      domain={[minValue, maxValue]}
                    />
                    <Tooltip
                      content={<HeaderSync onActivePoint={handleActivePoint} />}
                      cursor={false}
                      isAnimationActive={false}
                      active={waveComplete && (chartFocus || chartHover)}
                    />
                    <Bar
                      dataKey="deficit"
                      isAnimationActive={!entranceDone}
                      animationBegin={0}
                      animationDuration={barGrowthAnimation}
                      animationEasing="ease-out"
                      barSize={desktop ? 11 : 8}
                      fill={deficitExplainerPrimary}
                      activeBar={waveComplete ? { fill: chartConfigs.highlightColor } : false}
                    >
                      {chartData.map(entry => (
                        <Cell key={entry.year} fill={entry.year === highlightYear ? chartConfigs.highlightColor : deficitExplainerPrimary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </ChartContainer>
      </div>
    </>
  );
};

export default DeficitTrendsBarChart;
