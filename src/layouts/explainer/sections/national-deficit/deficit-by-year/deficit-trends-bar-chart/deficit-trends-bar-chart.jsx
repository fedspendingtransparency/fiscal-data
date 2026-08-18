import React, { useEffect, useState, useCallback, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
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

const CustomBar = props => {
  const { x, y, width, height, index, payload, activeIndex, onActivate, onFocusBar } = props;
  const actualHeight = Math.abs(height);
  const actualY = height < 0 ? y + height : y;

  return (
    <rect
      data-testid="customBar"
      data-bar-index={index}
      tabIndex={0}
      onMouseOver={() => onActivate(index)}
      onFocus={() => onFocusBar(index, payload)}
      x={x}
      y={actualY}
      width={width}
      height={actualHeight}
      fill={index === activeIndex ? fontTitle : deficitExplainerPrimary}
      style={{ outline: 'none' }}
    />
  );
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
  const [activeBarIndex, setActiveBarIndex] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false); // tied to when chart is in view
  const [animationsComplete, setAnimationsComplete] = useState(false); // controls hover effects
  const [entranceDone, setEntranceDone] = useState(false); // bar growth animation finished

  const pointerInsideRef = useRef(true);

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
  const barSequenceAnimation = 1500;

  const getChartData = () => {
    const apiData = [];
    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then(result => {
        let deficitSum = 0;
        result.data.forEach(entry => {
          const deficitValue = Math.abs(parseFloat(entry.current_fytd_net_outly_amt)) / 1000000000000;
          deficitSum += deficitValue;
          apiData.push({
            year: entry.record_fiscal_year,
            deficit: deficitValue.toFixed(2),
            deficitColor: deficitExplainerPrimary,
          });
        });
        preAPIData.forEach(entry => {
          deficitSum += Math.abs(entry.deficit);
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

  const resetHeaderValues = useCallback(() => {
    setHeaderYear(mostRecentFiscalYear);
    setHeaderDeficit(mostRecentDeficit);
    setActiveBarIndex(chartData ? chartData.length - 1 : null);
  }, [mostRecentFiscalYear, mostRecentDeficit, chartData]);

  const handleBarActivate = useCallback(
    rawIndex => {
      if (!animationsComplete) return;
      const index = Number(rawIndex);
      if (Number.isNaN(index)) return;
      const data = chartData[index];
      if (data && data.year >= startingYear && data.deficit !== '') {
        setActiveBarIndex(index);
        setHeaderYear(data.year);
        setHeaderDeficit(data.deficit);
      }
    },
    [chartData, startingYear, animationsComplete]
  );

  const onFocusBar = useCallback((index, payload) => {
    if (!payload) return;

    document.querySelectorAll('[data-bar-index]').forEach(el => {
      el.style.fill = Number(el.dataset.barIndex) === index ? fontTitle : deficitExplainerPrimary;
    });

    const yearEl = document.querySelector(`[data-testid='deficitFiscalYearHeader']`);
    const deficitEl = document.querySelector(`[data-testid='deficitTotalHeader']`);
    if (yearEl) yearEl.textContent = payload.year;
    if (deficitEl) deficitEl.textContent = `$${payload.deficit} T`;
  }, []);

  const onChartMouseMove = useCallback(
    e => {
      if (!pointerInsideRef.current) return;
      if (e && e.activeTooltipIndex !== undefined) {
        handleBarActivate(e.activeTooltipIndex);
      }
    },
    [handleBarActivate]
  );

  const onBarMouseLeave = useCallback(() => {
    pointerInsideRef.current = false;
    if (!animationsComplete) return;
    resetHeaderValues();
  }, [resetHeaderValues, animationsComplete]);

  const onChartBlur = useCallback(
    e => {
      if (!animationsComplete) return;
      if (!e.currentTarget.contains(e.relatedTarget)) {
        resetHeaderValues();
      }
    },
    [animationsComplete, resetHeaderValues]
  );

  const handleGoogleAnalyticsMouseEnter = () => {
    pointerInsideRef.current = true;
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
      let sequentialDelay = barGrowthAnimation;
      const delayPerBar = barSequenceAnimation / chartData.length;
      setTimeout(() => setEntranceDone(true), barGrowthAnimation);

      // highlight wave: steps the grey bar across the chart after growth finishes
      chartData.forEach((element, index) => {
        if (element.year >= startingYear) {
          setTimeout(() => {
            setActiveBarIndex(index);
            setHeaderYear(element.year);
            setHeaderDeficit(element.deficit);
          }, (sequentialDelay += delayPerBar));
        }
      });

      // settle on the most recent year and enable hover
      setTimeout(() => {
        setActiveBarIndex(chartData.length - 1);
        setHeaderYear(mostRecentFiscalYear);
        setHeaderDeficit(mostRecentDeficit);
        setAnimationsComplete(true);
      }, sequentialDelay + 100);
    }
  }, [shouldAnimate, chartData, mostRecentFiscalYear, mostRecentDeficit]);

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
              onMouseLeave={animationsComplete ? onBarMouseLeave : undefined}
              onBlur={onChartBlur}
              data-testid="deficitTrendsChartParent"
              role="presentation"
              ref={ref}
              style={{ pointerEvents: animationsComplete ? 'auto' : 'none' }}
            >
              {shouldAnimate && (
                <ResponsiveContainer width="100%" height={388}>
                  <BarChart
                    width={chartConfigs.width}
                    height={chartConfigs.height}
                    data={chartData}
                    margin={{ top: 15, right: 15, bottom: 15, left: 0 }}
                    onMouseMove={animationsComplete ? onChartMouseMove : undefined}
                    onBarMouseLeave={animationsComplete ? onBarMouseLeave : undefined}
                  >
                    <CartesianGrid stroke="#ccc" horizontal={true} vertical={true} className={customGrid} />
                    {/* renders nothing, but Recharts 3 needs a Tooltip present to track activeTooltipIndex */}
                    <Tooltip content={() => null} cursor={false} isAnimationActive={false} />
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
                    <Bar
                      dataKey="deficit"
                      isAnimationActive={!entranceDone}
                      animationBegin={0}
                      animationDuration={barGrowthAnimation}
                      animationEasing="ease-out"
                      barSize={desktop ? 11 : 8}
                      fill={deficitExplainerPrimary}
                      activeBar={false}
                      // shape lets us render our own bars instead of the stock Recharts rectangles
                      shape={<CustomBar activeIndex={activeBarIndex} onActivate={handleBarActivate} onFocusBar={onFocusBar} />}
                    />
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
