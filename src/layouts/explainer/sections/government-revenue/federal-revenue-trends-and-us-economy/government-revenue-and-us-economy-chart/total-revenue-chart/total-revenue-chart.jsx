import React, { useEffect, useState } from 'react';
import { Line } from '@nivo/line';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../../../helpers/styles-helper/styles-helper';
import ChartContainer from '../../../../../explainer-components/chart-container/chart-container';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from '../../../../../../../variables.module.scss';
import {
  getChartCopy,
  dataHeader,
  chartConfigs,
  getMarkers,
} from './total-revenue-chart-helper';
import { visWithCallout } from '../../../../../explainer.module.scss';
import VisualizationCallout
  from '../../../../../../../components/visualization-callout/visualization-callout';
import { lineChart, container } from './total-revenue-chart.module.scss';
import { revenueExplainerPrimary } from '../../../revenue.module.scss';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
} from '../../../../../explainer-helpers/explainer-charting-helper';
import {lineChartCustomPoints} from
    '../../../../federal-spending/spending-trends/total-spending-chart/total-spending-chart-helper';
import CustomSlices from '../../../../../explainer-helpers/custom-slice/custom-slice';
import { apiPrefix, basicFetch } from '../../../../../../../utils/api-utils';
import { adjustDataForInflation }
  from '../../../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../../../helpers/simplify-number/simplifyNumber';
import numeral from 'numeral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getShortForm } from '../../../../../../../utils/rounding-utils';
import {getDateWithoutTimeZoneAdjust} from '../../../../../../../utils/date-utils';
import Analytics from "../../../../../../../utils/analytics/analytics";
import { useInView } from "react-intersection-observer";

let gaTimerTotalRevenue;
let ga4Timer;

const callOutDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date&page[size]=1';

const chartDataEndPoint =
  apiPrefix +
  'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date';

