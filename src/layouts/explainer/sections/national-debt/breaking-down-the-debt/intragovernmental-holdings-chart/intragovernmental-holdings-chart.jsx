import React, { useEffect, useState } from 'react';
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
  valueLabelVisible,
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
const chartParent = 'breakdownChart';

const barGrowthDuration = 2000; // both segments grow together, so the stack lands as one
const labelFadeDelay = 250; // beat between the bars finishing and the values fading in
const entranceBuffer = 300; // covers the fade before animation is switched off for good
const barCategoryGap = 5; // fixed px, so the gap doesn't scale with the plot width

// These are the old chart's *rendered* dimensions (its 550-wide viewBox scaled ~0.85 to fit the
// container), not its viewBox numbers -- recharts draws at real pixel sizes, so nothing scales them
// down anymore. Left/right margins are the gutters the value labels live in.
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

// legend reads in the opposite order from the stack, so it's declared rather than derived from the bars
const legendPayload = [
  { value: publicDebtKey, type: 'rect', id: publicDebtKey, color: debtExplainerPrimary },
  { value: holdingsKey, type: 'rect', id: holdingsKey, color: debtExplainerLightSecondary },
];

// a stacked segment can hand back either the raw value or the segment's [start, end] range
const getSegmentValue = value => (Array.isArray(value) ? value[1] - value[0] : Number(value));

const formatTrillions = value => `$${getSegmentValue(value).toFixed(2)} T`;

// values sit outside the stack: left of the earlier year, right of the most recent one. The text is
// mounted from the start and only its opacity transitions -- mounting it on a timer meant the
// browser had to insert and lay out four nodes mid-animation, which is what caused the jump.
export const BarValueLabel = ({ viewBox = {}, x, y, width, value, index, config, visible }) => {
  const barX = viewBox.x ?? x;
  const barY = viewBox.y ?? y;
  const barWidth = viewBox.width ?? width;
  const alignRight = index !== 0;

  return (
    <text
      className={visible ? `${valueLabel} ${valueLabelVisible}` : valueLabel}
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

export const ChartLegend = ({ payload }) => (
  <ul className={legend} style={{ color: fontBodyCopy }}>
    {payload.map(({ value, color }) => (
      <li key={value} className={legendItem}>
        <span className={legendSwatch} style={{ backgroundColor: color }} />
        {value}
      </li>
    ))}
  </ul>
);

const IntragovernmentalHoldingsChart = ({ sectionId, data, date, width }) => {
  const { width: windowWidth } = useWindowSize();
  const desktop = windowWidth >= pxToNumber(breakpointLg);
  const config = desktop ? desktopConfig : mobileConfig;

  const [shouldAnimate, setShouldAnimate] = useState(false); // chart has scrolled into view
  const [entranceDone, setEntranceDone] = useState(false); // sequence finished; nothing re-animates after this
  const [labelsVisible, setLabelsVisible] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const { mspdSummary } = explainerCitationsMap['national-debt'];

  const calcPercentIncrease = (key, rows) => {
    const row0 = rows?.[0]?.[key];
    const row1 = rows?.[1]?.[key];
    if (!row0 || !row1) return '--';
    return Math.round(((row1 - row0) / row0) * 100).toFixed();
  };

  // hold the animation until the chart has scrolled into view
  useEffect(() => {
    if (inView && data) {
      setShouldAnimate(true);
    }
  }, [inView, data]);

  // values fade in a beat after the bars land, then animation is switched off entirely -- otherwise
  // a resize makes recharts replay the entrance
  useEffect(() => {
    if (!shouldAnimate) return;
    const labelTimer = setTimeout(() => setLabelsVisible(true), barGrowthDuration + labelFadeDelay);
    const entranceTimer = setTimeout(() => setEntranceDone(true), barGrowthDuration + labelFadeDelay + entranceBuffer);

    return () => {
      clearTimeout(labelTimer);
      clearTimeout(entranceTimer);
    };
  }, [shouldAnimate]);

  // runs once the chart is actually mounted, which only happens after it scrolls in
  useEffect(() => {
    if (!!data && shouldAnimate) {
      addInnerChartAriaLabel(chartParent);
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
              <div data-testid={chartParent} className={barChartContainer} ref={ref}>
                {shouldAnimate && (
                  <ResponsiveContainer width="100%" height={config.height} debounce={50}>
                    <BarChart data={data} margin={config.margin} barCategoryGap={barCategoryGap}>
                      <XAxis
                        dataKey="record_calendar_year"
                        tick={{ fill: fontBodyCopy, fontSize: config.tickFontSize }}
                        tickLine={false}
                        tickMargin={5}
                        axisLine={{ stroke: fontBodyCopy, strokeWidth: 2 }}
                      />
                      {/* hidden, but pinned to the data max so the stack fills the plot like the old chart */}
                      <YAxis hide domain={[0, 'dataMax']} />
                      <Bar
                        dataKey={holdingsKey}
                        stackId="debtBreakdown"
                        fill={debtExplainerLightSecondary}
                        barSize={config.barSize}
                        isAnimationActive={!entranceDone}
                        animationBegin={0}
                        animationDuration={barGrowthDuration}
                        animationEasing="ease-out"
                      >
                        <LabelList dataKey={holdingsKey} content={props => <BarValueLabel {...props} config={config} visible={labelsVisible} />} />
                      </Bar>
                      <Bar
                        dataKey={publicDebtKey}
                        stackId="debtBreakdown"
                        fill={debtExplainerPrimary}
                        barSize={config.barSize}
                        isAnimationActive={!entranceDone}
                        animationBegin={0}
                        animationDuration={barGrowthDuration}
                        animationEasing="ease-out"
                      >
                        <LabelList dataKey={publicDebtKey} content={props => <BarValueLabel {...props} config={config} visible={labelsVisible} />} />
                      </Bar>
                      {/* payload is declared so the legend can read in reverse without restacking the bars */}
                      <Legend verticalAlign="bottom" content={<ChartLegend />} payload={legendPayload} wrapperStyle={{ width: '100%', left: 0 }} />
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
