import React, { useEffect, useState } from 'react';
import { Area, AreaChart, XAxis, YAxis, ZIndexLayer } from 'recharts';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { breakpointLg } from '../../../../../../variables.module.scss';
import {
  chartConfigs,
  dataHeader,
  formatDollarTick,
  getChartCopy,
  getChartMargin,
  getNiceDomain,
  getTicks,
} from './debt-over-last-100y-linechart-helper';
import { visWithCallout } from '../../../../explainer.module.scss';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import { container, lineChart, loadingIcon } from './debt-over-last-100y-linechart.module.scss';
import { chartInViewProps } from '../../../../explainer-helpers/explainer-charting-helper';
import { ChartScaling, Crosshair, HoverPoint, HoverSlices } from '../../../../explainer-helpers/explainer-recharts-helper';
import { adjustDataForInflation } from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../../helpers/simplify-number/simplifyNumber';
import Analytics from '../../../../../../utils/analytics/analytics';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { useInView } from 'react-intersection-observer';
import { debtOutstandingData } from '../../../../../../recoil/debtOutstandingDataState';
import { debtExplainerPrimary } from '../../../../../../variables.module.scss';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';
import { useWindowSize } from 'usehooks-ts';

let gaTimerDebt100Yrs;
let ga4Timer;