const TotalRevenueChart = ({ cpiDataByYear, width, beaGDPData, copyPageData }) => {
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [gdpChartData, setGdpChartData] = useState([]);
  const [gdpRatioChartData, setRatioGdpChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState(2015);
  const [maxYear, setMaxYear] = useState(2022);
  const [callOutYear, setCallOutYear] = useState('');
  const [firstRatio, setFirstRatio] = useState('');
  const [lastRatio, setlastRatio] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [lastGDPValue, setlastGDPValue] = useState('');
  const [lastRevenueValue, setlastRevenueValue] = useState('');
  const [maxRevenueValue, setMaxRevenueValue] = useState(0);
  const [maxGDPValue, setMaxGDPValue] = useState(0);
  const [selectedChartView, setSelectedChartView] = useState('totalRevenue');
  const [animationTriggeredOnce, setAnimationTriggeredOnce] = useState(false);
  const [secondaryAnimationTriggeredOnce, setSecondaryAnimationTriggeredOnce] = useState(false);


  const [totalRevenueHeadingValues, setTotalRevenueHeadingValues] = useState(
    {}
  );

  const handleMouseEnterChart = () => {
    gaTimerTotalRevenue = setTimeout(() => {
      Analytics.event({
        category: 'Explainers',
        action: 'Chart Hover',
        label: 'Revenue - Federal Revenue Trends and the U.S. Economy'
      });
    },3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'chart-hover-total-revenue',
      });
    }, 3000);
  }

  const handleMouseLeaveChart = () => {
    clearTimeout(gaTimerTotalRevenue);
    clearTimeout(ga4Timer);
  }

  const percentageData = [
    {
      id: 'GDP Percentage',
      color: '#666666',
      data: gdpRatioChartData,
    },
  ];
  const totalData = [
    {
      id: 'GDP',
      color: '#666666',
      data: gdpChartData,
    },
    {
      id: 'Total Revenue',
      color: '#666666',
      data: revenueChartData,
    },
  ];
  const [chartData, setChartData] = useState(totalData);

  const [isMobile, setIsMobile] = useState(true);
  const chartParent = 'totalRevenueChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  const chartToggleConfig = {
    selectedChartView,
    setSelectedChartView,
    isMobile,
  };

  useEffect(() => {
    applyChartScaling(
      chartParent,
      chartWidth.toString(),
      chartHeight.toString()
    );
    addInnerChartAriaLabel(chartParent);
  }, [isLoading, selectedChartView]);

  const breakpoint = {
    desktop: 1015,
    tablet: 600,
  };

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [width]);

  useEffect(() => {
    basicFetch(callOutDataEndPoint).then(res => {
      if (res.data) {
        setCallOutYear(res.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {
    const {
      finalGDPData,
      gdpMaxYear,
    } = beaGDPData;

    basicFetch(chartDataEndPoint).then(res => {
      if (res.data) {
        let finalRevenueChartData = [];

        res.data.forEach(revenue => {
          if (parseInt(revenue.record_fiscal_year) <= gdpMaxYear)
            finalRevenueChartData.push({
              x: parseInt(revenue.record_fiscal_year),
              actual: parseInt(revenue.current_fytd_net_rcpt_amt),
              fiscalYear: revenue.record_fiscal_year,
              record_date: revenue.record_date,
            });
        });

        finalRevenueChartData = finalRevenueChartData.filter(s => s.x <= gdpMaxYear);

        finalRevenueChartData = adjustDataForInflation(
          finalRevenueChartData,
          'actual',
          'fiscalYear',
          cpiDataByYear
        );

        finalRevenueChartData.forEach(revenue => {
          revenue.y = parseFloat(
            simplifyNumber(revenue.actual, false).slice(0, -2)
          );
        });

        setRevenueChartData(finalRevenueChartData);

        const revenueMaxYear = finalRevenueChartData.reduce((max, revenue) =>
          max.x > revenue.x ? max : revenue
        );
        setMaxYear(revenueMaxYear.x);

        const revenueMinYear = finalRevenueChartData.reduce((min, revenue) =>
          min.x < revenue.x ? min : revenue
        );
        setMinYear(revenueMinYear.x);

        const revenueMaxAmount = finalRevenueChartData.reduce((min, revenue) =>
          min.y > revenue.y ? min : revenue
        );

        const revenueLastAmountActual =
          finalRevenueChartData[finalRevenueChartData.length - 1].actual;

        setlastRevenueValue(revenueLastAmountActual);

        setMaxRevenueValue(revenueMaxAmount.y);

        const lastUpdatedDateRevenue =
          new Date(finalRevenueChartData[finalRevenueChartData.length - 1].record_date);
        setLastUpdatedDate(getDateWithoutTimeZoneAdjust(lastUpdatedDateRevenue));

        const filteredGDPData = finalGDPData.filter(
          g => g.fiscalYear <= revenueMaxYear.x && g.fiscalYear >= revenueMinYear.x
        );

        const finalGdpRatioChartData = [];
        finalRevenueChartData.forEach((revenue) => {
          const revenueYear = revenue.fiscalYear;
          const revenueAmount = revenue.y;
          const matchingGDP = filteredGDPData
            .filter(g => g.fiscalYear === revenueYear)
            .map(g => g.y);
          const gdpRatio = numeral(revenueAmount / matchingGDP).format('0%');
          finalGdpRatioChartData.push({
            x: revenueYear,
            y: gdpRatio,
          });
        });

        setRatioGdpChartData(finalGdpRatioChartData);

        setFirstRatio(
          numeral(finalRevenueChartData[0].y / filteredGDPData[0].y).format('0%')
        );

        const chartLastRatio = numeral(
          finalRevenueChartData[finalRevenueChartData.length - 1].y /
          filteredGDPData[filteredGDPData.length - 1].y
        ).format('0%');
        setlastRatio(chartLastRatio);

        const chartMaxGDPValue = filteredGDPData.reduce((max, gdp) =>
          max.x > gdp.x ? max.y : gdp.y
        );
        const chartLastGDPValue =
          filteredGDPData[filteredGDPData.length - 1].actual;
        setlastGDPValue(chartLastGDPValue);
        setGdpChartData(filteredGDPData);

        setMaxGDPValue(chartMaxGDPValue);
        setTotalRevenueHeadingValues({
          fiscalYear: revenueMaxYear.x,
          totalRevenue: simplifyNumber(revenueLastAmountActual, false),
          gdp: simplifyNumber(chartLastGDPValue, false),
          gdpRatio: chartLastRatio,
        });

        setIsLoading(false);

        applyChartScaling(
          chartParent,
          chartWidth.toString(),
          chartHeight.toString()
        );

        copyPageData({
          fiscalYear: maxYear,
          revenueTotal: getShortForm(revenueLastAmountActual, false),
          revenueRatio: chartLastRatio
        });
      }
    });
  }, []);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width, chartToggleConfig]);

  useEffect(() => {
    if (!selectedChartView) return;
    if (selectedChartView === 'percentageGdp') {
      setChartData(percentageData);
    }
    if (
      selectedChartView === 'totalRevenue' &&
      gdpChartData.length &&
      revenueChartData.length
    ) {
      setChartData(totalData);
    }
  }, [selectedChartView, gdpChartData, revenueChartData]);

  const handleGroupOnMouseLeave = () => {
    setTotalRevenueHeadingValues({
      fiscalYear: maxYear,
      totalRevenue: simplifyNumber(lastRevenueValue, false),
      gdp: simplifyNumber(lastGDPValue, false),
      gdpRatio: lastRatio,
    });
  };

  const handleMouseLeave = slice => {
    if (selectedChartView === 'totalRevenue') {
      const revenueData = slice.points[0]?.data;
      const gdpData = slice.points[1]?.data;
      if (revenueData && gdpData) {
        setTotalRevenueHeadingValues({
          ...totalRevenueHeadingValues,
          totalRevenue: simplifyNumber(revenueData.actual, false),
          fiscalYear: revenueData.fiscalYear,
          gdp: simplifyNumber(gdpData.actual, false),
        });
      }
    } else if (selectedChartView === 'percentageGdp') {
      const percentData = slice.points[0]?.data;
      if (percentData) {
        setTotalRevenueHeadingValues({
          ...totalRevenueHeadingValues,
          fiscalYear: percentData.x,
          gdpRatio: percentData.y + '%',
        });
      }
    }
  };

  const {
    title: chartTitle,
    subtitle: chartSubtitle,
    footer: chartFooter,
    altText: chartAltText,
  } = getChartCopy(minYear, maxYear, selectedChartView);

  const { ref: revenueRef, inView: revenueInView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '-50% 0% -50% 0%',
  })

  const { ref: gdpRef, inView: gdpInView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '-50% 0% -50% 0%',
  })

  const chartTheme = {
    ...chartConfigs.theme,
    fontSize:
      width < pxToNumber(breakpointLg)
        ? fontSize_10
        : fontSize_14,
    marker: {
      fontSize:
        width < pxToNumber(breakpointLg)
          ? fontSize_10
          : fontSize_14,
    },
    crosshair: {
      line: {
        stroke: '#555555',
        strokeWidth: 2,
      },
    },
  }

  const xScale = {
    type: 'linear',
      min: minYear,
      max: maxYear,
  };
  const yScale = {
    type: 'linear',
      min: 0,
      max: 30,
      stacked: false,
      reverse: false,
  };

  const commonProps = {
    data: chartData,
    colors: d => d.color,
    width: chartWidth,
    height: chartHeight,
    enablePoints:true,
    pointSize: 0,
    enableGridX: false,
    enableGridY:false,
    axisTop:null,
    axisRight:null,
    axisBottom:chartConfigs.axisBottom,
    axisLeft:selectedChartView === 'totalRevenue' ?
        chartConfigs.axisLeftTotalRevenue :
        chartConfigs.axisLeftPercentageGDP,
    useMesh:false,
    isInteractive:true,
    enableCrosshair:true,
    crosshairType:'x',
    animate:false,
    sliceTooltip:() => null,
    tooltip:() => null,
    enableSlices:'x',
    markers: getMarkers(width, selectedChartView, maxGDPValue, maxRevenueValue),
    margin: width < pxToNumber(breakpointLg) ? { top: 25, right: 25, bottom: 30, left: 55 }
      : { top: 20, right: 15, bottom: 35, left: 50 },
    theme: chartTheme,
    xScale: xScale,
    yScale: yScale,
  }

  return (
    <>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && chartToggleConfig && (
        <div className={visWithCallout}>
          <div className={container} role={'presentation'} onMouseEnter={handleMouseEnterChart} onMouseLeave={handleMouseLeaveChart}>
            <ChartContainer
              title={chartTitle}
              subTitle={chartSubtitle}
              footer={chartFooter}
              date={lastUpdatedDate}
              header={dataHeader(chartToggleConfig, totalRevenueHeadingValues)}
              altText={chartAltText}
            >
              <div className={lineChart} data-testid={'totalRevenueChartParent'}>
                {selectedChartView === 'totalRevenue' && (
                  <div ref={revenueRef}>
                    <Line
                      {...commonProps}
                      layers={[
                        ...chartConfigs.layers,
                        lineChartCustomPoints,
                        (props) =>
                          CustomSlices({
                              ...props,
                              groupMouseLeave: handleGroupOnMouseLeave,
                              mouseMove: handleMouseLeave,
                              inView: revenueInView,
                              duration: 500,
                              customAnimationTriggeredOnce: animationTriggeredOnce,
                              setCustomAnimationTriggeredOnce: setAnimationTriggeredOnce,
                            }
                          ),
                      ]}
                    />
                  </div>
                )}
                {selectedChartView === 'percentageGdp' && (
                  <div ref={gdpRef}>
                    <Line
                      {...commonProps}
                      layers={[
                        ...chartConfigs.layers,
                        lineChartCustomPoints,
                        (props) =>
                          CustomSlices({
                              ...props,
                              groupMouseLeave: handleGroupOnMouseLeave,
                              mouseMove: handleMouseLeave,
                              inView: gdpInView,
                              duration: 500,
                              customAnimationTriggeredOnce: secondaryAnimationTriggeredOnce,
                              setCustomAnimationTriggeredOnce: setSecondaryAnimationTriggeredOnce,
                            }
                          ),
                      ]}
                    />
                  </div>
                )}
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={revenueExplainerPrimary}>
            <p>
              Since {callOutYear}, the Revenue-to-GDP ratio has increased from{' '}
              {firstRatio} to {lastRatio}.
            </p>
          </VisualizationCallout>
        </div>
      )}
    </>
  );
};

export default withWindowSize(TotalRevenueChart);
