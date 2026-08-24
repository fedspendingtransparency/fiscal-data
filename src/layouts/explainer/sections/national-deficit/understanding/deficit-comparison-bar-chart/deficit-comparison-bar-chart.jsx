import { visWithCallout } from '../../../../explainer.module.scss';
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import React, { useCallback, useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { barChart, barLabel, container, loadingIcon } from './deficit-comparison-bar-chart.module.scss';
import { deficitExplainerPrimary } from '../../national-deficit.module.scss';
import { breakpointLg, fontBodyCopy } from '../../../../../../variables.module.scss';
import {
  barChartColors,
  desktopConfig,
  entranceComplete,
  mobileConfig,
  spendingGrowthBegin,
  spendingGrowthDuration,
  stackGrowthDuration,
} from './deficit-comparison-bar-chart-helper';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { nationalDeficitSectionConfigs } from '../../national-deficit';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { addInnerChartAriaLabel, chartInViewProps } from '../../../../explainer-helpers/explainer-charting-helper';
import { useInView } from 'react-intersection-observer';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';
import { useErrorBoundary } from 'react-error-boundary';
import { useWindowSize } from 'usehooks-ts';
import { getShortForm } from '../../../../../../utils/rounding-utils';

const [revenueColor, deficitColor, spendingColor] = barChartColors;

const getSegmentValue = value => (Array.isArray(value) ? value[1] - value[0] : Number(value));

export const BarLabel = ({ viewBox = {}, value, label, alignRight, config }) => {
  const { x = 0, y = 0, width = 0, height = 0 } = viewBox;
  const textX = alignRight ? x + width + config.labelOffsetRight : x - config.labelOffsetLeft;
  const textY = y + height / 2 + config.labelBaselineOffset;

  return (
    <>
      <text className={barLabel} x={textX} y={textY} textAnchor="middle" fill={fontBodyCopy} style={{ fontSize: config.labelFontSize }}>
        {`$${getShortForm(getSegmentValue(value))}`}
      </text>
      <text
        className={barLabel}
        x={textX}
        y={textY + config.labelLineHeight}
        textAnchor="middle"
        fill={fontBodyCopy}
        style={{ fontSize: config.labelFontSize, fontWeight: config.labelNameWeight }}
      >
        {label}
      </text>
    </>
  );
};

const DeficitComparisonBarChart = ({ sectionId }) => {
  const [date, setDate] = useState(null);
  const [lastFiscalYear, setLastFiscalYear] = useState(0);
  const [deficitValue, setDeficitValue] = useState(0);
  const [deficitLabel, setDeficitLabel] = useState('');
  const [deficitChangeValue, setDeficitChangeValue] = useState(0);
  const [deficitChangeLabel, setDeficitChangeLabel] = useState('');
  const [revenueValue, setRevenueValue] = useState(0);
  const [revenueLabel, setRevenueLabel] = useState('');
  const [spendingValue, setSpendingValue] = useState(0);
  const [spendingLabel, setSpendingLabel] = useState('');
  const [data, setData] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(false); // chart has scrolled into view
  const [entranceDone, setEntranceDone] = useState(false); // sequence finished, nothing re-animates after this
  const { width } = useWindowSize();

  const { endpoints } = nationalDeficitSectionConfigs[sectionId];
  const { mtsOutlays } = explainerCitationsMap['national-deficit'];
  const desktop = width >= pxToNumber(breakpointLg);
  const config = desktop ? desktopConfig : mobileConfig;
  const chartParent = 'chartParentDiv';
  const { showBoundary } = useErrorBoundary();
  const { ref, inView } = useInView(chartInViewProps);

  const renderRevenueLabel = useCallback(props => <BarLabel {...props} label="Revenue" config={config} />, [config]);
  const renderDeficitLabel = useCallback(props => <BarLabel {...props} label="Deficit" config={config} />, [config]);
  const renderSpendingLabel = useCallback(props => <BarLabel {...props} label="Spending" alignRight config={config} />, [config]);

  const footer = (
    <div>
      Visit the {mtsOutlays} dataset to explore and download this data.
      <p>Please note: This data visual only includes completed fiscal years. The following year will be displayed at the end of the fiscal year.</p>
    </div>
  );

  const chartCopy = {
    title: 'U.S. Deficit Compared to Revenue and Spending, FY ',
    altText: 'Bar chart comparing the differences between the U.S. government’s spending and revenue, resulting in a deficit for FY ',
    footer: footer,
  };

  const dateEndpoint = endpoints[0];
  const deficitEndpoint = endpoints[1];
  const revenueEndpoint = endpoints[2];
  const spendingEndpoint = endpoints[3];
  const deficitChangeEndpoint = endpoints[4];

  useEffect(() => {
    basicFetch(`${apiPrefix}${dateEndpoint.path}`)
      .then(response => {
        setDate(getDateWithoutTimeZoneAdjust(response.data[0][dateEndpoint.dateField]));
        setLastFiscalYear(response.data[0][dateEndpoint.valueField]);
      })
      .catch(err => {
        showBoundary(err);
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${deficitEndpoint.path}`)
      .then(response => {
        const value = Math.abs(response.data[0][deficitEndpoint.valueField]);
        setDeficitValue(value);
        setDeficitLabel((value / 1000000000000).toFixed(2));
      })
      .catch(err => {
        showBoundary(err);
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${revenueEndpoint.path}`)
      .then(response => {
        const value = response.data[0][revenueEndpoint.valueField];
        setRevenueValue(value);
        setRevenueLabel((value / 1000000000000).toFixed(2));
      })
      .catch(err => {
        showBoundary(err);
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${spendingEndpoint.path}`)
      .then(response => {
        const value = response.data[0][spendingEndpoint.valueField];
        setSpendingValue(value);
        setSpendingLabel((value / 1000000000000).toFixed(2));
      })
      .catch(err => {
        showBoundary(err);
      });
  }, []);

  useEffect(() => {
    basicFetch(`${apiPrefix}${deficitChangeEndpoint.path}`)
      .then(response => {
        const value = Math.abs(response.data[0][deficitChangeEndpoint.valueField]);
        setDeficitChangeValue(value);
      })
      .catch(err => {
        showBoundary(err);
      });
  }, []);

  useEffect(() => {
    if (inView && data) {
      setShouldAnimate(true);
    }
  }, [inView, data]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const entranceTimer = setTimeout(() => setEntranceDone(true), entranceComplete);

    return () => clearTimeout(entranceTimer);
  }, [shouldAnimate]);

  useEffect(() => {
    if (!!data && shouldAnimate) {
      addInnerChartAriaLabel(chartParent);
    }
  }, [data, shouldAnimate]);

  if (!data && deficitValue && revenueValue && spendingValue && deficitChangeValue) {
    const deficitDifference = Math.abs(deficitValue - deficitChangeValue);
    let deficitDifferenceText = '';

    if (deficitDifference >= 1000000000000) {
      deficitDifferenceText = `$${(deficitDifference / 1000000000000).toFixed(2)} trillion`;
    } else {
      deficitDifferenceText = `$${(deficitDifference / 1000000000).toFixed()} billion`;
    }

    if (deficitValue > deficitChangeValue) {
      setDeficitChangeLabel(`an increase of ${deficitDifferenceText || '--'}`);
    } else if (deficitValue < deficitChangeValue) {
      setDeficitChangeLabel(`a decrease of ${deficitDifferenceText || '--'}`);
    } else {
      setDeficitChangeLabel('remaining unchanged');
    }

    setData([
      {
        id: 0,
        revenue: revenueValue,
        deficit: deficitValue,
        spending: spendingValue,
      },
    ]);
  }

  return (
    <figure className={visWithCallout}>
      <>
        <div data-testid="deficitComparisonChart" className={container}>
          <ChartContainer
            title={`${chartCopy.title}${lastFiscalYear || '--'}`}
            altText={`${chartCopy.altText}${lastFiscalYear}.`}
            footer={chartCopy.footer}
            date={date}
          >
            {!data ? (
              <LoadingIndicator loadingClass={loadingIcon} />
            ) : (
              <div data-testid={chartParent} className={barChart} style={{ maxWidth: config.width }} ref={ref}>
                {shouldAnimate && (
                  <ResponsiveContainer width="100%" height={config.height} debounce={50}>
                    <BarChart data={data} margin={config.margin} barSize={config.barSize} barGap={config.barGap}>
                      <XAxis dataKey="id" height={1} tick={false} tickLine={false} axisLine={{ stroke: fontBodyCopy, strokeWidth: 1 }} />
                      <YAxis hide domain={[0, 'dataMax']} />
                      <Bar
                        dataKey="revenue"
                        stackId="deficitComparison"
                        fill={revenueColor}
                        isAnimationActive={!entranceDone}
                        animationBegin={0}
                        animationDuration={stackGrowthDuration}
                        animationEasing="linear"
                      >
                        {/*recharts holds a LabelList back until its bar finishes animating*/}
                        <LabelList dataKey="revenue" content={renderRevenueLabel} />
                      </Bar>
                      <Bar
                        dataKey="deficit"
                        stackId="deficitComparison"
                        fill={deficitColor}
                        isAnimationActive={!entranceDone}
                        animationBegin={0}
                        animationDuration={stackGrowthDuration}
                        animationEasing="linear"
                      >
                        <LabelList dataKey="deficit" content={renderDeficitLabel} />
                      </Bar>
                      <Bar
                        dataKey="spending"
                        fill={spendingColor}
                        isAnimationActive={!entranceDone}
                        animationBegin={spendingGrowthBegin}
                        animationDuration={spendingGrowthDuration}
                        animationEasing="linear"
                      >
                        <LabelList dataKey="spending" content={renderSpendingLabel} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </ChartContainer>
        </div>
        <VisualizationCallout color={deficitExplainerPrimary}>
          <p>
            In FY {lastFiscalYear || '--'} total government spending was ${spendingLabel || '--'} trillion and total revenue was $
            {revenueLabel || '--'} trillion, resulting in a deficit of ${deficitLabel || '--'} trillion, {deficitChangeLabel} from the previous fiscal
            year.
          </p>
        </VisualizationCallout>
      </>
    </figure>
  );
};

export default DeficitComparisonBarChart;
