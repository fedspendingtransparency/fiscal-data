import React, { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useInView } from 'react-intersection-observer';
import { useWindowSize } from 'usehooks-ts';
import VisualizationCallout from '../../../../../../components/visualization-callout/visualization-callout';
import {
  breakpointLg,
  fontBodyCopy,
  fontSize_12,
  fontSize_14,
  debtExplainerPrimary,
  debtExplainerLightSecondary,
} from '../../../../../../variables.module.scss';
import { boldWeight } from '../../national-debt.module.scss';
import {
  barChartContainer,
  title,
  loadingIcon,
  container,
  valueLabel,
  legend,
  legendItem,
  legendSwatch,
} from './intragovernmental-holdings-chart.module.scss';
import { visWithCallout } from '../../../../explainer.module.scss';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import { addInnerChartAriaLabel } from '../../../../explainer-helpers/explainer-charting-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';

const holdingsKey = 'Intragovernmental Holdings';
const publicDebtKey = 'Debt Held by the Public';

const barGrowthDuration = 2000; // both segments grow together now (no native way to load a bar & then have other grow from its ending point)
const labelFadeDelay = 250; // pause between the bars finishing and the label values fading in
const labelFadeDuration = 400; // length of fading effect for labels
const labelFadeStart = barGrowthDuration + labelFadeDelay;
const entranceComplete = labelFadeStart + labelFadeDuration + 250;

const barSpacing = 30;

const desktopConfig = {
  height: 443,
  margin: { top: 26, right: 122, bottom: 10, left: 122 },
  barSize: 74,
  labelSideOffset: 15,
  labelBaselineOffset: 30,
  tickFontSize: fontSize_14,
};

const mobileConfig = {
  height: 320,
  margin: { top: 20, right: 84, bottom: 10, left: 84 },
  barSize: 54,
  labelSideOffset: 12,
  labelBaselineOffset: 22,
  tickFontSize: fontSize_12,
};

// used for setting order of legend keys
const legendPayload = [
  { value: holdingsKey, type: 'rect', id: holdingsKey, color: debtExplainerLightSecondary },
  { value: publicDebtKey, type: 'rect', id: publicDebtKey, color: debtExplainerPrimary },
];

const getSegmentValue = value => (Array.isArray(value) ? value[1] - value[0] : Number(value));

const formatTrillions = value => `$${getSegmentValue(value).toFixed(2)} T`;

export const BarValueLabel = ({ viewBox = {}, x, y, width, value, index, config }) => {
  const barX = viewBox.x ?? x;
  const barY = viewBox.y ?? y;
  const barWidth = viewBox.width ?? width;
  const alignRight = index !== 0;

  return (
    <text
      className={valueLabel}
      x={alignRight ? barX + barWidth + config.labelSideOffset : barX - config.labelSideOffset}
      y={barY + config.labelBaselineOffset}
      textAnchor={alignRight ? 'start' : 'end'}
      fill={fontBodyCopy}
      fontWeight={boldWeight}
    >
      {formatTrillions(value)}
    </text>
  );
};

export const ChartLegend = () => (
  <ul className={legend} style={{ color: fontBodyCopy }}>
    {legendPayload.map(({ value, color }) => (
      <li key={value} className={legendItem}>
        <span className={legendSwatch} style={{ backgroundColor: color }} />
        {value}
      </li>
    ))}
  </ul>
);

