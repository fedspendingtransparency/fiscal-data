import React, { useEffect, useState } from 'react';
import ChartContainer from '../../../../../explainer-components/chart-container/chart-container';
import { dataHeader, getChartCopy } from './total-revenue-chart-helper';
import { visWithCallout } from '../../../../../explainer.module.scss';
import VisualizationCallout from '../../../../../../../components/visualization-callout/visualization-callout';
import { container, lineChart, loadingIcon } from './total-revenue-chart.module.scss';
import { revenueExplainerPrimary } from '../../../revenue.module.scss';
import { addInnerChartAriaLabel, applyChartScaling, chartInViewProps } from '../../../../../explainer-helpers/explainer-charting-helper';
import { apiPrefix, basicFetch } from '../../../../../../../utils/api-utils';
import { adjustDataForInflation } from '../../../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../../../helpers/simplify-number/simplifyNumber';
import numeral from 'numeral';
import { getShortForm } from '../../../../../../../utils/rounding-utils';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../../utils/date-utils';
import Analytics from '../../../../../../../utils/analytics/analytics';
import { useInView } from 'react-intersection-observer';
import LoadingIndicator from '../../../../../../../components/loading-indicator/loading-indicator';
import { useErrorBoundary } from 'react-error-boundary';
import { Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Point from '../../../../../../../components/nivo/custom-point/point';

let gaTimerTotalRevenue;
let ga4Timer;

const callOutDataEndPoint =
  apiPrefix + 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date&page[size]=1';

const chartDataEndPoint = apiPrefix + 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date';

const TotalRevenueChart = ({ cpiDataByYear, beaGDPData, copyPageData }) => {
  const [gdpChartData, setGdpChartData] = useState([]);
  const [gdpRatioChartData, setRatioGdpChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [maxAmount, setMaxAmount] = useState(0);
  const [callOutYear, setCallOutYear] = useState('');
  const [lastRatio, setLastRatio] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const [lastGDPValue, setLastGDPValue] = useState('');
  const [lastRevenueValue, setLastRevenueValue] = useState('');
  const [selectedChartView, setSelectedChartView] = useState('totalRevenue');
  const [xAxisValues, setXAxisValues] = useState([]);

  const [animationTriggeredOnce, setAnimationTriggeredOnce] = useState(false);
  const [secondaryAnimationTriggeredOnce, setSecondaryAnimationTriggeredOnce] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [secondaryAnimationComplete, setSecondaryAnimationComplete] = useState(false);

  const [chartFocus, setChartFocus] = useState(false);
  const [chartHover, setChartHover] = useState(false);
  const [chartActive, setChartActive] = useState(false);

  const [calloutCopy, setCalloutCopy] = useState('');

  const [curFY, setCurFY] = useState('--');
  const [curRevenue, setCurRevenue] = useState();
  const [curGDP, setCurGDP] = useState();
  const [curPercentGDP, setCurPercentGDP] = useState();

  const [defaultIndex, setDefaultIndex] = useState(0);
  const [secondaryDefaultIndex, setSecondaryDefaultIndex] = useState(0);

  const { ref: revenueRef, inView: revenueInView } = useInView(chartInViewProps);
  const { ref: gdpRef, inView: gdpInView } = useInView(chartInViewProps);

  const { showBoundary } = useErrorBoundary();

  const chartTheme = {
    height: 418,
    margin: { top: 12, bottom: 0, left: -12, right: 12 },
    axis: { fontSize: 14 },
    tick: { fill: '#555' },
    line: { stroke: '#666' },
    cursor: { strokeDasharray: '6 6', stroke: '#555', strokeWidth: 2 },
  };

  const handleMouseEnterChart = () => {
    setChartHover(true);
    gaTimerTotalRevenue = setTimeout(() => {
      Analytics.event({
        category: 'Explainers',
        action: 'Chart Hover',
        label: 'Revenue - Federal Revenue Trends and the U.S. Economy',
      });
    }, 3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'chart-hover-total-revenue',
      });
    }, 3000);
  };

  const handleMouseLeaveChart = () => {
    clearTimeout(gaTimerTotalRevenue);
    clearTimeout(ga4Timer);
  };

  const chartParent = 'totalRevenueChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  const chartToggleConfig = {
    selectedChartView,
    setSelectedChartView,
  };

  useEffect(() => {
    applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
    addInnerChartAriaLabel(chartParent);
  }, [isLoading, selectedChartView]);

  useEffect(() => {
    basicFetch(callOutDataEndPoint).then(res => {
      if (res.data && res.data.length > 0) {
        setCallOutYear(res.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {
    const { finalGDPData, gdpMaxYear } = beaGDPData;

    basicFetch(chartDataEndPoint)
      .then(res => {
        if (res.data && res.data.length > 0) {
          let finalRevenueChartData = [];

          res.data.forEach(revenue => {
            if (parseInt(revenue.record_fiscal_year) <= gdpMaxYear)
              finalRevenueChartData.push({
                x: parseInt(revenue.record_fiscal_year),
                actual_revenue: parseInt(revenue.current_fytd_net_rcpt_amt),
                fiscalYear: revenue.record_fiscal_year,
                record_date: revenue.record_date,
              });
          });

          finalRevenueChartData = finalRevenueChartData.filter(s => s.x <= gdpMaxYear);

          finalRevenueChartData = adjustDataForInflation(finalRevenueChartData, 'actual_revenue', 'fiscalYear', cpiDataByYear);

          finalRevenueChartData.forEach(revenue => {
            revenue.revenue_y = parseFloat(simplifyNumber(revenue.actual_revenue, false).slice(0, -2));
          });

          const revenueMaxYear = finalRevenueChartData.reduce((max, revenue) => (max.x > revenue.x ? max : revenue));
          setMaxYear(revenueMaxYear.x);

          const revenueMinYear = finalRevenueChartData.reduce((min, revenue) => (min.x < revenue.x ? min : revenue));
          setMinYear(revenueMinYear.x);

          const axisYears = [];
          for (let year = revenueMinYear.x; year <= revenueMaxYear.x; year += 1) {
            if (year % 2 === 0) {
              axisYears.push(year);
            }
          }
          setXAxisValues(axisYears);

          const revenueMaxAmount = finalRevenueChartData.reduce((min, revenue) => (min.revenue_y > revenue.revenue_y ? min : revenue));

          const revenueLastAmountActual = finalRevenueChartData[finalRevenueChartData.length - 1].actual_revenue;

          setLastRevenueValue(finalRevenueChartData[finalRevenueChartData.length - 1].revenue_y);

          const lastUpdatedDateRevenue = new Date(finalRevenueChartData[finalRevenueChartData.length - 1].record_date);
          setLastUpdatedDate(getDateWithoutTimeZoneAdjust(lastUpdatedDateRevenue));

          const filteredGDPData = finalGDPData.filter(g => g.fiscalYear <= revenueMaxYear.x && g.fiscalYear >= revenueMinYear.x);
          const filteredGDPData_chartData = [];
          filteredGDPData.forEach(data => {
            filteredGDPData_chartData.push({ actual_gdp: data.actual, gdp_y: data.y, x: data.x, fiscalYear: data.fiscalYear });
          });
          const finalGdpRatioChartData = [];
          finalRevenueChartData.forEach(revenue => {
            const revenueYear = revenue.fiscalYear;
            const revenueAmount = revenue.revenue_y;
            const matchingGDP = filteredGDPData_chartData.filter(g => g.fiscalYear === revenueYear).map(g => g.gdp_y);
            const gdpRatio = revenueAmount / matchingGDP;
            finalGdpRatioChartData.push({
              x: parseInt(revenueYear),
              y: gdpRatio,
            });
          });

          setRatioGdpChartData(finalGdpRatioChartData);

          const chartFirstRatio = finalRevenueChartData[0].revenue_y / filteredGDPData_chartData[0].gdp_y;
          const chartLastRatio =
            finalRevenueChartData[finalRevenueChartData.length - 1].revenue_y / filteredGDPData_chartData[filteredGDPData_chartData.length - 1].gdp_y;

          const firstRatio_formatted = numeral(chartFirstRatio).format('0%');
          const lastRatio_formatted = numeral(chartLastRatio).format('0%');

          setLastRatio(chartLastRatio);
          if (firstRatio_formatted !== lastRatio_formatted) {
            setCalloutCopy(
              `the Revenue-to-GDP ratio has ${
                lastRatio_formatted > firstRatio_formatted ? 'increased' : 'decreased'
              } from ${firstRatio_formatted} to ${lastRatio_formatted}`
            );
          } else {
            setCalloutCopy(`the Revenue-to-GDP ratio has not changed, remaining at ${firstRatio_formatted}`);
          }

          const chartMaxGDPValue = filteredGDPData_chartData.reduce((max, gdp) => (max.x > gdp.x ? max.gdp_y : gdp.gdp_y));
          const chartLastGDPValue = filteredGDPData_chartData[filteredGDPData_chartData.length - 1].actual_gdp;
          setLastGDPValue(filteredGDPData_chartData[filteredGDPData_chartData.length - 1].gdp_y);

          const maxAmountLocal = Math.ceil((revenueMaxAmount > chartMaxGDPValue ? revenueMaxAmount : chartMaxGDPValue) / 5) * 5;
          setMaxAmount(maxAmountLocal);

          setCurFY(revenueMaxYear.x);
          setCurFY(revenueMaxYear.x);
          setCurRevenue(simplifyNumber(revenueLastAmountActual, false));
          setCurGDP(simplifyNumber(chartLastGDPValue, false));
          setCurPercentGDP(chartLastRatio);

          const chartData_combined = [];
          filteredGDPData_chartData.forEach((data, index) => {
            chartData_combined.push({ ...data, ...finalRevenueChartData[index] });
          });
          setGdpChartData(chartData_combined);

          copyPageData({
            fiscalYear: revenueMaxYear.x,
            revenueTotal: getShortForm(revenueLastAmountActual, false),
            revenueRatio: chartLastRatio,
          });
        }
      })
      .catch(err => {
        showBoundary(err);
      })
      .finally(() => {
        setIsLoading(false);
        applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
      });
  }, []);

  const handleGroupOnMouseLeave = () => {
    setCurFY(maxYear.toString());
    setCurRevenue(lastRevenueValue + ' T');
    setCurGDP(lastGDPValue + ' T');
    setCurPercentGDP(lastRatio);
  };

  const { title: chartTitle, subtitle: chartSubtitle, footer: chartFooter, altText: chartAltText } = getChartCopy(
    minYear,
    maxYear,
    selectedChartView
  );

  const updateDataHeader = payload => {
    if (selectedChartView === 'totalRevenue') {
      const revenueData = payload[0]?.payload?.actual_revenue;
      const gdpData = payload[0]?.payload?.actual_gdp;
      if (revenueData && gdpData) {
        setCurFY(payload[0].payload.fiscalYear);
        setCurRevenue(simplifyNumber(revenueData, false));
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

  const CustomTooltip = ({ payload = [] }) => {
    if (payload.length > 0) {
      updateDataHeader(payload);
    }
    return <></>;
  };

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
    if (revenueInView && gdpChartData.length && !animationTriggeredOnce) {
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
  }, [revenueInView, gdpChartData]);

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
      }, stepDuration * gdpRatioChartData.length + 550);
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [gdpInView, gdpRatioChartData]);

  useEffect(() => {
    setChartActive(chartFocus || chartHover || (selectedChartView === 'totalRevenue' ? !animationComplete : !secondaryAnimationComplete));
  }, [chartHover, chartFocus, animationComplete, secondaryAnimationComplete, selectedChartView]);

  useEffect(() => {
    if (!chartActive && (selectedChartView === 'totalRevenue' ? animationComplete : secondaryAnimationComplete)) {
      handleGroupOnMouseLeave();
    }
  }, [chartActive]);

  return (
    <>
      <figure className={visWithCallout}>
        <div className={container}>
          <ChartContainer
            title={chartTitle}
            subTitle={chartSubtitle}
            footer={chartFooter}
            date={lastUpdatedDate}
            header={dataHeader(chartToggleConfig, {
              fiscalYear: curFY,
              totalRevenue: curRevenue,
              gdp: curGDP,
              gdpRatio: numeral(curPercentGDP).format('0%'),
            })}
            altText={chartAltText}
          >
            {isLoading && <LoadingIndicator loadingClass={loadingIcon} />}
            {!isLoading && chartToggleConfig && (
              <div
                className={lineChart}
                data-testid="totalRevenueChartParent"
                role="presentation"
                onMouseEnter={handleMouseEnterChart}
                onFocus={() => setChartFocus(true)}
                onBlur={() => setChartFocus(false)}
                onMouseLeave={() => {
                  setChartHover(false);
                  handleMouseLeaveChart();
                }}
              >
                {selectedChartView === 'totalRevenue' && (
                  <div data-testid="revenueLineChart" ref={revenueRef} style={{ pointerEvents: !animationComplete ? 'none' : 'auto' }}>
                    <ResponsiveContainer height={chartTheme.height} width="99%">
                      <LineChart data={gdpChartData} margin={chartTheme.margin} accessibilityLayer>
                        <XAxis dataKey="x" fontSize={chartTheme.axis.fontSize} tick={{ ...chartTheme.axis.tick }} ticks={xAxisValues} />
                        <YAxis
                          tick={{ ...chartTheme.axis.tick }}
                          fontSize={chartTheme.axis.fontSize}
                          domain={[0, maxAmount]}
                          tickFormatter={value => (value > 0 ? '$' + value + ' T' : '$' + value)}
                          tickCount={8}
                        />
                        <Line
                          dataKey="revenue_y"
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
                        <ReferenceDot x={maxYear} y={lastRevenueValue} shape={<HoverPoint label="Total Revenue" />} />
                        <ReferenceDot x={maxYear} y={lastGDPValue} shape={<HoverPoint label="GDP" />} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {selectedChartView === 'percentageGdp' && (
                  <div ref={gdpRef} style={{ pointerEvents: !secondaryAnimationComplete ? 'none' : 'auto' }}>
                    <ResponsiveContainer height={chartTheme.height} width="99%">
                      <LineChart data={gdpRatioChartData} margin={chartTheme.margin} accessibilityLayer>
                        <XAxis dataKey="x" fontSize={chartTheme.axis.fontSize} tick={{ ...chartTheme.axis.tick }} ticks={xAxisValues} />
                        <YAxis
                          ticks={[0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3]}
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
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            Since {callOutYear || '--'}, {calloutCopy || '--'}.
          </p>
        </VisualizationCallout>
      </figure>
    </>
  );
};

export default TotalRevenueChart;
