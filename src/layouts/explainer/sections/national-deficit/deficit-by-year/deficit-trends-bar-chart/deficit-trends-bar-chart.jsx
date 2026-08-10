import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { deficitExplainerPrimary } from '../../national-deficit.module.scss';
import { barChart, container, headerTitle, subHeader, headerContainer, loadingIcon } from './deficit-trends-bar-chart.module.scss';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, fontBodyCopy, fontSize_12, fontSize_14, fontTitle } from '../../../../../../variables.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { endpointUrl, generateTickValues, preAPIData } from './deficit-trends-bar-chart-helpers';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';
import { addInnerChartAriaLabel, applyChartScaling, applyTextScaling } from '../../../../explainer-helpers/explainer-charting-helper';
import { useInView } from 'react-intersection-observer';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';
import { useErrorBoundary } from 'react-error-boundary';
import { useWindowSize } from 'usehooks-ts';

let gaTimerChart;
let ga4Timer;

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

  const { showBoundary } = useErrorBoundary();

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `-$${Math.abs(v)} T`;
    } else {
      return `$${v} T`;
    }
  };

  const chartConfigs = {
    parent: 'deficitTrendsChartParent',
    width: 495,
    height: 388,
    fontSize: desktop ? fontSize_14 : fontSize_12,
    highlightColor: fontTitle,
    animationDuration: 2000,
  };

  const tickStyle = {
    fill: fontBodyCopy,
    fontSize: desktop ? fontSize_14 : fontSize_12,
    fontFamily: 'sans-serif',
  };

  const startingYear = '2001';
  const delayIncrement = 1250;

  const setAnimationDurations = (data, totalValues, totalDuration) => {
    if (data) {
      data.forEach(value => {
        value['duration'] = Math.abs((value.deficit / totalValues) * totalDuration) + 500;
        value['delay'] = 100;
      });
    }
    return data;
  };

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
        const newData = setAnimationDurations(preAPIData.concat(apiData), deficitSum, chartConfigs.animationDuration);
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

  const onBarMouseEnter = useCallback(
    (data, index) => {
      if (data && data.year >= startingYear) {
        setActiveBarIndex(index);
        setHeaderYear(data.year);
        setHeaderDeficit(data.deficit);
      }
    },
    [startingYear]
  );

  const onBarMouseLeave = useCallback(() => {
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

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!!chartData) {
      const initialDelay = delayIncrement + 500;
      let headerDelay = initialDelay;
      let barDelay = initialDelay;
      const chartContainer = document.querySelector(`[data-testid='deficitTrendsChartParent']`);
      if (!chartContainer) return;

      const barSVGs = Array.from(chartContainer.querySelectorAll('.recharts-bar-rectangle path'));

      // Run bar highlight wave
      barSVGs.forEach((bar, index) => {
        const finalBar = barSVGs[barSVGs.length - 1];

        if (inView) {
          setTimeout(() => {
            bar.style.fill = chartConfigs.highlightColor;
          }, (barDelay += delayIncrement / barSVGs.length));

          if (bar !== finalBar) {
            setTimeout(() => {
              bar.style.fill = deficitExplainerPrimary;
            }, barDelay + delayIncrement / barSVGs.length);
          }
        }
      });

      //Run animation for header values
      chartData.forEach(element => {
        if (inView && element.year >= startingYear) {
          setTimeout(() => {
            setHeaderYear(element.year);
            setHeaderDeficit(element.deficit);
          }, (headerDelay += delayIncrement / chartData.length));
        }
      });

      // Set the last bar as active after animation completes
      if (inView) {
        setTimeout(() => {
          setActiveBarIndex(chartData.length - 1);
        }, headerDelay);
      }
    }
  }, [inView, chartData]);

  useEffect(() => {
    getChartData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      applyChartScaling(chartConfigs.parent, chartConfigs.width, chartConfigs.height);
      applyTextScaling(chartConfigs.parent, chartConfigs.width, width, chartConfigs.fontSize);
    });
  }, [width, chartData]);

  useEffect(() => {
    if (!!chartData) {
      addInnerChartAriaLabel(chartConfigs.parent);
      const tickValues = generateTickValues(chartData);
      console.log('X-axis tick values:', tickValues[0]);

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
          ${headerDeficit} {chartData ? 'T' : ''}
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
              onMouseLeave={onBarMouseLeave}
              onBlur={resetHeaderValues}
              data-testid="deficitTrendsChartParent"
              role="presentation"
              ref={ref}
            >
              <BarChart
                width={chartConfigs.width}
                height={chartConfigs.height}
                data={chartData}
                margin={{ top: 15, right: 50, bottom: 15, left: 0 }}
                barCategoryGap={desktop ? '23%' : '26%'}
              >
                <CartesianGrid stroke="#ccc" horizontal={true} vertical={true} />
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
                <Bar dataKey="deficit" onMouseEnter={onBarMouseEnter} isAnimationActive={false} barSize={11}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === activeBarIndex ? chartConfigs.highlightColor : entry.deficitColor} />
                  ))}
                </Bar>
              </BarChart>
            </div>
          )}
        </ChartContainer>
      </div>
    </>
  );
};

export default DeficitTrendsBarChart;
