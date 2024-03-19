import React, { FunctionComponent, useEffect, useState } from 'react';
import { chartCopy, CustomTooltip } from './i-bond-sales-chart-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { LineChart, ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import ChartDataHeader from '../../../../explainer-components/chart-data-header/chart-data-header';
import { chartLegend, lengendItem, leftLine, label, chartStyle, leftLabel, rightLine, line, headerContainer } from './i-bond-sales-chart.module.scss';
import classNames from 'classnames';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { ICpiDataMap } from '../../../../../../models/ICpiDataMap';
import { yAxisFormatter } from '../savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';

interface IIBondsSalesChart {
  cpi12MonthPercentChange: ICpiDataMap;
  curFy: number;
}

const IBondSalesChart: FunctionComponent<IIBondsSalesChart> = ({ cpi12MonthPercentChange, curFy }) => {
  const lastUpdated = new Date();
  const [curInflation, setCurInflation] = useState(7);
  const [curSales, setCurSales] = useState('17 B');
  const [curYear, setCurYear] = useState(2023);
  const [chartData, setChartData] = useState(null);
  const [xAxisValues, setXAxisValues] = useState(null);
  const [latestData, setLatestData] = useState();

  const header = (
    <div className={headerContainer}>
      <ChartDataHeader
        fiscalYear={curYear}
        right={{ label: 'I Bonds Sales', value: `${yAxisFormatter(curSales)}` }}
        left={{ label: 'Inflation', value: `${curInflation}%` }}
        dateField="Date"
      />
    </div>
  );

  const Legend = () => (
    <div className={chartLegend}>
      <div className={lengendItem}>
        <div className={classNames([label, leftLabel])}>I Bond Sales</div>
        <div className={classNames([line, leftLine])} />
      </div>
      <div className={lengendItem}>
        <div className={classNames([line, rightLine])} />
        <div className={label}>Inflation</div>
      </div>
    </div>
  );
  const resetDataHeader = () => {
    if (latestData) {
      setCurYear(latestData?.year);
      setCurSales(latestData?.sales);
      setCurInflation(latestData?.inflation);
    }
  };

  useEffect(() => {
    console.log(curFy);
    const endpoint = `v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings Bond,security_class_desc:eq:I,record_fiscal_year:gte:${curFy -
      15}&sort=-record_date&page[size]=500`;
    basicFetch(`${apiPrefix}${endpoint}`).then(res => {
      if (res.data) {
        const data = res.data;

        console.log(data);
        const tempChartData = [];
        const xAxis = [];
        data.forEach(val => {
          const cpiKey = 'M' + val.record_calendar_month + val.record_calendar_year;
          const inflationChange = cpi12MonthPercentChange[cpiKey];
          const salesAmount = val.net_sales_amt;
          if (inflationChange && salesAmount) {
            const month = new Date(val.record_date).toLocaleDateString('default', { month: 'short' });
            tempChartData.push({
              year: month + ' ' + val.record_fiscal_year,
              sales: salesAmount,
              inflation: inflationChange,
              recordDate: val.record_date,
              axisValue: val.record_calendar_month === '09',
            });
            if (val.record_calendar_month === '10') {
              xAxis.push(val.record_date);
            }
          }
        });
        const latest = tempChartData[0];
        setLatestData(latest);
        setCurYear(latest.year);
        setCurSales(latest.sales);
        setCurInflation(latest.inflation);
        console.log(latest);
        tempChartData.reverse();
        console.log(tempChartData);
        setChartData(tempChartData);
        setXAxisValues(xAxis);
      }
    });
  }, [curFy]);

  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={lastUpdated} footer={chartCopy.footer} header={header}>
        <div className={chartStyle} data-testid="chartParent">
          <Legend />
          {chartData && (
            <ResponsiveContainer height={352} width="99%">
              <LineChart data={chartData} margin={{ top: 12, bottom: -8, left: -8, right: -12 }} onMouseLeave={resetDataHeader}>
                <CartesianGrid vertical={false} stroke="#d9d9d9" />
                <XAxis dataKey="recordDate" minTickGap={3} ticks={xAxisValues} tickFormatter={value => Number(value.substring(0, 4)) + 1} />
                <YAxis
                  dataKey="sales"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={value => yAxisFormatter(value)}
                  tick={{ fill: treasurySavingsBondsExplainerSecondary }}
                  ticks={[-2500000000, 0, 2500000000, 5000000000, 7500000000]}
                  tickCount={5}
                />
                <YAxis
                  yAxisId={1}
                  dataKey="inflation"
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickCount={5}
                  ticks={[-3, 0, 3, 6, 9]}
                  tickFormatter={value => `${value.toFixed(1)}%`}
                  orientation="right"
                />
                <Line
                  dataKey="sales"
                  stroke={treasurySavingsBondsExplainerSecondary}
                  dot={false}
                  strokeWidth={1}
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Line
                  dataKey="inflation"
                  stroke="#666"
                  strokeDasharray="2 2"
                  dot={false}
                  strokeWidth={2}
                  activeDot={false}
                  isAnimationActive={false}
                  yAxisId={1}
                />
                <Tooltip
                  content={<CustomTooltip setYear={setCurYear} setInflation={setCurInflation} setSales={setCurSales} />}
                  cursor={{ strokeDasharray: '4 4', stroke: '#555', strokeWidth: '2px' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartContainer>
    </>
  );
};

export default IBondSalesChart;
