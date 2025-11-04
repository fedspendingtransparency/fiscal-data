import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg, debtExplainerPrimary, fontSize_10 } from '../../../../../../variables.module.scss';
import React, { useEffect, useState } from 'react';
import Analytics from '../../../../../../utils/analytics/analytics';
import { container, header, headerContainer, lineChartContainer, subHeader } from './debt-trends-over-time-chart.module.scss';
import { visWithCallout } from '../../../../explainer.module.scss';
import { Line } from '@nivo/line';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import {
  addInnerChartAriaLabel,
  applyChartScaling,
  applyTextScaling,
  formatPercentage,
  getChartTheme,
  LineChartCustomPoint,
  nivoCommonLineChartProps,
} from '../../../../explainer-helpers/explainer-charting-helper';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import CustomSlices from '../../../../../../components/nivo/custom-slice/custom-slice';
import { useRecoilValueLoadable } from 'recoil';
import { debtOutstandingData, debtOutstandingLastCachedState } from '../../../../../../recoil/debtOutstandingDataState';
import useShouldRefreshCachedData from '../../../../../../recoil/hooks/useShouldRefreshCachedData';
import { useInView } from 'react-intersection-observer';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { getChangeLabel } from '../../../../heros/hero-helper';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';

let gaTimerDebtTrends;
let ga4Timer;

