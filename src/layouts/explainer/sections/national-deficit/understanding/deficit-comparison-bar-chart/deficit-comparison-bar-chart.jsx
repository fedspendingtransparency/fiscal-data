import { visWithCallout } from '../../../../explainer.module.scss';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import React, { useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { barChart, container, loadingIcon } from './deficit-comparison-bar-chart.module.scss';
import { deficitExplainerPrimary } from '../../national-deficit.module.scss';
import { breakpointLg, fontBodyCopy } from '../../../../../../variables.module.scss';
import { barChartColors, desktopHeight, mobileHeight, layers, theme } from './deficit-comparison-bar-chart-helper';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { nationalDeficitSectionConfigs } from '../../national-deficit';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { addInnerChartAriaLabel, chartInViewProps } from '../../../../explainer-helpers/explainer-charting-helper';
import CustomBar from './custom-bar/customBar';
import { useInView } from 'react-intersection-observer';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';
import { useErrorBoundary } from 'react-error-boundary';
import { useWindowSize } from 'usehooks-ts';

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
  const [debtMarkerDelay, setDebtMarkerDelay] = useState(null);
  const { width } = useWindowSize();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const { endpoints } = nationalDeficitSectionConfigs[sectionId];
  const { mtsOutlays } = explainerCitationsMap['national-deficit'];
  const desktop = width >= pxToNumber(breakpointLg);
  const chartParent = 'chartParentDiv';
  const { showBoundary } = useErrorBoundary();
  const { ref, inView } = useInView(chartInViewProps);

  const setAnimationDurations = data => {
    if (data && data.length) {
      const revenue = parseFloat(data[0].revenue);
      const deficit = parseFloat(data[0].deficit);
      const spending = parseFloat(data[0].spending);
      const totalDuration = 2000;
      const total = revenue + deficit + spending;
      const revenueDuration = (revenue / total) * totalDuration;
      const deficitDuration = (deficit / total) * totalDuration;
      const spendingDuration = (spending / total) * totalDuration;
      if (!debtMarkerDelay) {
        setDebtMarkerDelay(revenueDuration + deficitDuration + spendingDuration + 1250);
      }
      data[0].revenue_animation_duration = revenueDuration;
      data[0].deficit_animation_duration = deficitDuration;
      data[0].spending_animation_duration = spendingDuration;
      data[0].revenue_deficit_animation_duration = revenueDuration + deficitDuration;
      return data;
    }
    return data;
  };

  const chartData = data;

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
    addInnerChartAriaLabel(chartParent);
  }, [data]);

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
        <div data-testid="deficitComparisonChart" className={container} ref={ref}>
          <ChartContainer
            title={`${chartCopy.title}${lastFiscalYear || '--'}`}
            altText={`${chartCopy.altText}${lastFiscalYear}.`}
            footer={chartCopy.footer}
            date={date}
          >
            {!data ? (
              <LoadingIndicator loadingClass={loadingIcon} />
            ) : (
              <ResponsiveContainer width="100%" height={desktop ? desktopHeight : mobileHeight}>
                {shouldAnimate && (
                  <BarChart
                    data={chartData}
                    barSize={70}
                    barGap={15}
                    margin={desktop ? { top: 0, right: 74, bottom: 0, left: 74 } : { top: 0, right: 65, bottom: 0, left: 65 }}
                  >
                    <XAxis dataKey="id" tickLine={false} tick={false} height={1} axisLine={{ stroke: fontBodyCopy, strokeWidth: 1 }} />
                    <YAxis axisLine={false} tickLine={false} tick={false} />
                    <Bar
                      dataKey="revenue"
                      stackId="total"
                      animationBegin={0}
                      animationDuration={1500}
                      fill={barChartColors[0]}
                      shape={props => <CustomBar {...props} dataKey="revenue" inView={inView} />}
                    />
                    <Bar
                      dataKey="deficit"
                      stackId="total"
                      animationBegin={0}
                      animationDuration={1500}
                      fill={barChartColors[1]}
                      shape={props => <CustomBar {...props} dataKey="deficit" inView={inView} />}
                    />
                    <Bar
                      dataKey="spending"
                      fill={barChartColors[2]}
                      animationBegin={1500}
                      animationDuration={1500}
                      shape={props => <CustomBar {...props} dataKey="spending" inView={inView} />}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
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