const IntragovernmentalHoldingsChart = ({ data, date, width }) => {
  const { width: windowWidth } = useWindowSize();
  const desktop = windowWidth >= pxToNumber(breakpointLg);
  const config = desktop ? desktopConfig : mobileConfig;

  // handles gap between bars
  const plotWidth = 2 * (config.barSize + barSpacing);
  const chartMaxWidth = plotWidth + config.margin.left + config.margin.right;

  const [shouldAnimate, setShouldAnimate] = useState(false); // chart has scrolled into view
  const [entranceDone, setEntranceDone] = useState(false); // sequence finished, nothing re-animates after this

  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const { mspdSummary } = explainerCitationsMap['national-debt'];

  const renderValueLabel = useCallback(props => <BarValueLabel {...props} config={config} />, [config]);

  const calcPercentIncrease = (key, rows) => {
    const row0 = rows?.[0]?.[key];
    const row1 = rows?.[1]?.[key];
    if (!row0 || !row1) return '--';
    return Math.round(((row1 - row0) / row0) * 100).toFixed();
  };

  // start animation after chart has scrolled into view
  useEffect(() => {
    if (inView && data) {
      setShouldAnimate(true);
    }
  }, [inView, data]);

  // switches animation off so a resize can't replay the entrance
  useEffect(() => {
    if (!shouldAnimate) return;
    const entranceTimer = setTimeout(() => setEntranceDone(true), entranceComplete);

    return () => clearTimeout(entranceTimer);
  }, [shouldAnimate]);

  useEffect(() => {
    if (!!data && shouldAnimate) {
      addInnerChartAriaLabel('breakdownChart');
    }
  }, [data, shouldAnimate]);

  const chartFooter = <p>Visit the {mspdSummary} to explore and download this data.</p>;

  return (
    <>
      <figure className={visWithCallout}>
        <div className={container}>
          <ChartContainer
            title={
              <div className={title}>
                Intragovernmental Holdings and Debt Held by the Public, CY {data?.[0]?.record_calendar_year ?? '--'} and CY{' '}
                {data?.[1]?.record_calendar_year ?? '--'}
              </div>
            }
            altText={
              'Bar chart showing Intergovernmental Holdings and Debt Held by the Public values; comparing the ' +
              'latest complete calendar year values to 10 years prior.'
            }
            footer={chartFooter}
            date={date}
          >
            {!data ? (
              <LoadingIndicator loadingClass={loadingIcon} />
            ) : (
              <div data-testid={'breakdownChart'} className={barChartContainer} style={{ maxWidth: chartMaxWidth }} ref={ref}>
                {shouldAnimate && (
                  <ResponsiveContainer width="100%" height={config.height} debounce={50}>
                    <BarChart data={data} margin={config.margin}>
                      <XAxis
                        dataKey="record_calendar_year"
                        tick={{ fill: fontBodyCopy, fontSize: config.tickFontSize }}
                        tickLine={false}
                        tickMargin={5}
                        axisLine={{ stroke: fontBodyCopy, strokeWidth: 2 }}
                      />
                      <YAxis hide domain={[0, 'dataMax']} />
                      <Bar
                        dataKey={holdingsKey}
                        stackId="debtBreakdown"
                        fill={debtExplainerLightSecondary}
                        barSize={config.barSize}
                        isAnimationActive={!entranceDone}
                        animationBegin={0}
                        animationDuration={barGrowthDuration}
                        animationEasing="linear"
                      >
                        <LabelList dataKey={holdingsKey} content={renderValueLabel} />
                      </Bar>
                      <Bar
                        dataKey={publicDebtKey}
                        stackId="debtBreakdown"
                        fill={debtExplainerPrimary}
                        barSize={config.barSize}
                        isAnimationActive={!entranceDone}
                        animationBegin={0}
                        animationDuration={barGrowthDuration}
                        animationEasing="linear"
                      >
                        <LabelList dataKey={publicDebtKey} content={renderValueLabel} />
                      </Bar>
                      <Legend verticalAlign="bottom" content={<ChartLegend />} wrapperStyle={{ width: '100%', left: 0 }} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </ChartContainer>
        </div>
        <VisualizationCallout color={debtExplainerPrimary}>
          <p>There are two major categories for federal debt: debt held by the public and intragovernmental holdings.</p>

          <p>
            The debt held by the public has increased by{' '}
            <span data-testid="public-debt-increase">{calcPercentIncrease('Debt Held by the Public', data)}%</span> since{' '}
            {data?.[0].record_calendar_year || '--'}. Intragovernmental holdings increased by{' '}
            <span data-testid="govt-debt-increase">{calcPercentIncrease('Intragovernmental Holdings', data)}%</span> since{' '}
            {data?.[0].record_calendar_year || '--'}.
          </p>
        </VisualizationCallout>
      </figure>
    </>
  );
};

export default IntragovernmentalHoldingsChart;