export const DebtTrendsOverTimeChart = ({ sectionId, beaGDPData, width }) => {
  const [lineChartHoveredYear, setLineChartHoveredYear] = useState('');
  const [lineChartHoveredValue, setLineChartHoveredValue] = useState('');
  const [debtTrendsData, setDebtTrendsData] = useState([]);
  const [isLoadingDebtTrends, setIsLoadingDebtTrends] = useState(true);
  const [lastDebtValue, setLastDebtValue] = useState({});
  const [lastRawDebtValue, setLastRawDebtValue] = useState('');
  const [lastGDPValue, setLastGDPValue] = useState('');
  const data = useRecoilValueLoadable(debtOutstandingData);
  useShouldRefreshCachedData(Date.now(), debtOutstandingData, debtOutstandingLastCachedState);

  const chartParent = 'debtTrendsChart';
  const chartWidth = 550;
  const chartHeight = 490;

  const { bea, historicalDebt } = explainerCitationsMap['national-debt'];

  const processData = () => {
    const { finalGDPData } = beaGDPData;
    const debtData = data.contents.payload;
    const lastGDPValue = finalGDPData[finalGDPData.length - 1];
    const debtToGDP = [];
    const lastRawDebtMatchedValue = debtData.find(entry => entry.record_date.includes(lastGDPValue.fiscalYear));
    finalGDPData.forEach(GDPEntry => {
      const record = debtData.find(entry => entry.record_date.includes(GDPEntry.fiscalYear));
      if (record) {
        debtToGDP.push({
          x: GDPEntry.x,
          y: Math.round((parseFloat(record.debt_outstanding_amt) / GDPEntry.actual) * 100),
        });
      }
    });
    const finalData = [
      {
        id: 'us',
        color: 'hsl(219, 70%, 50%)',
        data: debtToGDP,
      },
    ];
    setDebtTrendsData(finalData);
    setLastDebtValue(finalData[0].data[finalData[0].data.length - 1]);
    if (lastRawDebtMatchedValue) setLastRawDebtValue(lastRawDebtMatchedValue.debt_outstanding_amt);
    setLastGDPValue(lastGDPValue);
    setIsLoadingDebtTrends(false);
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
  }, [isLoadingDebtTrends]);

  const customHeaderStyles = {
    marginTop: '1rem',
  };

  const customFooterSpacing = {
    marginTop: '2rem',
  };

  const handleMouseMove = slice => {
    const debtData = slice.points[0].data;
    if (debtData) {
      setLineChartHoveredValue(formatPercentage(debtData.y));
      setLineChartHoveredYear(debtData.x);
    }
  };

  const handleMouseEnterLineChart = () => {
    gaTimerDebtTrends = setTimeout(() => {
      Analytics.event({
        category: 'Explainers',
        action: 'Chart Hover',
        label: 'Debt - Federal Debt Trends Over Time',
      });
    }, 3000);
    ga4Timer = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'chart-hover-debt-trends',
      });
    }, 3000);
  };

  const handleMouseLeaveLineChart = () => {
    clearTimeout(gaTimerDebtTrends);
    clearTimeout(ga4Timer);
  };

  const lineChartOnMouseLeave = () => {
    setLineChartHoveredValue(formatPercentage(lastDebtValue.y));
    setLineChartHoveredYear(lastDebtValue.x);
  };

  const headerContent = () => (
    <div className={headerContainer}>
      <div>
        <div className={header}>{lineChartHoveredYear === '' ? lastDebtValue.x : lineChartHoveredYear}</div>
        <span className={subHeader}>Fiscal Year</span>
      </div>
      <div>
        <div className={header}>{lineChartHoveredValue === '' ? lastDebtValue.y + '%' : lineChartHoveredValue}</div>
        <span className={subHeader}>Debt to GDP</span>
      </div>
    </div>
  );

  const footerContent = (
    <>
      <p>
        Visit the {historicalDebt} dataset to explore and download this data. The GDP data is sourced from the {bea}.
      </p>
      <p>Please note: This chart is updated as new GDP data is released, even if new debt data is available.</p>
    </>
  );

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <>
      {isLoadingDebtTrends && <LoadingIndicator />}
      {!isLoadingDebtTrends && debtTrendsData && (
        <figure className={visWithCallout} ref={ref}>
          <div className={container}>
            <ChartContainer
              title={`Federal Debt Trends Over Time, FY 1948 – ${lastDebtValue.x}`}
              subTitle="Debt to Gross Domestic Product (GDP)"
              header={headerContent()}
              footer={footerContent}
              date={getDateWithoutTimeZoneAdjust(`${lastDebtValue.x}-09-30`)}
              altText={`Line graph displaying the federal debt to GDP trend over time from ${debtTrendsData[0].data[0].x} to ${lastDebtValue.x}.`}
              customHeaderStyles={customHeaderStyles}
              customFooterSpacing={customFooterSpacing}
            >
              <div
                className={lineChartContainer}
                data-testid={`${chartParent}`}
                onMouseEnter={handleMouseEnterLineChart}
                onMouseLeave={handleMouseLeaveLineChart}
                id="debt-trends"
                role="presentation"
              >
                <Line
                  {...nivoCommonLineChartProps}
                  data={debtTrendsData}
                  width={chartWidth}
                  height={chartHeight}
                  theme={getChartTheme(width)}
                  layers={[
                    'grid',
                    'crosshair',
                    'lines',
                    'axes',
                    props =>
                      LineChartCustomPoint({
                        ...props,
                        seriesId: 'us',
                      }),
                    props =>
                      CustomSlices({
                        ...props,
                        inView,
                        mouseMove: handleMouseMove,
                        groupMouseLeave: lineChartOnMouseLeave,
                      }),
                    'mesh',
                  ]}
                  margin={
                    width < pxToNumber(breakpointLg) ? { top: 10, right: 25, bottom: 40, left: 55 } : { top: 10, right: 25, bottom: 30, left: 50 }
                  }
                  xScale={{
                    type: 'linear',
                    min: 1948,
                    max: lastDebtValue.x,
                  }}
                  yScale={{
                    type: 'linear',
                    min: 0,
                    max: 140,
                    stacked: true,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 6,
                    tickPadding: 8,
                    tickRotation: 0,
                    tickValues: 9,
                  }}
                  axisLeft={{
                    format: formatPercentage,
                    orient: 'left',
                    tickSize: 6,
                    tickPadding: 8,
                    tickValues: 8,
                  }}
                  pointLabelYOffset={-12}
                  colors={debtExplainerPrimary}
                  onMouseLeave={lineChartOnMouseLeave}
                />
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={debtExplainerPrimary}>
            <p>
              The average GDP for fiscal year {lastDebtValue.x} was ${getShortForm(lastGDPValue.actual)}, which was{' '}
              {getChangeLabel(lastGDPValue.actual, lastRawDebtValue, true)} the U.S. debt of ${getShortForm(lastRawDebtValue)}. This resulted in a
              Debt to GDP Ratio of {lastDebtValue.y} percent. Generally, a higher Debt to GDP ratio indicates a government will have greater
              difficulty in repaying its debt.
            </p>
          </VisualizationCallout>
        </figure>
      )}
    </>
  );
};
