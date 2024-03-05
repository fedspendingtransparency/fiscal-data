import React, { FunctionComponent, useState } from 'react';
import { chartCopy, IBondMockData } from './i-bond-sales-chart-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { LineChart, ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import ChartDataHeader from '../../../../explainer-components/chart-data-header/chart-data-header';
import { chartLegend, lengendItem, leftLine, label, chartStyle, leftLabel, rightLabel, rightLine, line } from './i-bond-sales-chart.module.scss';
import classNames from 'classnames';
const IBondSalesChart: FunctionComponent = () => {
  const lastUpdated = new Date();
  const [curInflation, setCurInflation] = useState(7);
  const [curSales, setCurSales] = useState('17 B');
  const [curYear, setCurYear] = useState(2023);
  const latestYear = 2023;

  const CustomTooltip = ({ payload = [], setYear, setInflation, setSales }) => {
    if (payload.length > 0) {
      setYear(payload[0]?.payload.year);
      const inflation = payload.find(x => x.dataKey === 'inflation');
      setInflation(inflation.payload.inflation);
      const sales = payload.find(x => x.dataKey === 'sales');
      setSales(getShortForm(sales.payload.sales));
    }
    return <></>;
  };

  const header = (
    <ChartDataHeader
      fiscalYear={curYear}
      right={{ label: 'I Bonds Sales', value: `$${curSales}` }}
      left={{ label: 'Inflation', value: `${curInflation.toFixed(1)}%` }}
    />
  );

  const Legend = () => (
    <div className={chartLegend}>
      <div className={lengendItem}>
        <div className={classNames([label, leftLabel])}>I Bond Sales</div>
        <div className={classNames([line, leftLine])} />
      </div>
      <div className={lengendItem}>
        <div className={classNames([line, rightLine])} />
        <div className={classNames([label, rightLabel])}>Inflation</div>
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

  return (
    <>
      <ChartContainer
        title={chartCopy.title}
        altText={chartCopy.altText}
        date={lastUpdated}
        footer={chartCopy.footer}
        header={header}
        customHeaderStyles={{ marginTop: '2rem' }}
      >
        <div className={chartStyle} data-testid="chartParent">
          <Legend />
          <ResponsiveContainer height={352} width="99%">
            <LineChart data={IBondMockData} margin={{ top: 12, bottom: -8, left: -16, right: -22 }} onMouseLeave={resetDataHeader}>
              <CartesianGrid vertical={false} stroke="#d9d9d9" />
              <XAxis dataKey="year" type="number" domain={[2003, latestYear]} ticks={[2003, 2008, 2013, 2018, 2023]} minTickGap={3} />
              <YAxis dataKey="sales" axisLine={false} tickLine={false} domain={[0, 20000000000]} tickFormatter={value => xAxisTickFormatter(value)} />
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
              <Line dataKey="sales" stroke="#B04ABD" dot={false} strokeWidth={1} activeDot={false} isAnimationActive={false} />
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
    </>
  );
};

export default IBondSalesChart;
