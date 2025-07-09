import React, { useState } from 'react';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { ChartTableContainer } from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import ChartingTableToggle from '../../../../../components/chart-with-table/chart-table-toggle/charting-table-toggle';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
import { CustomTooltip, Legend } from './state-and-local-government-series-chart-helper';
import { useGetStateAndLocalGovernmentSeriesData } from '../useGetStateAndLocalGovernmentSeriesData';
import { Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { stateAndLocalGovernmentSeriesLight, stateAndLocalGovernmentSeriesPrimary } from '../../../insight.module.scss';

export const StateAndLocalGovernmentSeriesChart = () => {
  const [selectedChartView, setSelectedChartView] = useState<string>('chartView');
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const { chartData, result, latestMonth } = useGetStateAndLocalGovernmentSeriesData(true);
  const [isMobile, setIsMobile] = useState<boolean>(null);
  const [curDate, setCurDate] = useState<number>(0);
  const [curAmount, setCurAmount] = useState<number>(0);
  const [curCount, setCurCount] = useState<number>(0);

  const chartTitle = `Outstanding State and Local Government Series (SLGS) Securities`;
  const toggle = (
    <ChartingTableToggle
      primaryColor={'#0071BC'}
      leftButtonConfig={{
        leftId: 'chartView',
        leftSelected: selectedChartView === 'chartView',
      }}
      rightButtonConfig={{
        rightId: 'tableView',
        rightSelected: selectedChartView === 'tableView',
      }}
      toggleClickHandler={(chartView: string) => setSelectedChartView(chartView)}
      chartId={null}
      leftIcon={faChartColumn}
      rightIcon={faTable}
      leftLabel="toggle for chart view"
      rightLabel="toggle for table view"
    />
  );

  return (
    <>
      <ChartTableContainer title={chartTitle} toggle={toggle}>
        {selectedChartView === 'chartView' && result && (
          <>
            <div>
              <ChartDataHeader
                dateField="Date"
                fiscalYear={curDate}
                right={{ label: 'Amount', value: curAmount }}
                left={{ label: 'Count', value: curCount }}
              />
            </div>
            <div>
              {/*TODO: alter size on light blue legend square*/}
              <Legend />
              <div
                role="presentation"
                onBlur={() => {
                  setChartFocus(false);
                  // resetDataHeader();
                }}
                onFocus={() => setChartFocus(true)}
                onMouseOver={() => setChartHover(true)}
                onMouseLeave={() => setChartHover(false)}
              >
                <ResponsiveContainer height={360} width="99%">
                  <ComposedChart data={result} margin={{ top: 12, bottom: -8, left: 3, right: -18 }} accessibilityLayer>
                    <YAxis
                      dataKey="totalAmount"
                      type="number"
                      tickFormatter={value => {
                        if (value === 0) {
                          return '$0';
                        } else {
                          return `$${getShortForm(value)}`;
                        }
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickCount={7}
                    />
                    <YAxis
                      yAxisId={1}
                      dataKey="totalCount"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      type="number"
                      tickFormatter={value => {
                        if (value === 0) {
                          return '0';
                        } else {
                          return `${value / 1000}K`;
                        }
                      }}
                      tickCount={7}
                    />
                    <Tooltip
                      cursor={{
                        stroke: stateAndLocalGovernmentSeriesLight,
                        strokeWidth: 32,
                      }}
                      content={<CustomTooltip setCount={setCurCount} setAmount={setCurAmount} setDate={setCurDate} />}
                      isAnimationActive={false}
                      active={chartFocus || chartHover}
                    />
                    <Bar dataKey="totalAmount" barSize={20} fill={stateAndLocalGovernmentSeriesPrimary} isAnimationActive={false}>
                      {result.map((entry, index) => {
                        return <Cell key={`cell-${index}`} fill={stateAndLocalGovernmentSeriesPrimary} />;
                      })}
                    </Bar>
                    <Line
                      dataKey="totalCount"
                      yAxisId={1}
                      stroke="#666666"
                      type="monotone"
                      strokeWidth={2}
                      activeDot={false}
                      dot={false}
                      isAnimationActive={false}
                      strokeDasharray="2 2"
                    />
                    <XAxis dataKey="date" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        {/*{selectedChartView === 'tableView' && <DtgTable />}*/}
      </ChartTableContainer>
    </>
  );
};
