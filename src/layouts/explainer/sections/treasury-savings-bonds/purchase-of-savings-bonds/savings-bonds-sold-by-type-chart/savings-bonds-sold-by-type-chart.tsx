import React, { FunctionComponent, useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle, loadingIcon, container } from './savings-bonds-sold-by-type-chart.module.scss';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartLegend from './chart-legend/chart-legend';
import { chartCopy, getXAxisValues, savingsBonds, savingsBondsMap, yAxisFormatter } from './savings-bonds-sold-by-type-chart-helper';
import CustomTooltip from './custom-tooltip/custom-tooltip';
import ChartHeader from './chart-header/chart-header';
import ChartDescription from './chart-description/chart-description';
import { analyticsEventHandler } from '../../../../explainer-helpers/explainer-helpers';
import { ga4DataLayerPush } from '../../../../../../helpers/google-analytics/google-analytics-helper';
import globalConstants from '../../../../../../helpers/constants';
import LoadingIndicator from '../../../../../../components/loading-indicator/loading-indicator';

export interface ISavingBondsByTypeChartData {
  year: string;
  AD?: number;
  E?: number;
  EE?: number;
  F?: number;
  G?: number;
  H?: number;
  HH?: number;
  I?: number;
  J?: number;
  K?: number;
}

interface ISavingsBondsSoldByTypeChart {
  chartData: ISavingBondsByTypeChartData[];
  inflationChartData: ISavingBondsByTypeChartData[];
  curFy: number;
  chartDate: Date;
}

let gaTimer;

const SavingsBondsSoldByTypeChart: FunctionComponent<ISavingsBondsSoldByTypeChart> = ({ chartData, inflationChartData, curFy, chartDate }) => {
  const [selectedChartView, setSelectedChartView] = useState<string>('amounts');
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const chartTitle = `Savings Bonds Sold by Type Over Time, FY 1935 – FYTD ${curFy}`;
  const [sortedBonds, setSortedBonds] = useState<string[]>();
  const [maxYear, setMaxYear] = useState<number>();
  const [xAxis, setXAxis] = useState<number[]>();
  const [inflationSwitch, setInflationSwitch] = useState<boolean>(false);
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);

  let activeChartData = inflationSwitch ? inflationChartData : chartData;
  const handleInflationToggle = (isAdjusted: boolean) => {
    setInflationSwitch(isAdjusted);
    analyticsEventHandler('Savings Bonds - Savings Bonds Sold Inflation Adjustment', 'Chart Toggle');
  };

  const { explainers } = globalConstants;

  const handleChartMouseEnter = () => {
    setChartHover(true);
    const eventLabel = 'Savings Bonds - Savings Bonds Sold by Type Over Time';
    const eventAction = 'Chart Hover';
    gaTimer = setTimeout(() => {
      analyticsEventHandler(eventLabel, eventAction);
      ga4DataLayerPush({
        event: eventAction,
        eventLabel: eventLabel,
      });
    }, explainers.chartHoverDelay);
  };

  const handleChartMouseLeave = () => {
    setChartHover(false);
    clearTimeout(gaTimer);
  };

  const header = (
    <ChartHeader
      selectedChartView={selectedChartView}
      setSelectedChartView={setSelectedChartView}
      onToggle={handleInflationToggle}
      isInflationAdjusted={inflationSwitch}
    />
  );

  useEffect(() => {
    if (chartData) {
      const max = Number(chartData[chartData.length - 1].year);
      setXAxis(getXAxisValues(1935, max));
      setMaxYear(max);
      setSortedBonds(sortedByDate(savingsBonds, chartData));
    }
    if (selectedChartView === 'description') {
      activeChartData = chartData;
    }
  }, [chartData, activeChartData, selectedChartView]);

  const sortedByDate = (savingsBonds, data) => {
    if (data) {
      const sorted = [];
      data.forEach(year => {
        savingsBonds.forEach(bondType => {
          if (!!year[bondType] && !sorted.includes(bondType)) {
            sorted.push(bondType);
          }
        });
      });
      return sorted;
    }
  };

  return (
    <>
      <div className={container}>
        <ChartContainer
          title={chartTitle}
          altText={chartCopy.altText}
          date={chartDate}
          footer={chartCopy.footer}
          header={header}
          customContainerStyles={{
            minHeight: 'var(--chart-height)',
          }}
        >
          {selectedChartView === 'amounts' && (
            <div className={chartStyle} data-testid="chartParent">
              <div
                role="presentation"
                onBlur={() => setChartFocus(false)}
                onFocus={() => setChartFocus(true)}
                onMouseEnter={handleChartMouseEnter}
                onMouseLeave={handleChartMouseLeave}
              >
                {!chartData || !sortedBonds ? (
                  <LoadingIndicator loadingClass={loadingIcon} />
                ) : (
                  <ResponsiveContainer height={377} width="99%">
                    <AreaChart data={activeChartData} margin={{ top: 16, bottom: 0, left: -4, right: 16 }} accessibilityLayer>
                      <CartesianGrid vertical={false} stroke="#d9d9d9" />
                      <ReferenceLine y={0} stroke="#555555" />
                      <XAxis dataKey="year" type="number" domain={[1935, maxYear]} ticks={xAxis} minTickGap={3} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={value => `${yAxisFormatter(parseFloat(value))}`}
                        domain={['auto', 'dataMax']}
                        tickCount={8}
                      />
                      {sortedBonds.map((id, index) => {
                        return (
                          <Area
                            dataKey={id}
                            key={index}
                            fill={savingsBondsMap[id].color}
                            fillOpacity={0.8}
                            stroke={savingsBondsMap[id].color}
                            strokeOpacity={0.8}
                            hide={hiddenFields.includes(id)}
                            isAnimationActive={false}
                            activeDot={false}
                          />
                        );
                      })}
                      <Tooltip
                        content={<CustomTooltip hiddenFields={hiddenFields} />}
                        cursor={{ strokeDasharray: '4 4', stroke: '#555', strokeWidth: '2px' }}
                        isAnimationActive={false}
                        active={chartFocus || chartHover}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <ChartLegend lines={savingsBonds} lineMap={savingsBondsMap} setHiddenFields={setHiddenFields} hiddenFields={hiddenFields} />
            </div>
          )}
          {selectedChartView === 'description' && <ChartDescription />}
        </ChartContainer>
      </div>
    </>
  );
};

export default SavingsBondsSoldByTypeChart;