const DebtOverLast100y = ({ cpiDataByYear }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState();
  const [maxYear, setMaxYear] = useState();
  const [maxAmount, setMaxAmount] = useState(0);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const [lastDebtValue, setLastDebtValue] = useState('');
  const [firstDebtValue, setFirstDebtValue] = useState('');
  const [chartData, setChartData] = useState(null);
  const [totalDebtHeadingValues, setTotalDebtHeadingValues] = useState({ fiscalYear: '--', totalDebt: '$--' });
  const [bottomAxisValue, setBottomAxisValues] = useState([]);
  const [hoverDisabled, setHoverDisabled] = useState(true);
  const [currentSlice, setCurrentSlice] = useState(null);
  const payload = debtOutstandingData(state => state.payload);
  const status = debtOutstandingData(state => state.status);
  const refreshIfStale = debtOutstandingData(state => state.refreshIfStale);

  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const { width } = useWindowSize();
  const { ref, inView } = useInView(chartInViewProps);

  const chartParent = 'totalDebtChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  const processData = () => {
    let dataResult = payload;
    dataResult = adjustDataForInflation(dataResult, 'debt_outstanding_amt', 'record_date', cpiDataByYear);
    const finalDebtChartData = [];

    dataResult.forEach(debt => {
      finalDebtChartData.push({
        x: parseInt(debt.record_fiscal_year),
        y: parseInt(debt.debt_outstanding_amt),
        simplified: simplifyNumber(debt.debt_outstanding_amt, true),
        fiscalYear: debt.record_fiscal_year,
        record_date: debt.record_date,
      });
    });
    finalDebtChartData.reverse();

    const debtMaxYear = finalDebtChartData.reduce((max, spending) => (max.x > spending.x ? max : spending));

    const debtMinYear = finalDebtChartData.reduce((min, spending) => (min.x < spending.x ? min : spending));
    setMinYear(debtMinYear.x);
    setMaxYear(debtMaxYear.x);
    const axisValues = [];
    let axisVal = debtMinYear.x;
    for (let i = 0; i < 6; i++) {
      axisValues.push(axisVal);
      axisVal += 20;
    }
    setBottomAxisValues(axisValues);
    const debtMaxAmount = finalDebtChartData.reduce((max, spending) => (max.y > spending.y ? max : spending));

    const debtMaxAmountRoundedUp = Math.ceil(debtMaxAmount.y / 5000000000000) * 5000000000000;
    setMaxAmount(debtMaxAmountRoundedUp);

    const debtFirstAmountActual = finalDebtChartData[0].y;
    const debtLastAmountActual = finalDebtChartData[finalDebtChartData.length - 1].y;

    setLastDebtValue(simplifyNumber(debtLastAmountActual, true));
    setFirstDebtValue(simplifyNumber(debtFirstAmountActual, true));

    const lastUpdatedDateDebt = new Date(finalDebtChartData[finalDebtChartData.length - 1].record_date);
    setLastUpdatedDate(getDateWithoutTimeZoneAdjust(lastUpdatedDateDebt));

    setTotalDebtHeadingValues({
      fiscalYear: debtMaxYear.x,
      totalDebt: simplifyNumber(debtLastAmountActual, true),
    });

    setChartData(finalDebtChartData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (status === 'hasValue' && payload) {
      processData();
    }
  }, [status, payload]);

  const handleGroupOnMouseLeave = () => {
    setTotalDebtHeadingValues({
      fiscalYear: maxYear,
      totalDebt: lastDebtValue,
    });
  };

  const handleMouseLeave = slice => {
    const debtData = slice.points[0].data;
    if (debtData) {
      setTotalDebtHeadingValues({
        fiscalYear: debtData.x,
        totalDebt: debtData.simplified,
      });
    }
  };

  const { title: chartTitle, subtitle: chartSubtitle, footer: chartFooter, altText: chartAltText } = getChartCopy(minYear, maxYear);

  const handleChartMouseEnter = () => {
    gaTimerDebt100Yrs = setTimeout(() => {
      Analytics.event({
        category: 'Explainers',
        action: 'Chart Hover',
        label: 'Debt - U.S. Federal Debt Trends Over the Last 100 Years',
      });
    }, 3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'chart-hover-debt-100y',
      });
    }, 3000);
  };
  const handleChartMouseLeave = () => {
    clearTimeout(gaTimerDebt100Yrs);
    clearTimeout(ga4Timer);
  };

  return (
    <>
      <figure className={visWithCallout}>
        <div className={container}>
          <ChartContainer
            title={chartTitle}
            subTitle={chartSubtitle}
            footer={chartFooter}
            date={lastUpdatedDate}
            header={dataHeader(totalDebtHeadingValues)}
            altText={chartAltText}
          >
            {isLoading ? (
              <LoadingIndicator loadingClass={loadingIcon} />
            ) : (
              <div
                className={lineChart}
                style={{ pointerEvents: hoverDisabled ? 'none' : 'auto' }}
                data-testid="totalDebtChartParent"
                onMouseEnter={handleChartMouseEnter}
                onMouseLeave={handleChartMouseLeave}
                role="presentation"
                ref={ref}
              >
                <AreaChart
                  data={chartData}
                  width={chartWidth}
                  height={chartHeight}
                  margin={getChartMargin(width < pxToNumber(breakpointLg))}
                  style={{ width: '100%', height: 'auto' }}
                  accessibilityLayer={false}
                  role="img"
                >
                  <ChartScaling parent={chartParent} chartWidth={chartWidth} chartHeight={chartHeight} pageWidth={width} />
                  <Crosshair currentSlice={currentSlice} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={getNiceDomain(minYear, maxYear)}
                    ticks={bottomAxisValue}
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
                    domain={[0, maxAmount]}
                    ticks={getTicks(0, maxAmount, 7)}
                    interval={0}
                    width={chartConfigs.axisThickness}
                    tickFormatter={formatDollarTick}
                    tickSize={chartConfigs.tickSize}
                    tickMargin={chartConfigs.tickMargin}
                    axisLine={chartConfigs.axisLine}
                    tickLine={chartConfigs.tickLine}
                    tick={chartConfigs.tick}
                    zIndex={chartConfigs.zIndex.axis}
                  />
                  <Area
                    dataKey="y"
                    type="linear"
                    fill={debtExplainerPrimary}
                    fillOpacity={1}
                    stroke={debtExplainerPrimary}
                    strokeWidth={2}
                    baseValue={0}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                  <ZIndexLayer zIndex={chartConfigs.zIndex.point}>
                    <HoverPoint data={chartData} currentSlice={currentSlice} />
                  </ZIndexLayer>
                  <ZIndexLayer zIndex={chartConfigs.zIndex.slices}>
                    <HoverSlices
                      data={chartData}
                      setCurrentSlice={setCurrentSlice}
                      groupMouseLeave={handleGroupOnMouseLeave}
                      mouseMove={handleMouseLeave}
                      inView={inView}
                      onAnimationComplete={() => setHoverDisabled(false)}
                    />
                  </ZIndexLayer>
                </AreaChart>
              </div>
            )}
          </ChartContainer>
        </div>
        <VisualizationCallout color="">
          <p>
            Over the past 100 years, the U.S. federal debt has increased from {firstDebtValue || '$--'} in {minYear || '--'} to{' '}
            {lastDebtValue || '$--'} in {maxYear || '--'}.
          </p>
        </VisualizationCallout>
      </figure>
    </>
  );
};

export default DebtOverLast100y;
