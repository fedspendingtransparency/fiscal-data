import React, { useEffect, useState } from 'react';
import { Line } from '@nivo/line';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from '../../../../../../variables.module.scss';
import {
  getChartCopy,
  dataHeader,
  chartConfigs,
} from './debt-over-last-100y-linechart-helper';
import { visWithCallout } from '../../../../explainer.module.scss';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import {
  lineChart,
  container
} from './debt-over-last-100y-linechart.module.scss';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
} from '../../../../explainer-helpers/explainer-charting-helper';
import { lineChartCustomPoints } from './debt-over-last-100y-linechart-helper';
import CustomSlices from '../../../../explainer-helpers/custom-slice/custom-slice';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { adjustDataForInflation } from '../../../../../../helpers/inflation-adjust/inflation-adjust';
import simplifyNumber from '../../../../../../helpers/simplify-number/simplifyNumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Analytics from '../../../../../../utils/analytics/analytics';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { useInView } from 'react-intersection-observer';

const chartDataEndPoint =
  apiPrefix + 'v2/accounting/od/debt_outstanding?sort=-record_date&page[size]=101';

let gaTimerDebt100Yrs;
let ga4Timer;

const DebtOverLast100y = ({ cpiDataByYear, width }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState(2015);
  const [maxYear, setMaxYear] = useState(2022);
  const [maxAmount, setMaxAmount] = useState(0);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [lastDebtValue, setLastDebtValue] = useState('');
  const [firstDebtValue, setFirstDebtValue] = useState('');
  const [chartData, setChartData] = useState(null);
  const [totalDebtHeadingValues, setTotalDebtHeadingValues] = useState({});

  const chartParent = 'totalDebtChartParent';
  const chartWidth = 550;
  const chartHeight = 490;

  useEffect(() => {
    basicFetch(chartDataEndPoint).then(res => {
      if (res.data) {
        res.data = adjustDataForInflation(
          res.data,
          'debt_outstanding_amt',
          'record_date',
          cpiDataByYear
        );
        const finalDebtChartData = [];

        res.data.forEach(debt => {
          finalDebtChartData.push({
            x: parseInt(debt.record_fiscal_year),
            y: parseInt(debt.debt_outstanding_amt),
            simplified: simplifyNumber(debt.debt_outstanding_amt, true),
            fiscalYear: debt.record_fiscal_year,
            record_date: debt.record_date,
          });
        });
        finalDebtChartData.reverse();

        const debtMaxYear = finalDebtChartData.reduce((max, spending) =>
          max.x > spending.x ? max : spending
        );

        const debtMinYear = finalDebtChartData.reduce((min, spending) =>
          min.x < spending.x ? min : spending
        );
        setMinYear(debtMinYear.x);
        setMaxYear(debtMaxYear.x);

        const debtMaxAmount = finalDebtChartData.reduce((max, spending) =>
          max.y > spending.y ? max : spending
        );

        const debtMaxAmountRoundedUp =
          Math.ceil(debtMaxAmount.y / 5000000000000) * 5000000000000;
        setMaxAmount(debtMaxAmountRoundedUp);

        const debtFirstAmountActual = finalDebtChartData[0].y;
        const debtLastAmountActual =
          finalDebtChartData[finalDebtChartData.length - 1].y;

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
            color: '#4a0072',
            data: finalDebtChartData,
          },
        ];
        setChartData(totalData);
        setIsLoading(false);

        applyChartScaling(
          chartParent,
          chartWidth.toString(),
          chartHeight.toString()
        );
        addInnerChartAriaLabel(chartParent);
      }
    });
  }, []);

  useEffect(() => {
    applyTextScaling(chartParent, chartWidth, width, fontSize_10);
  }, [width]);

  useEffect(() => {
    applyChartScaling(
      chartParent,
      chartWidth.toString(),
      chartHeight.toString()
    );
  }, []);

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

  const {
    title: chartTitle,
    subtitle: chartSubtitle,
    footer: chartFooter,
    altText: chartAltText,
  } = getChartCopy(minYear, maxYear);

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
        'event': 'chart-hover-debt-100y',
      });
    }, 3000);
  };
  const handleChartMouseLeave = () => {
    clearTimeout(gaTimerDebt100Yrs);
    clearTimeout(ga4Timer);
  };

  const customHeaderStyles={
    marginTop: '1rem',
  }
  const customFooterSpacing={
    marginTop: '2rem',
  }
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '-50% 0% -50% 0%',
  });

  return (
    <>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && (
        <div className={visWithCallout}>
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
            >
              <div
                className={lineChart}
                data-testid={'totalDebtChartParent'}
                onMouseEnter={handleChartMouseEnter}
                onMouseLeave={handleChartMouseLeave}
                role="presentation"
                ref={ref}
              >
                <Line
                  data={chartData}
                  layers={[
                    'grid',
                    'crosshair',
                    'markers',
                    'axes',
                    'areas',
                    'lines',
                    lineChartCustomPoints,
                    props =>
                      CustomSlices({
                        ...props,
                        groupMouseLeave: handleGroupOnMouseLeave,
                        mouseMove: handleMouseLeave,
                        inView,
                      }
                      ),
                    'mesh',
                    'legends',
                  ]}
                  theme={{
                    ...chartConfigs.theme,
                    fontSize:
                      width < pxToNumber(breakpointLg)
                        ? fontSize_14
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
                  }}
                  colors={d => d.color}
                  width={chartWidth}
                  height={chartHeight}
                  margin={
                    width < pxToNumber(breakpointLg)
                      ? { top: 25, right: 25, bottom: 35, left: 65 }
                      : { top: 20, right: 15, bottom: 35, left: 50 }
                  }
                  enablePoints={false}
                  enableGridX={false}
                  enableGridY={false}
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
                  axisTop={null}
                  axisRight={null}
                  axisBottom={chartConfigs.axisBottom}
                  axisLeft={chartConfigs.axisLeft}
                  isInteractive={true}
                  animate={false}
                  enableSlices={'x'}
                  enableArea={true}
                  areaOpacity={1}
                />
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={''}>
            <p>
              Over the past 100 years, the U.S. federal debt has increased from{' '}
              {firstDebtValue} in {minYear} to {lastDebtValue} in {maxYear}.
            </p>
          </VisualizationCallout>
        </div>
      )}
    </>
  );
};

export default withWindowSize(DebtOverLast100y);
