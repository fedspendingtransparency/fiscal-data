import React, { FunctionComponent, useEffect, useState } from 'react';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle } from './savings-bonds-sold-by-type-chart.module.scss';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartLegend from './chart-legend/chart-legend';
import { chartCopy, savingsBondsMap, savingsBonds, getXAxisValues } from './savings-bonds-sold-by-type-chart-helper';
import CustomTooltip from './custom-tooltip/custom-tooltip';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import ChartHeader from './chart-header/chart-header';

interface IChartData {
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
  SN?: number;
}

const SavingsBondsSoldByTypeChart: FunctionComponent<{ chartData: IChartData[] }> = ({ chartData }) => {
  const fyEndpoint = '/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings Bond&sort=-record_date&page[size]=1';
  const [selectedChartView, setSelectedChartView] = useState<string>('amounts');
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [curFyHistory, setCurFyHistory] = useState<string>('');
  const [historyChartDate, setHistoryChartDate] = useState<Date>(new Date());
  const chartTitle = `Savings Bonds Sold by Type Over Time, FY 1935 – FTYD ${curFyHistory}`;
  const [sortedBonds, setSortedBonds] = useState<string[]>();
  const [maxYear, setMaxYear] = useState<number>();
  const [xAxis, setXAxis] = useState<number[]>();
  const header = <ChartHeader selectedChartView={selectedChartView} setSelectedChartView={setSelectedChartView} />;

  useEffect(() => {
    basicFetch(`${apiPrefix}${fyEndpoint}`).then(res => {
      if (res.data) {
        const data = res.data[0];
        setCurFyHistory(data.record_fiscal_year);
        //TODO date offset issue
        setHistoryChartDate(new Date(data.record_date));
      }
    });
  }, []);

  useEffect(() => {
    if (chartData) {
      const max = Number(chartData[chartData.length - 1].year);
      setXAxis(getXAxisValues(1935, max));
      setMaxYear(max);
      setSortedBonds(sortedByDate(savingsBonds, chartData));
    }
  }, [chartData]);

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
      <ChartContainer title={chartTitle} altText={chartCopy.altText} date={historyChartDate} footer={chartCopy.footer} header={header}>
        {selectedChartView === 'amounts' && (
          <div className={chartStyle} data-testid="chartParent">
            {chartData && sortedBonds && (
              <ResponsiveContainer height={377} width="99%">
                <AreaChart data={chartData} margin={{ top: 16, bottom: 0, left: -18, right: 16 }}>
                  <CartesianGrid vertical={false} stroke="#d9d9d9" />
                  <XAxis dataKey="year" type="number" domain={[1935, maxYear]} ticks={xAxis} minTickGap={3} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={value => `$${getShortForm(value)}`}
                    ticks={[0, 5000000000, 10000000000, 15000000000, 20000000000, 25000000000, 30000000000]}
                    domain={[0, 'dataMax']}
                    tickCount={7}
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
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            <ChartLegend lines={savingsBonds} lineMap={savingsBondsMap} setHiddenFields={setHiddenFields} hiddenFields={hiddenFields} />
          </div>
        )}
      </ChartContainer>
    </>
  );
};

export default SavingsBondsSoldByTypeChart;
