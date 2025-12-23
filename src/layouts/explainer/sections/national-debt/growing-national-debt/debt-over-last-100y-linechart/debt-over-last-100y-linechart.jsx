import React, { useEffect, useState } from 'react';
import { Line } from '@nivo/line';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { breakpointLg, fontSize_10 } from '../../../../../../variables.module.scss';
import { chartConfigs, dataHeader, getChartCopy } from './debt-over-last-100y-linechart-helper';
import { visWithCallout } from '../../../../explainer.module.scss';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import { container, lineChart, loadingIcon } from './debt-over-last-100y-linechart.module.scss';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
  chartInViewProps,
  getChartTheme,
  LineChartCustomPoint,
  nivoCommonLineChartProps,
} from '../../../../explainer-helpers/explainer-charting-helper';
import CustomSlices from '../../../../../../components/nivo/custom-slice/custom-slice';
import { adjustDataForInflation } from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../../helpers/simplify-number/simplifyNumber';
import Analytics from '../../../../../../utils/analytics/analytics';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { useInView } from 'react-intersection-observer';
import { useRecoilValueLoadable } from 'recoil';
import useShouldRefreshCachedData from '../../../../../../recoil/hooks/useShouldRefreshCachedData';
import { debtOutstandingData, debtOutstandingLastCachedState } from '../../../../../../recoil/debtOutstandingDataState';
import { debtExplainerPrimary } from '../../../../../../variables.module.scss';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';

let gaTimerDebt100Yrs;
let ga4Timer;

const DebtOverLast100y = ({ cpiDataByYear, width }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState();
  const [maxYear, setMaxYear] = useState();
  const [maxAmount, setMaxAmount] = useState(0);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [lastDebtValue, setLastDebtValue] = useState('');
  const [firstDebtValue, setFirstDebtValue] = useState('');
  const [chartData, setChartData] = useState(null);
  const [totalDebtHeadingValues, setTotalDebtHeadingValues] = useState({ fiscalYear: '-', totalDebt: '-' });
  const [bottomAxisValue, setBottomAxisValues] = useState([]);
  const data = useRecoilValueLoadable(debtOutstandingData);
  useShouldRefreshCachedData(Date.now(), debtOutstandingData, debtOutstandingLastCachedState);

  const chartParent = 'totalDebtChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  const processData = () => {
    let dataResult = data.contents.payload;
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
      axisValues.push(`${axisVal}`);
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

    const totalData = [
      {
        id: 'Total Debt',
        color: debtExplainerPrimary,
        data: finalDebtChartData,
      },
    ];
    setChartData(totalData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (data.state === 'hasValue') {
      processData();
    }
  }, [data.state]);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width]);

  useEffect(() => {
    applyChartScaling(chartParent, chartWidth.toString(), chartHeight.toString());
    addInnerChartAriaLabel(chartParent);
  }, [isLoading]);

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

  const customHeaderStyles = {
    marginTop: '1rem',
  };
  const customFooterSpacing = {
    marginTop: '2rem',
  };
  const { ref, inView } = useInView(chartInViewProps);

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
            customHeaderStyles={customHeaderStyles}
            customFooterSpacing={customFooterSpacing}
            customContainerStyles={{
              minHeight: '26.71rem',
            }}
          >
            {isLoading ? (
              <LoadingIndicator loadingClass={loadingIcon} />
            ) : (
              <div
                className={lineChart}
                data-testid="totalDebtChartParent"
                onMouseEnter={handleChartMouseEnter}
                onMouseLeave={handleChartMouseLeave}
                role="presentation"
                ref={ref}
              >
                <Line
                  {...nivoCommonLineChartProps}
                  data={chartData}
                  layers={[
                    'grid',
                    'crosshair',
                    'markers',
                    'axes',
                    'areas',
                    'lines',
                    props =>
                      LineChartCustomPoint({
                        ...props,
                        seriesId: 'Total Debt',
                      }),
                    props =>
                      CustomSlices({
                        ...props,
                        groupMouseLeave: handleGroupOnMouseLeave,
                        mouseMove: handleMouseLeave,
                        inView,
                      }),
                    'mesh',
                    'legends',
                  ]}
                  theme={getChartTheme(width)}
                  colors={d => d.color}
                  width={chartWidth}
                  height={chartHeight}
                  margin={
                    width < pxToNumber(breakpointLg) ? { top: 25, right: 25, bottom: 35, left: 65 } : { top: 20, right: 15, bottom: 35, left: 50 }
                  }
                  xScale={{
                    type: 'linear',
                    min: minYear,
                    max: maxYear,
                  }}
                  yScale={{
                    type: 'linear',
                    min: 0,
                    max: maxAmount,
                  }}
                  axisBottom={{ ...chartConfigs.axisBottom, tickValues: bottomAxisValue }}
                  axisLeft={chartConfigs.axisLeft}
                  enableArea={true}
                  areaOpacity={1}
                />
              </div>
            )}
          </ChartContainer>
        </div>
        <VisualizationCallout color="">
          <p>
            Over the past 100 years, the U.S. federal debt has increased from {firstDebtValue} in {minYear} to {lastDebtValue} in {maxYear}.
          </p>
        </VisualizationCallout>
      </figure>
    </>
  );
};

export default withWindowSize(DebtOverLast100y);
