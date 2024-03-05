import React, { FunctionComponent, useState } from 'react';
import { chartCopy } from './i-bond-sales-chart-helper';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import { LineChart, ResponsiveContainer, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { chartStyle } from '../savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart.module.scss';
import ChartDataHeader from '../../../../explainer-components/chart-data-header/chart-data-header';

const IBondSalesChart: FunctionComponent = () => {
  const lastUpdated = new Date();
  const [curInflation, setCurInflation] = useState(7);
  const [curSales, setCurSales] = useState('17 B');
  const [curYear, setCurYear] = useState(2023);
  const latestYear = 2023;

  const IBondMockData = [
    { year: 2003, sales: 0, inflation: 0 },
    { year: 2005, sales: 2500000000, inflation: 1 },
    { year: 2008, sales: 3000000000, inflation: 2 },
    { year: 2010, sales: 5000000000, inflation: 1 },
    { year: 2013, sales: 4000000000, inflation: 3 },
    { year: 2018, sales: 9000000000, inflation: 2 },
    { year: 2021, sales: 15000000000, inflation: 7.5 },
    { year: 2023, sales: 17000000000, inflation: 7 },
  ];

  const CustomTooltip = ({ payload, setYear }) => {
    if (payload.length > 0) {
      setYear(payload[0]?.payload.year);
      const inflation = payload.find(x => x.dataKey === 'inflation');
      setCurInflation(inflation.payload.inflation);
      const sales = payload.find(x => x.dataKey === 'sales');
      setCurSales(getShortForm(sales.payload.sales));
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
    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ color: '#B04ABD', fontSize: '14px', fontWeight: '600' }}>I Bond Sales</div>
        <div style={{ width: '24px', borderBottom: '0.5px solid #B04ABD', height: '8px', marginLeft: '0.5rem' }} />
      </div>
      <div>Inflation</div>
    </div>
  );
  const resetDataHeader = () => {
    setCurYear(latestYear);
    setCurSales('17 B');
    setCurInflation(7);
  };

  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={lastUpdated} footer={chartCopy.footer} header={header}>
        <div className={chartStyle} data-testid="chartParent">
          <Legend />
          <ResponsiveContainer height={352} width="99%">
            <LineChart data={IBondMockData} margin={{ top: 16, bottom: 0, left: -16, right: -22 }} onMouseLeave={resetDataHeader}>
              <CartesianGrid vertical={false} stroke="#d9d9d9" />
              <XAxis dataKey="year" type="number" domain={[2003, latestYear]} ticks={[2003, 2008, 2013, 2018, 2023]} minTickGap={3} />
              <YAxis dataKey="sales" axisLine={false} tickLine={false} domain={[0, 20000000000]} tickFormatter={value => `$${getShortForm(value)}`} />
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
                content={<CustomTooltip setYear={setCurYear} />}
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
