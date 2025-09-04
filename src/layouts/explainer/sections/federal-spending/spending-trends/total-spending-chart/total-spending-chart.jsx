import React, { useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { Line } from '@nivo/line';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, fontSize_10 } from '../../../../../../variables.module.scss';
import { withWindowSize } from 'react-fns';
import { chartConfigs, dataHeader, getChartCopy, getMarkers } from './total-spending-chart-helper';
import { visWithCallout } from '../../../../explainer.module.scss';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import { spendingExplainerPrimary } from '../../federal-spending.module.scss';
import { container, lineChart } from './total-spending-chart.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import numeral from 'numeral';
import simplifyNumber from '../../../../../../helpers/simplify-number/simplifyNumber';
import { adjustDataForInflation } from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import useGAEventTracking from '../../../../../../hooks/useGAEventTracking';
import Analytics from '../../../../../../utils/analytics/analytics';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
  chartInViewProps,
  getChartTheme,
  LineChartCustomPoints_GDP,
  nivoCommonLineChartProps,
} from '../../../../explainer-helpers/explainer-charting-helper';
import CustomSlices from '../../../../../../components/nivo/custom-slice/custom-slice';
import { useInView } from 'react-intersection-observer';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';

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

const TotalSpendingChart = ({ width, cpiDataByYear, beaGDPData, copyPageData }) => {
  const [spendingChartData, setSpendingChartData] = useState([]);
  const [gdpChartData, setGdpChartData] = useState([]);
  const [gdpRatioChartData, setRatioGdpChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState(2015);
  const [maxYear, setMaxYear] = useState(2022);
  const [maxAmount, setMaxAmount] = useState(0);
  const [callOutYear, setCallOutYear] = useState('');
  const [lastRatio, setLastRatio] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [lastGDPValue, setLastGDPValue] = useState('');
  const [lastSpendingValue, setLastSpendingValue] = useState('');
  const [maxSpendingValue, setMaxSpendingValue] = useState(0);
  const [maxGDPValue, setMaxGDPValue] = useState(0);
  const [selectedChartView, setSelectedChartView] = useState('totalSpending');
  const [animationTriggeredOnce, setAnimationTriggeredOnce] = useState(false);
  const [secondaryAnimationTriggeredOnce, setSecondaryAnimationTriggeredOnce] = useState(false);
  const [calloutCopy, setCalloutCopy] = useState('');

  const chartParent = 'chartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  const [totalSpendingHeadingValues, setTotalSpendingHeadingValues] = useState({});

  const { getGAEvent } = useGAEventTracking(null, 'SpendingExplainer');

  const handleClick = eventNumber => {
    const gaEvent = getGAEvent(eventNumber);
    Analytics.event({
      category: gaEvent?.eventCategory?.replace('Fiscal Data - ', ''),
      action: gaEvent?.eventAction,
      label: gaEvent?.eventLabel,
    });
  };

  const totalData = [
    {
      id: 'GDP',
      color: '#666666',
      data: gdpChartData,
    },
    {
      id: 'Total Spending',
      color: '#666666',
      data: spendingChartData,
    },
  ];

  const percentageData = [
    {
      id: 'GDP Percentage',
      color: '#666666',
      data: gdpRatioChartData,
    },
  ];

  const [chartData, setChartData] = useState(totalData);

  useEffect(() => {
    basicFetch(callOutDataEndPoint).then(res => {
      if (res.data) {
        setCallOutYear(res.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {
    const { finalGDPData, gdpMaxYear, gdpMaxAmount } = beaGDPData;

    basicFetch(chartDataEndPoint).then(res => {
      if (res.data) {
        let finalSpendingChartData = [];

        res.data.forEach(spending => {
          finalSpendingChartData.push({
            x: parseInt(spending.record_fiscal_year),
            actual: parseInt(spending.current_fytd_net_outly_amt),
            fiscalYear: spending.record_fiscal_year,
            record_date: spending.record_date,
          });
        });

        finalSpendingChartData = finalSpendingChartData.filter(s => s.x <= gdpMaxYear);

        const lastUpdatedDateSpending = new Date(finalSpendingChartData[finalSpendingChartData.length - 1].record_date);
        setLastUpdatedDate(getDateWithoutTimeZoneAdjust(lastUpdatedDateSpending));

        finalSpendingChartData = adjustDataForInflation(finalSpendingChartData, 'actual', 'fiscalYear', cpiDataByYear);

        finalSpendingChartData.forEach(spending => {
          spending.y = parseFloat(simplifyNumber(spending.actual, false).slice(0, -2));
        });

        setSpendingChartData(finalSpendingChartData);

        const spendingMinYear = finalSpendingChartData[0].x;
        setMinYear(spendingMinYear);

        const spendingMaxYear = finalSpendingChartData[finalSpendingChartData.length - 1].x;
        setMaxYear(Math.min(gdpMaxYear, spendingMaxYear));

        const spendingMaxAmount = finalSpendingChartData.reduce((max, spending) => (max > spending.y ? max : spending.y));

        setMaxSpendingValue(spendingMaxAmount);

        const filteredGDPData = finalGDPData.filter(g => g.fiscalYear <= spendingMaxYear && g.fiscalYear >= spendingMinYear);

        const finalGdpRatioChartData = [];
        finalSpendingChartData.forEach(spending => {
          const spendingYear = spending.fiscalYear;
          const spendingAmount = spending.y;
          const matchingGDP = filteredGDPData.filter(g => g.fiscalYear === spendingYear).map(g => g.y);
          const gdpRatio = numeral(spendingAmount / matchingGDP).format('0%');
          finalGdpRatioChartData.push({
            x: spendingYear,
            y: gdpRatio,
          });
        });

        setRatioGdpChartData(finalGdpRatioChartData);

        const maxAmountLocal = Math.ceil((spendingMaxAmount > gdpMaxAmount ? spendingMaxAmount : gdpMaxAmount) / 5) * 5;
        setMaxAmount(maxAmountLocal);

        const chartFirstRatio = numeral(finalSpendingChartData[0].y / filteredGDPData[0].y).format('0%');
        const chartLastRatio = numeral(
          finalSpendingChartData[finalSpendingChartData.length - 1].y / filteredGDPData[filteredGDPData.length - 1].y
        ).format('0%');

        setLastRatio(chartLastRatio);

        if (chartFirstRatio !== chartLastRatio) {
          setCalloutCopy(
            ` the Spending to GDP ratio has ${
              chartLastRatio > chartFirstRatio ? 'increased' : 'decreased'
            } from ${chartFirstRatio} to ${chartLastRatio}`
          );
        } else {
          setCalloutCopy(`the Spending to GDP ratio has not changed, remaining at ${chartFirstRatio}`);
        }

        const chartLastSpendingValue = finalSpendingChartData[finalSpendingChartData.length - 1].actual;
        setLastSpendingValue(chartLastSpendingValue);

        const chartLastGDPValue = filteredGDPData[filteredGDPData.length - 1].actual;
        setLastGDPValue(chartLastGDPValue);

        setTotalSpendingHeadingValues({
          fiscalYear: spendingMaxYear,
          totalSpending: simplifyNumber(chartLastSpendingValue, false),
          gdp: simplifyNumber(chartLastGDPValue, false),
          gdpRatio: chartLastRatio,
        });

        const chartMaxGDPValue = filteredGDPData.reduce((max, gdp) => (max.x > gdp.x ? max.y : gdp.y));

        setMaxGDPValue(chartMaxGDPValue);
        setGdpChartData(filteredGDPData);

        setIsLoading(false);

        applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
        addInnerChartAriaLabel(chartParent);

        copyPageData({
          fiscalYear: Math.min(gdpMaxYear, spendingMaxYear),
          totalSpending: getShortForm(chartLastSpendingValue, false),
          percentOfGDP: chartLastRatio,
          numOfYearsInChart: maxYear - minYear + 1,
        });
      }
    });
  }, []);

  const chartToggleConfig = {
    selectedChartView,
    setSelectedChartView,
  };

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width, chartToggleConfig]);

  useEffect(() => {
    applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
  }, [isLoading, selectedChartView]);

  useEffect(() => {
    if (!selectedChartView) return;
    if (selectedChartView === 'percentageGdp') {
      setChartData(percentageData);
    }
    if (selectedChartView === 'totalSpending' && gdpChartData.length && spendingChartData.length) {
      setChartData(totalData);
    }
  }, [selectedChartView, gdpChartData, spendingChartData]);

  const handleMouseEnter = () => {
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
    setTotalSpendingHeadingValues({
      fiscalYear: maxYear,
      totalSpending: simplifyNumber(lastSpendingValue, false),
      gdp: simplifyNumber(lastGDPValue, false),
      gdpRatio: lastRatio,
    });
  };

  const handleMouseLeave = slice => {
    if (selectedChartView === 'totalSpending') {
      const spendingData = slice.points[0]?.data;
      const gdpData = slice.points[1]?.data;
      if (spendingData && gdpData) {
        setTotalSpendingHeadingValues({
          ...totalSpendingHeadingValues,
          totalSpending: simplifyNumber(spendingData.actual, false),
          fiscalYear: spendingData.fiscalYear,
          gdp: simplifyNumber(gdpData.actual, false),
        });
      }
    } else if (selectedChartView === 'percentageGdp') {
      const percentData = slice.points[0]?.data;
      if (percentData) {
        setTotalSpendingHeadingValues({
          ...totalSpendingHeadingValues,
          fiscalYear: percentData.x,
          gdpRatio: percentData.y + '%',
        });
      }
    }
  };

  const { title: chartTitle, subtitle: chartSubtitle, footer: chartFooter, altText: chartAltText } = getChartCopy(
    minYear,
    maxYear,
    selectedChartView
  );

  const { ref: spendingRef, inView: spendingInView } = useInView(chartInViewProps);

  const { ref: gdpRef, inView: gdpInView } = useInView(chartInViewProps);

  const xScale = {
    type: 'linear',
    min: minYear,
    max: maxYear,
  };
  const yScale = {
    type: 'linear',
    min: 0,
    max: selectedChartView === 'percentageGdp' ? 50 : maxAmount,
    stacked: false,
    reverse: false,
  };

  const commonProps = {
    ...nivoCommonLineChartProps,
    data: chartData,
    colors: d => d.color,
    width: chartWidth,
    height: chartHeight,
    axisBottom: chartConfigs.axisBottom,
    useMesh: false,
    markers: getMarkers(width, selectedChartView, maxGDPValue, maxSpendingValue),
    margin: width < pxToNumber(breakpointLg) ? { top: 25, right: 25, bottom: 30, left: 55 } : { top: 20, right: 15, bottom: 35, left: 50 },
    xScale: xScale,
    yScale: yScale,
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      {!isLoading && chartToggleConfig && (
        <div className={visWithCallout}>
          <div className={container}>
            <ChartContainer
              title={chartTitle}
              subTitle={chartSubtitle}
              footer={chartFooter}
              date={lastUpdatedDate}
              header={dataHeader(chartToggleConfig, totalSpendingHeadingValues, handleClick)}
              altText={chartAltText}
              customHeaderStyles={{ marginTop: '0.5rem', marginBottom: '0' }}
            >
              <div
                className={lineChart}
                data-testid="chartParent"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => {
                  clearTimeout(gaTimer);
                  clearTimeout(ga4Timer);
                }}
                role="presentation"
              >
                {selectedChartView === 'totalSpending' && (
                  <div ref={spendingRef}>
                    <Line
                      {...commonProps}
                      theme={getChartTheme(width, true)}
                      axisLeft={chartConfigs.axisLeftSpending}
                      layers={[
                        ...chartConfigs.layers,
                        props =>
                          LineChartCustomPoints_GDP({
                            ...props,
                            seriesId: 'Total Spending',
                          }),
                        props =>
                          CustomSlices({
                            ...props,
                            groupMouseLeave: handleGroupOnMouseLeave,
                            mouseMove: handleMouseLeave,
                            inView: spendingInView,
                            duration: 500,
                            customAnimationTriggeredOnce: animationTriggeredOnce,
                            setCustomAnimationTriggeredOnce: setAnimationTriggeredOnce,
                          }),
                      ]}
                    />
                  </div>
                )}
                {selectedChartView === 'percentageGdp' && (
                  <div ref={gdpRef}>
                    <Line
                      {...commonProps}
                      theme={getChartTheme(width, true)}
                      axisLeft={chartConfigs.axisLeftPercent}
                      layers={[
                        ...chartConfigs.layers,
                        LineChartCustomPoints_GDP,
                        props =>
                          CustomSlices({
                            ...props,
                            groupMouseLeave: handleGroupOnMouseLeave,
                            mouseMove: handleMouseLeave,
                            inView: gdpInView,
                            duration: 500,
                            customAnimationTriggeredOnce: secondaryAnimationTriggeredOnce,
                            setCustomAnimationTriggeredOnce: setSecondaryAnimationTriggeredOnce,
                          }),
                      ]}
                    />
                  </div>
                )}
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={spendingExplainerPrimary}>
            <p>
              Since {callOutYear}, {calloutCopy}.
            </p>
          </VisualizationCallout>
        </div>
      )}
    </>
  );
};

export default withWindowSize(TotalSpendingChart);
