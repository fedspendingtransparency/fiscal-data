import React, { FunctionComponent, useEffect, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { chartStyle } from './savings-bonds-sold-by-type-chart.module.scss';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartLegend from './chart-legend/chart-legend';
import { chartCopy, savingsBondsMap, savingsBonds } from './savings-bonds-sold-by-type-chart-helper';
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

const SavingsBondsSoldByTypeChart: FunctionComponent<{ chartData: any }> = ({ chartData }) => {
  const fyEndpoint = '/v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings Bond&sort=-record_date&page[size]=1';
  const [selectedChartView, setSelectedChartView] = useState<string>('amounts');
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [curFyHistory, setCurFyHistory] = useState<string>('');
  const [historyChartDate, setHistoryChartDate] = useState<Date>(new Date());
  const chartTitle = `Savings Bonds Sold by Type Over Time, FY 1935 – FTYD ${curFyHistory}`;
  const [finalChartData, setFinalChartData] = useState<IChartData[]>();
  const [sortedBonds, setSortedBonds] = useState<string[]>();
  const footer = (
    <p>
      Visit the <CustomLink url="/datasets/securities-issued-in-treasurydirect/sales">Securities Issued in TreasuryDirect</CustomLink> dataset for
      data since 2001 and the{' '}
      <CustomLink url="https://www.treasurydirect.gov/research-center/history-of-savings-bond/savings-bond-sales/">
        Historical Savings Bonds Sales by Type
      </CustomLink>{' '}
      for data before 2001 to explore this data.
    </p>
  );

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
    // const finalData = sortByType(chartData, 'record_fiscal_year', 'security_class_desc', 'net_sales_amt');
    setSortedBonds(sortedByDate(savingsBonds, chartData));
    setFinalChartData(chartData);
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
      <ChartContainer title={chartTitle} altText={chartCopy.altText} date={historyChartDate} footer={footer} header={header}>
        {selectedChartView === 'amounts' && (
          <div className={chartStyle} data-testid="chartParent">
            {finalChartData && (
              <ResponsiveContainer height={377} width="99%">
                <AreaChart data={finalChartData} margin={{ top: 16, bottom: 0, left: -18, right: 16 }}>
                  <CartesianGrid vertical={false} stroke="#d9d9d9" />
                  <XAxis dataKey="year" type="number" domain={[1935, 2023]} ticks={[1935, 1955, 1975, 1995, 2015, 2023]} minTickGap={3} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={value => `$${getShortForm(value)}`}
                    ticks={[0, 5000000000, 10000000000, 15000000000, 20000000000, 25000000000, 30000000000]}
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
                    content={<CustomTooltip />}
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
