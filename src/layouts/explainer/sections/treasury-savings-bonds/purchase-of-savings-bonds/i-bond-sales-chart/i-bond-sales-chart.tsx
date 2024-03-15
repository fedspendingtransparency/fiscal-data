import React, { FunctionComponent, useEffect, useState } from 'react';
import { chartCopy, IBondMockData, CustomTooltip } from './i-bond-sales-chart-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { LineChart, ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import ChartDataHeader from '../../../../explainer-components/chart-data-header/chart-data-header';
import { chartLegend, lengendItem, leftLine, label, chartStyle, leftLabel, rightLine, line, headerContainer } from './i-bond-sales-chart.module.scss';
import classNames from 'classnames';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import { apiPrefix, basicFetch } from '../../../../../../utils/api-utils';
import { getDateWithoutTimeZoneAdjust } from '../../../../../../utils/date-utils';
import { ICpiDataMap } from '../../../../../../models/ICpiDataMap';
import moment from 'moment';

interface IIBondsSalesChart {
  cpi12MonthPercentChange: ICpiDataMap;
  curFy: number;
}

const IBondSalesChart: FunctionComponent<IIBondsSalesChart> = ({ cpi12MonthPercentChange, curFy }) => {
  const lastUpdated = new Date();
  const [curInflation, setCurInflation] = useState(7);
  const [curSales, setCurSales] = useState('17 B');
  const [curYear, setCurYear] = useState(2023);
  const latestYear = 2023;
  const [chartData, setChartData] = useState(null);

  const header = (
    <div className={headerContainer}>
      <ChartDataHeader
        fiscalYear={curYear}
        right={{ label: 'I Bonds Sales', value: `$${curSales}` }}
        left={{ label: 'Inflation', value: `${curInflation}%` }}
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
    setCurYear(latestYear);
    setCurSales('17 B');
    setCurInflation(7);
  };

  const xAxisTickFormatter = val => {
    return val === 0 ? `$${val}` : `$${getShortForm(val)}`;
  };

  useEffect(() => {
    console.log(curFy);
    const endpoint = `v1/accounting/od/securities_sales?filter=security_type_desc:eq:Savings Bond,security_class_desc:eq:I,record_fiscal_year:gte:${curFy -
      15}&sort=-record_date&page[size]=500`;
    basicFetch(`${apiPrefix}${endpoint}`).then(res => {
      if (res.data) {
        const data = res.data;
        const tempChartData = [];
        data.forEach(val => {
          const cpiKey = 'M' + val.record_calendar_month + val.record_calendar_year;
          const inflationChange = cpi12MonthPercentChange[cpiKey];
          const salesAmount = val.net_sales_amt;
          if (inflationChange && salesAmount) {
            tempChartData.push({ year: val.record_fiscal_year, sales: salesAmount, inflation: inflationChange, recordDate: val.record_date });
            // console.log(moment(val.record_date));
          }
        });
        tempChartData.reverse();
        console.log(tempChartData);
        setChartData(tempChartData);
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
              <LineChart data={chartData} margin={{ top: 12, bottom: -8, left: -16, right: -22 }} onMouseLeave={resetDataHeader}>
                <CartesianGrid vertical={false} stroke="#d9d9d9" />
                <XAxis dataKey="recordDate" minTickGap={3} />
                <YAxis
                  dataKey="sales"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 20000000000]}
                  tickFormatter={value => xAxisTickFormatter(value)}
                />
                <YAxis
                  yAxisId={1}
                  dataKey="inflation"
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 8]}
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
