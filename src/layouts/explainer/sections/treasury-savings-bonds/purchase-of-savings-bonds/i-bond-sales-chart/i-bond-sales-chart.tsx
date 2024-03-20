import React, { FunctionComponent, useEffect, useState } from 'react';
import { chartCopy, CustomTooltip } from './i-bond-sales-chart-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { LineChart, ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import ChartDataHeader from '../../../../explainer-components/chart-data-header/chart-data-header';
import { chartLegend, lengendItem, leftLine, label, chartStyle, leftLabel, rightLine, line, headerContainer } from './i-bond-sales-chart.module.scss';
import classNames from 'classnames';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { ICpiDataMap } from '../../../../../../models/ICpiDataMap';
import { yAxisFormatter } from '../savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart-helper';
import { getDateWithoutOffset } from '../../../../explainer-helpers/explainer-helpers';

interface IIBondsSalesChart {
  cpi12MonthPercentChange: ICpiDataMap;
  curFy: number;
}

const IBondSalesChart: FunctionComponent<IIBondsSalesChart> = ({ cpi12MonthPercentChange, curFy }) => {
  const [curInflation, setCurInflation] = useState(null);
  const [curSales, setCurSales] = useState(null);
  const [curYear, setCurYear] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [xAxisValues, setXAxisValues] = useState(null);
  const [latestData, setLatestData] = useState<{ year: string; sales: number; inflation: number; recordDate: string }>();

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
      setCurYear(latestData.year);
      setCurSales(latestData.sales);
      setCurInflation(latestData.inflation);
    }
  };

  useEffect(() => {
    const filter = `security_type_desc:eq:Savings Bond,security_class_desc:eq:I,record_fiscal_year:gte:${curFy - 15}`;
    //TODO: check necessary page size
    const sort = '-record_date&page[size]=500';
    const endpoint = `v1/accounting/od/securities_sales?filter=${filter}&sort=${sort}`;
    basicFetch(`${apiPrefix}${endpoint}`).then(res => {
      if (res.data) {
        const data = res.data;
        const tempChartData = [];
        const xAxis = [];
        data.forEach(val => {
          const cpiKey = 'M' + val.record_calendar_month + val.record_calendar_year;
          const inflationChange = cpi12MonthPercentChange[cpiKey];
          const salesAmount = val.net_sales_amt;
          if (inflationChange && salesAmount) {
            const month = new Date(val.record_date).toLocaleDateString('default', { month: 'short' });
            tempChartData.push({
              year: month + ' ' + val.record_calendar_year,
              sales: salesAmount,
              inflation: inflationChange,
              recordDate: val.record_date,
              axisValue: val.record_calendar_month === '09',
            });
            // Create an x-axis tick at the start of the fiscal year ( Oct ), every 3 years
            if (val.record_calendar_month === '10' && (curFy - val.record_fiscal_year) % 3 === 0) {
              xAxis.push(val.record_date);
            }
          }
        });
        const latest = tempChartData[0];
        setLatestData(latest);
        setCurYear(latest.year);
        setCurSales(latest.sales);
        setCurInflation(latest.inflation);
        setXAxisValues(xAxis);
        tempChartData.reverse();
        setChartData(tempChartData);
      }
    });
  }, [curFy]);

  const formatTick = value => {
    // Display tick as the fiscal year for October dates
    return new Date(value).getFullYear() + 1;
  };

  return (
    <>
      {chartData && (
        <ChartContainer
          title={chartCopy.title}
          altText={chartCopy.altText}
          date={getDateWithoutOffset(latestData?.recordDate)}
          footer={chartCopy.footer}
          header={header}
        >
          <div className={chartStyle} data-testid="chartParent">
            <Legend />
            <ResponsiveContainer height={352} width="99%">
              <LineChart data={chartData} margin={{ top: 12, bottom: -8, left: -8, right: -12 }} onMouseLeave={resetDataHeader}>
                <CartesianGrid vertical={false} stroke="#d9d9d9" />
                <ReferenceLine y={0} stroke="#555555" />

                <XAxis dataKey="recordDate" ticks={xAxisValues} tickCount={5} tickFormatter={value => formatTick(value).toString()} />
                <YAxis
                  dataKey="sales"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={value => yAxisFormatter(value)}
                  tick={{ fill: treasurySavingsBondsExplainerSecondary }}
                  ticks={[-2500000000, 0, 2500000000, 5000000000, 7500000000, 10000000000]}
                  tickCount={6}
                />
                <YAxis
                  yAxisId={1}
                  dataKey="inflation"
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickCount={6}
                  ticks={[-3, 0, 3, 6, 9, 12]}
                  tickFormatter={value => `${value.toFixed(1)}%`}
                  orientation="right"
                  domain={[-3, 12]}
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
          </div>
        </ChartContainer>
      )}
    </>
  );
};

export default IBondSalesChart;
