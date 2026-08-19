import React, { useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { dataHeader, getChartCopy } from './total-spending-chart-helper';
import { visWithCallout } from '../../../../explainer.module.scss';
import VisualizationCallout
  from '../../../../../../components/visualization-callout/visualization-callout';
import { spendingExplainerPrimary } from '../../federal-spending.module.scss';
import { container, lineChart, loadingIcon } from './total-spending-chart.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import simplifyNumber from '../../../../../../helpers/simplify-number/simplifyNumber';
import {
  adjustDataForInflation
} from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';
import { chartInViewProps } from '../../../../explainer-helpers/explainer-charting-helper';
import { useInView } from 'react-intersection-observer';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';
import { useErrorBoundary } from 'react-error-boundary';
import numeral from 'numeral';
import {
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Point from '../../../../../../components/nivo/custom-point/point';

const callOutDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year' +
  '&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1';

const chartDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year' +
  '&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date';

let gaTimer;
let ga4Timer;

const TotalSpendingChart = ({ cpiDataByYear, beaGDPData, copyPageData }) => {
  const [gdpChartData, setGdpChartData] = useState([]);
  const [gdpRatioChartData, setRatioGdpChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState(2015);
  const [maxYear, setMaxYear] = useState(2022);
  const [maxAmount, setMaxAmount] = useState(0);
  const [callOutYear, setCallOutYear] = useState('');
  const [lastRatio, setLastRatio] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const [lastGDPValue, setLastGDPValue] = useState('');
  const [lastSpendingValue, setLastSpendingValue] = useState('');
  const [maxSpendingValue, setMaxSpendingValue] = useState(0);
  const [maxGDPValue, setMaxGDPValue] = useState(0);
  const [selectedChartView, setSelectedChartView] = useState('totalSpending');
  const [animationTriggeredOnce, setAnimationTriggeredOnce] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [secondaryAnimationComplete, setSecondaryAnimationComplete] = useState(false);
  const [secondaryAnimationTriggeredOnce, setSecondaryAnimationTriggeredOnce] = useState(false);
  const [calloutCopy, setCalloutCopy] = useState('');
  const [chartFocus, setChartFocus] = useState(false);
  const [chartHover, setChartHover] = useState(false);
  const [chartActive, setChartActive] = useState(false);

  const [curFY, setCurFY] = useState('--');
  const [curSpending, setCurSpending] = useState();
  const [curGDP, setCurGDP] = useState();
  const [curPercentGDP, setCurPercentGDP] = useState();

  const [defaultIndex, setDefaultIndex] = useState(0);
  const [secondaryDefaultIndex, setSecondaryDefaultIndex] = useState(0);

  const chartTheme = {
    height: 418,
    margin: { top: 12, bottom: 0, left: -12, right: 12 },
    axis: { fontSize: 14 },
    tick: { fill: '#555' },
    line: { stroke: '#666' },
    cursor: { strokeDasharray: '6 6', stroke: '#555', strokeWidth: 2 },
  };

  const { ref: spendingRef, inView: spendingInView } = useInView(chartInViewProps);
  const { ref: gdpRef, inView: gdpInView } = useInView(chartInViewProps);

  const { getGAEvent } = useGAEventTracking(null, 'SpendingExplainer');
  const { showBoundary } = useErrorBoundary();

  const handleClick = eventNumber => {
    const gaEvent = getGAEvent(eventNumber);
    Analytics.event({
      category: gaEvent?.eventCategory?.replace('Fiscal Data - ', ''),
      action: gaEvent?.eventAction,
      label: gaEvent?.eventLabel,
    });
  };

  useEffect(() => {
    basicFetch(callOutDataEndPoint).then(res => {
      if (res.data && res.data.length > 0) {
        setCallOutYear(res.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {
    const { finalGDPData, gdpMaxYear, gdpMaxAmount } = beaGDPData || {};

    basicFetch(chartDataEndPoint)
      .then(res => {
        if (res.data && res.data.length > 0) {
          let finalSpendingChartData = [];

          res.data.forEach(spending => {
            finalSpendingChartData.push({
              x: parseInt(spending.record_fiscal_year),
              actual_spending: parseInt(spending.current_fytd_net_outly_amt),
              fiscalYear: spending?.record_fiscal_year,
              record_date: spending?.record_date,
            });
          });

          finalSpendingChartData = finalSpendingChartData.filter(s => s.x <= gdpMaxYear);

          const lastUpdatedDateSpending = new Date(finalSpendingChartData[finalSpendingChartData.length - 1]?.record_date);
          setLastUpdatedDate(getDateWithoutTimeZoneAdjust(lastUpdatedDateSpending));

          finalSpendingChartData = adjustDataForInflation(finalSpendingChartData, 'actual_spending', 'fiscalYear', cpiDataByYear);

          finalSpendingChartData.forEach(spending => {
            spending.spending_y = parseFloat(simplifyNumber(spending.actual_spending, false).slice(0, -2));
          });

          const spendingMinYear = finalSpendingChartData[0].x;
          const theMinYear = spendingMinYear;
          setMinYear(theMinYear);

          const spendingMaxYear = finalSpendingChartData[finalSpendingChartData.length - 1].x;
          const theMaxYear = Math.min(gdpMaxYear, spendingMaxYear);
          setMaxYear(theMaxYear);

          const spendingMaxAmount = finalSpendingChartData.reduce((max, spending) => (max > spending.spending_y ? max : spending.spending_y));

          setMaxSpendingValue(spendingMaxAmount);

          const filteredGDPData = finalGDPData.filter(g => g.fiscalYear <= spendingMaxYear && g.fiscalYear >= spendingMinYear);
          const rename = [];
          filteredGDPData.forEach(data => {
            rename.push({ actual_gdp: data.actual, gdp_y: data.y, x: data.x, fiscalYear: data.fiscalYear });
          });
          const finalGdpRatioChartData = [];
          finalSpendingChartData.forEach(spending => {
            const spendingYear = spending.fiscalYear;
            const spendingAmount = spending.spending_y;
            const matchingGDP = rename.filter(g => g.fiscalYear === spendingYear).map(g => g.gdp_y)[0];
            const gdpRatio = spendingAmount / matchingGDP;

            finalGdpRatioChartData.push({
              x: parseInt(spendingYear),
              y: gdpRatio,
            });
          });

          setRatioGdpChartData(finalGdpRatioChartData);

          const maxAmountLocal = Math.ceil((spendingMaxAmount > gdpMaxAmount ? spendingMaxAmount : gdpMaxAmount) / 5) * 5;
          setMaxAmount(maxAmountLocal);

          const chartFirstRatio = finalSpendingChartData[0].spending_y / rename[0].gdp_y;
          const chartLastRatio = finalSpendingChartData[finalSpendingChartData.length - 1].spending_y / rename[rename.length - 1].gdp_y;
          setLastRatio(chartLastRatio);

          if (chartFirstRatio !== chartLastRatio) {
            setCalloutCopy(
              ` the Spending to GDP ratio has ${chartLastRatio > chartFirstRatio ? 'increased' : 'decreased'} from ${numeral(chartFirstRatio).format(
                '0%'
              ) || '--'} to ${numeral(chartLastRatio).format('0%') || '--'}`
            );
          } else {
            setCalloutCopy(`the Spending to GDP ratio has not changed, remaining at ${chartFirstRatio}`);
          }

          const chartLastSpendingValue = finalSpendingChartData[finalSpendingChartData.length - 1].actual_spending;
          setLastSpendingValue(chartLastSpendingValue);

          const chartLastGDPValue = rename[rename.length - 1].actual_gdp;
          setLastGDPValue(chartLastGDPValue);

          setCurFY(spendingMaxYear);
          setCurSpending(simplifyNumber(chartLastSpendingValue, false));
          setCurGDP(simplifyNumber(chartLastGDPValue, false));
          setCurPercentGDP(chartLastRatio);

          const chartMaxGDPValue = rename.reduce((max, gdp) => (max.x > gdp.x ? max.gdp_y : gdp.gdp_y));

          setMaxGDPValue(chartMaxGDPValue);
          const chartData_combined = [];

          rename.forEach((data, index) => {
            chartData_combined.push({ ...data, ...finalSpendingChartData[index] });
          });
          setGdpChartData(chartData_combined);

          copyPageData({
            fiscalYear: theMaxYear,
            totalSpending: getShortForm(chartLastSpendingValue, false),
            percentOfGDP: chartLastRatio,
            numOfYearsInChart: theMaxYear - theMinYear + 1,
          });
        }
      })
      .catch(err => {
        showBoundary(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const chartToggleConfig = {
    selectedChartView,
    setSelectedChartView,
  };

  const handleMouseEnter = () => {
    setChartHover(true);
    gaTimer = setTimeout(() => {
      handleClick('20');
    }, 3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'chart-hover-total-spending',
      });
    }, 3000);
  };

  const handleGroupOnMouseLeave = () => {
    setCurFY(maxYear.toString());
    setCurSpending(simplifyNumber(lastSpendingValue, false));
    setCurGDP(simplifyNumber(lastGDPValue, false));
    setCurPercentGDP(lastRatio);
  };

  const updateDataHeader = payload => {
    if (selectedChartView === 'totalSpending') {
      const spendingData = payload[0]?.payload?.actual_spending;
      const gdpData = payload[0]?.payload?.actual_gdp;
      if (spendingData && gdpData) {
        setCurFY(payload[0].payload.fiscalYear);
        setCurSpending(simplifyNumber(spendingData, false));
        setCurGDP(simplifyNumber(gdpData, false));
      }
    } else if (selectedChartView === 'percentageGdp') {
      const percentData = payload[0]?.payload?.y;
      if (percentData) {
        setCurFY(payload[0]?.payload?.x);
        setCurPercentGDP(percentData);
      }
    }
  };

  const { title: chartTitle, subtitle: chartSubtitle, footer: chartFooter, altText: chartAltText } = getChartCopy(
    minYear,
    maxYear,
    selectedChartView
  );

  const CustomTooltip = ({ payload = [] }) => {
    if (payload.length > 0) {
      updateDataHeader(payload);
    }
    return <></>;
  };

  useEffect(() => {
    if (spendingInView && gdpChartData.length && !animationTriggeredOnce) {
      setAnimationTriggeredOnce(true);
      const stepDuration = 500;
      const timers = [];

      gdpChartData.forEach((slice, index) => {
        timers.push(
          setTimeout(() => {
            setDefaultIndex(index);
          }, stepDuration * index + 550)
        );
      });
      setTimeout(() => {
        setAnimationComplete(true);
      }, stepDuration * gdpChartData.length + 550);
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [spendingInView]);

  useEffect(() => {
    if (gdpInView && gdpRatioChartData.length && !secondaryAnimationTriggeredOnce) {
      setSecondaryAnimationTriggeredOnce(true);
      const stepDuration = 500;
      const timers = [];

      gdpRatioChartData.forEach((slice, index) => {
        timers.push(
          setTimeout(() => {
            setSecondaryDefaultIndex(index);
          }, stepDuration * index + 550)
        );
      });
      setTimeout(() => {
        setSecondaryAnimationComplete(true);
      }, stepDuration * gdpChartData.length + 550);
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [gdpInView]);

  const HoverPoint = payload => {
    const { cx, cy, strokeWidth, label, active } = payload;
    return (
      <g data-testid="customPoints">
        {payload?.cx && <Point currentPoint={{ x: cx, y: cy, r: 1.5, strokeWidth: strokeWidth, opacity: !active && chartActive ? 0 : 1 }} />}
        {label && (
          <text
            x={cx - 5}
            y={cy + 30}
            style={{ fontSize: '12px', fontFamily: '"Source Sans Pro", sans-serif', fill: '#666', fontWeight: '600', textAnchor: 'end' }}
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  useEffect(() => {
    setChartActive(chartFocus || chartHover || (selectedChartView === 'totalSpending' ? !animationComplete : !secondaryAnimationComplete));
  }, [chartHover, chartFocus, animationComplete, secondaryAnimationComplete, selectedChartView]);

  useEffect(() => {
    if (!chartActive && animationComplete) {
      handleGroupOnMouseLeave();
    }
  }, [chartActive]);
  return (
    <>
      {chartToggleConfig && (
        <figure className={visWithCallout}>
          <div className={container} style={{}}>
            <ChartContainer
              title={chartTitle}
              subTitle={chartSubtitle}
              footer={chartFooter}
              header={dataHeader(
                chartToggleConfig,
                { fiscalYear: curFY, totalSpending: curSpending, gdp: curGDP, gdpRatio: numeral(curPercentGDP).format('0%') },
                handleClick
              )}
              date={lastUpdatedDate}
              altText={chartAltText}
            >
              {isLoading ? (
                <LoadingIndicator loadingClass={loadingIcon} />
              ) : (
                <div
                  className={lineChart}
                  data-testid="chartParent"
                  onMouseEnter={handleMouseEnter}
                  onFocus={() => setChartFocus(true)}
                  onBlur={() => setChartFocus(false)}
                  onMouseLeave={() => {
                    setChartHover(false);
                    clearTimeout(gaTimer);
                    clearTimeout(ga4Timer);
                  }}
                  role="presentation"
                >
                  {selectedChartView === 'totalSpending' && (
                    <div data-testid="spendingLineChart" ref={spendingRef} style={{ pointerEvents: !animationComplete ? 'none' : 'auto' }}>
                      <ResponsiveContainer height={chartTheme.height} width="99%">
                        <LineChart data={gdpChartData} margin={chartTheme.margin} accessibilityLayer>
                          <XAxis dataKey="x" fontSize={chartTheme.axis.fontSize} tick={{ ...chartTheme.axis.tick }} />
                          <YAxis
                            tick={{ ...chartTheme.axis.tick }}
                            fontSize={chartTheme.axis.fontSize}
                            domain={[0, maxAmount]}
                            tickFormatter={value => (value > 0 ? '$' + value + ' T' : '$' + value)}
                            tickCount={8}
                          />
                          <Line
                            dataKey="spending_y"
                            stroke={chartTheme.line.stroke}
                            dot={false}
                            strokeWidth={2}
                            activeDot={chartActive && <HoverPoint active={true} />}
                            isAnimationActive={false}
                          />
                          <Line
                            dataKey="gdp_y"
                            stroke={chartTheme.line.stroke}
                            dot={false}
                            strokeWidth={2}
                            activeDot={chartActive && <HoverPoint active={true} />}
                            isAnimationActive={false}
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                              ...chartTheme.cursor,
                              opacity: chartActive ? 0.75 : 0,
                            }}
                            isAnimationActive={false}
                            active={chartActive}
                            defaultIndex={defaultIndex}
                          />
                          <ReferenceDot x={maxYear} y={maxSpendingValue} shape={<HoverPoint label="Spending" />} />
                          <ReferenceDot x={maxYear} y={maxGDPValue} shape={<HoverPoint label="GDP" />} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {selectedChartView === 'percentageGdp' && (
                    <div ref={gdpRef} style={{ pointerEvents: !secondaryAnimationComplete ? 'none' : 'auto' }}>
                      <ResponsiveContainer height={chartTheme.height} width="99%">
                        <LineChart data={gdpRatioChartData} margin={chartTheme.margin} accessibilityLayer>
                          <XAxis dataKey="x" fontSize={chartTheme.axis.fontSize} tick={{ ...chartTheme.axis.tick }} />
                          <YAxis
                            ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]}
                            fontSize={chartTheme.axis.fontSize}
                            tickFormatter={val => val * 100 + '%'}
                            tick={{ ...chartTheme.axis.tick }}
                          />
                          <Line
                            dataKey="y"
                            stroke={chartTheme.line.stroke}
                            dot={false}
                            strokeWidth={2}
                            activeDot={chartActive && <HoverPoint active={true} />}
                            isAnimationActive={false}
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                              ...chartTheme.cursor,
                              opacity: chartActive ? 0.75 : 0,
                            }}
                            isAnimationActive={false}
                            active={chartActive}
                            defaultIndex={secondaryDefaultIndex}
                          />
                          <ReferenceDot x={maxYear} y={lastRatio} shape={<HoverPoint />} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </ChartContainer>
          </div>
          <VisualizationCallout color={spendingExplainerPrimary}>
            <p>
              Since {callOutYear || '--'}, {calloutCopy}.
            </p>
          </VisualizationCallout>
        </figure>
      )}
    </>
  );
};

export default TotalSpendingChart;
