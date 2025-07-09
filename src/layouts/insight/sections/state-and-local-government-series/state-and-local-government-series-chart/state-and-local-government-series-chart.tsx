import React, { useState } from 'react';
import ChartDataHeader from '../../../../explainer/explainer-components/chart-data-header/chart-data-header';
import { ChartTableContainer } from '../../../../../components/chart-with-table/chart-table-container/chart-table-container';
import ChartingTableToggle from '../../../../../components/chart-with-table/chart-table-toggle/charting-table-toggle';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
import { Legend } from './state-and-local-government-series-chart-helper';
import { useGetStateAndLocalGovernmentSeriesData } from '../useGetStateAndLocalGovernmentSeriesData';
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { interestExpensePrimary } from '../../../insight.module.scss';

export const StateAndLocalGovernmentSeriesChart = () => {
  const [selectedChartView, setSelectedChartView] = useState<string>('chartView');
  const [chartFocus, setChartFocus] = useState<boolean>(false);
  const [chartHover, setChartHover] = useState<boolean>(false);
  const { chartData, result, latestMonth } = useGetStateAndLocalGovernmentSeriesData(true);

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

  console.log('last 12 months', result);

  return (
    <>
      <ChartTableContainer title={chartTitle} toggle={toggle}>
        {selectedChartView === 'chartView' && result && (
          <>
            <div>
              <ChartDataHeader dateField="Date" fiscalYear="p1" right={{ label: 'Amount', value: `p2` }} left={{ label: 'Count', value: `p3` }} />
            </div>
            <div>
              {/*TODO: alter size on light blue legend square*/}
              <Legend />.{/*TODO: add hover/focus stuff to underneath div*/}
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
                    <CartesianGrid vertical={false} stroke="#d9d9d9" />
                    <XAxis dataKey="date" />
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
                      tickCount={5}
                      // ticks={expenseYAxisValues}
                      tick={{ fill: interestExpensePrimary }}
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
                          return '$0';
                        } else {
                          return `$${getShortForm(value)}`;
                        }
                      }}
                      tickCount={5}
                      // ticks={expenseYAxisValues}
                      tick={{ fill: interestExpensePrimary }}
                    />
                    <Bar dataKey="totalAmount" barSize={20} fill={interestExpensePrimary} isAnimationActive={false}>
                      {result.map((entry, index) => {
                        console.log(entry);
                        return <Cell key={`cell-${index}`} fill={interestExpensePrimary} />;
                      })}
                    </Bar>
                    <Line
                      dataKey="totalCount"
                      yAxisId={1}
                      stroke="#666666"
                      type="monotone"
                      strokeWidth={1}
                      activeDot={false}
                      isAnimationActive={false}
                    />
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
