import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import ChartToggle from '../../../../../../components/nivo/chart-toggle/chart-toggle';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import InfoTip from '../../../../../../components/info-tip/info-tip';
import { dataHeader, inflationLabel, inflationToggleContainer } from './savings-bonds-sold-by-type-chart.module.scss';
import InflationToggle from './inflation-toogle/inflation-toggle';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { trillionAxisFormatter } from '../../../overview/chart-helper';

const SavingsBondsSoldByTypeChart: FunctionComponent = () => {
  const colorMap = {
    ad: '#B04ABD',
    e: '#DDAA01',
    ee: '#6E338E',
    f: '#5E9F69',
    g: '#E17141',
    h: '#4F9E99',
    hh: '#A6B557',
    i: '#CD425B',
    j: '#E0699F',
    k: '#496FD8',
    sn: '#1B1B1B',
  };

  const [selectedChartView, setSelectedChartView] = useState('amounts');
  const chartTitle = 'Savings Bonds Sold by Type Over Time, FY 1935 – FTYD YYYY';
  const altText =
    'A chart demonstrating the sales of different types of savings bonds based on the years they were ' +
    'available. A toggle is available that when selected, adjusts the values shown in the chart for inflation. ';
  const lastUpdated = new Date();
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

  const handleInflationAdjust = () => {
    // placeholder function
    return;
  };

  const mockData = [
    { year: 1935, ad: 0, e: 0, ee: 1, f: 1, g: 5, h: 1, hh: 1, i: 0, j: 2, k: 0, sn: 0 },
    { year: 1955, ad: 3, e: 12, ee: 1, f: 3, g: 7, h: 2, hh: 3, i: 0, j: 3, k: 1, sn: 0 },
    { year: 1975, ad: 0, e: 4, ee: 10, f: 2, g: 4, h: 2, hh: 3, i: 8, j: 2, k: 2, sn: 0 },
    { year: 1995, ad: 0, e: 1, ee: 18, f: 4, g: 3, h: 3, hh: 2, i: 2, j: 6, k: 1, sn: 1 },
    { year: 2015, ad: 0, e: 0.5, ee: 5, f: 2, g: 3, h: 1, hh: 1, i: 22, j: 4, k: 0.5, sn: 0 },
    { year: 2023, ad: 0, e: 0, ee: 3, f: 1, g: 2, h: 1, hh: 0, i: 20, j: 2, k: 0.25, sn: 0 },
  ];

  const header = (
    <div className={dataHeader}>
      <ChartToggle
        primaryColor={treasurySavingsBondsExplainerSecondary}
        leftButtonConfig={{
          leftTitle: 'Amounts',
          leftId: 'amounts',
          leftSelected: selectedChartView === 'amounts',
        }}
        rightButtonConfig={{
          rightTitle: 'Description',
          rightId: 'description',
          rightSelected: selectedChartView === 'description',
        }}
        toggleClickHandler={chartView => setSelectedChartView(chartView)}
      />
      <div className={inflationToggleContainer}>
        <span className={inflationLabel}>Adjust for Inflation</span>
        <InflationToggle />
        <InfoTip
          hover
          iconStyle={{
            color: '#666666',
            width: '1rem',
            height: '1rem',
            paddingTop: '0.25rem',
            marginLeft: '0.5rem',
          }}
        >
          Adjusting for inflation provides a more accurate comparison between bond sales during different time periods. It shows the real amount of
          bond sales using the current value of a dollar.
        </InfoTip>
      </div>
    </div>
  );

  const lines = ['ad', 'e', 'ee', 'f', 'g', 'h', 'hh', 'i', 'j', 'k', 'sn'];

  return (
    <>
      <ChartContainer title={chartTitle} altText={altText} date={lastUpdated} footer={footer} header={header}>
        <ResponsiveContainer height={377} width="99%">
          <AreaChart data={mockData} margin={{ top: 16, bottom: 0, left: -16, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="year" />
            <YAxis axisLine={false} tickLine={false} tickFormatter={value => `$${value}B`} />
            {lines.map(key => {
              return <Area dataKey={key} fillOpacity={0.9} fill={colorMap[key]} stroke={colorMap[key]} />;
            })}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
};

export default SavingsBondsSoldByTypeChart;
