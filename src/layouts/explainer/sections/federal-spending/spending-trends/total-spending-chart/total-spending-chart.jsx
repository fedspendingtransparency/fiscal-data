import React, { useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { dataHeader, getChartCopy } from './total-spending-chart-helper';
import { visWithCallout } from '../../../../explainer.module.scss';
import VisualizationCallout
  from '../../../../../../components/visualization-callout/visualization-callout';
import { spendingExplainerPrimary } from '../../federal-spending.module.scss';
import { container, lineChart, loadingIcon } from './total-spending-chart.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import numeral from 'numeral';
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
  const [secondaryAnimationTriggeredOnce, setSecondaryAnimationTriggeredOnce] = useState(false);
  const [calloutCopy, setCalloutCopy] = useState('');
  const [spendingHoverDisabled, setSpendingHoverDisabled] = useState(true);
  const [gdpHoverDisabled, setGdpHoverDisabled] = useState(true);
  const [chartFocus, setChartFocus] = useState(false);
  const [chartHover, setChartHover] = useState(false);

  const [curFY, setCurFY] = useState('--');
  const [curSpending, setCurSpending] = useState();
  const [curGDP, setCurGDP] = useState();
  const [curPercentGDP, setCurPercentGDP] = useState();

  const [chartActive, setChartActive] = useState(false);

  // const { width } = useWindowSize();

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
            // console.log(spendingAmount, matchingGDP);
            finalGdpRatioChartData.push({
              x: spendingYear,
              y: gdpRatio * 100,
            });
          });
          // console.log(finalGdpRatioChartData);
          setRatioGdpChartData(finalGdpRatioChartData);

          const maxAmountLocal = Math.ceil((spendingMaxAmount > gdpMaxAmount ? spendingMaxAmount : gdpMaxAmount) / 5) * 5;
          setMaxAmount(maxAmountLocal);

          const chartFirstRatio = numeral(finalSpendingChartData[0].spending_y / rename[0].gdp_y).format('0%');
          const chartLastRatio = numeral(
            finalSpendingChartData[finalSpendingChartData.length - 1].spending_y / rename[rename.length - 1].gdp_y
          ).format('0%');

          setLastRatio(chartLastRatio);

          if (chartFirstRatio !== chartLastRatio) {
            setCalloutCopy(
              ` the Spending to GDP ratio has ${chartLastRatio > chartFirstRatio ? 'increased' : 'decreased'} from ${chartFirstRatio ||
                '--'} to ${chartLastRatio || '--'}`
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

          // console.log(chartData_combined);
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
    setCurFY(maxYear);
    setCurSpending(simplifyNumber(lastSpendingValue, false));
    setCurGDP(simplifyNumber(lastGDPValue, false));
    setCurPercentGDP(lastRatio);
  };

  // const handleMouseLeave = slice => {
  //   if (selectedChartView === 'totalSpending') {
  //     const spendingData = slice.points[0]?.data;
  //     const gdpData = slice.points[1]?.data;
  //     if (spendingData && gdpData) {
  //       setTotalSpendingHeadingValues({
  //         ...totalSpendingHeadingValues,
  //         totalSpending: simplifyNumber(spendingData.actual, false),
  //         fiscalYear: spendingData.fiscalYear,
  //         gdp: simplifyNumber(gdpData.actual, false),
  //       });
  //     }
  //   } else if (selectedChartView === 'percentageGdp') {
  //     const percentData = slice.points[0]?.data;
  //     if (percentData) {
  //       setTotalSpendingHeadingValues({
  //         ...totalSpendingHeadingValues,
  //         fiscalYear: percentData.x,
  //         gdpRatio: percentData.y + '%',
  //       });
  //     }
  //   }
  // };

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
      const percentData = payload[0]?.y;
      if (percentData) {
        setCurFY(payload[0].payload.fiscalYear);
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
      // console.log(payload, defaultIndex);
      updateDataHeader(payload);
    }
    return <></>;
  };

  const [defaultIndex, setDefaultIndex] = useState(0);

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

  const HoverPoint = payload => {
    const { cx, cy, strokeWidth, label, active } = payload;
    console.log(payload);
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
    console.log(`${curSpending?.split(' ')?.[0]}, ${curFY}, ${maxYear}, ${maxSpendingValue}`);
  }, [curFY, curSpending]);

  useEffect(() => {
    setChartActive(chartFocus || chartHover || !animationComplete);
  }, [chartHover, chartFocus, animationComplete]);

  return (
    <>
      {chartToggleConfig && (
        <figure className={visWithCallout}>
          <div className={container} style={{}}>
            <ChartContainer
              title={chartTitle}
              subTitle={chartSubtitle}
              footer={chartFooter}
              header={dataHeader(chartToggleConfig, { fiscalYear: curFY, totalSpending: curSpending, gdp: curGDP, gdpRatio: '' }, handleClick)}
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
                    handleGroupOnMouseLeave();
                    setChartHover(false);
                    clearTimeout(gaTimer);
                    clearTimeout(ga4Timer);
                  }}
                  role="presentation"
                >
                  {selectedChartView === 'totalSpending' && (
                    <div ref={spendingRef}>
                      <ResponsiveContainer height={418} width="99%">
                        <LineChart data={gdpChartData} margin={{ top: 12, bottom: 0, left: -12, right: 12 }} accessibilityLayer>
                          <XAxis dataKey="x" fontSize={14} tick={{ fill: '#555' }} />
                          <YAxis
                            tick={{ fill: '#555' }}
                            fontSize={14}
                            domain={[0, maxAmount]}
                            tickFormatter={value => (value > 0 ? '$' + value + ' T' : '$' + value)}
                            tickCount={8}
                          />
                          <Line
                            dataKey="spending_y"
                            stroke="#666666"
                            dot={false}
                            strokeWidth={2}
                            activeDot={chartActive && <HoverPoint active={true} />}
                            isAnimationActive={false}
                          />
                          <Line
                            dataKey="gdp_y"
                            stroke="#666666"
                            dot={false}
                            strokeWidth={2}
                            activeDot={chartActive && <HoverPoint active={true} />}
                            isAnimationActive={false}
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                              strokeDasharray: '6 6',
                              stroke: '#555',
                              strokeWidth: 2,
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
                    <ResponsiveContainer height={418} width="99%">
                      <LineChart data={gdpRatioChartData} margin={{ top: 12, bottom: 0, left: -12, right: 12 }} accessibilityLayer>
                        <XAxis dataKey="x" fontSize={14} />
                        <YAxis ticks={[0, 10, 20, 30, 40, 50]} fontSize={14} tickFormatter={val => val + '%'} />
                        <Line dataKey="y" stroke="#666666" dot={false} strokeWidth={2} activeDot={true} isAnimationActive={false} />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ strokeDasharray: '4 4', stroke: '#555', strokeWidth: '2px' }}
                          isAnimationActive={false}
                          active={chartFocus || chartHover || !animationComplete}
                        />
                      </LineChart>
                    </ResponsiveContainer>
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
