import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import ChartToggle from '../../../../../../components/nivo/chart-toggle/chart-toggle';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import InfoTip from '../../../../../../components/info-tip/info-tip';
import { dataHeader, inflationLabel, inflationToggleContainer } from './savings-bonds-sold-by-type-chart.module.scss';
import Switch from '@mui/material/Switch';
import InflationToggle from './inflation-toogle/inflation-toggle';

const SavingsBondsSoldByTypeChart: FunctionComponent = () => {
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
        <InfoTip hover iconStyle={{ color: '#666666', width: '1rem', height: '1rem', paddingTop: '0.25rem', marginLeft: '0.5rem' }}>
          Adjusting for inflation provides a more accurate comparison between bond sales during different time periods. It shows the real amount of
          bond sales using the current value of a dollar.
        </InfoTip>
      </div>
    </div>
  );

  return (
    <>
      <ChartContainer title={chartTitle} altText={altText} date={lastUpdated} footer={footer} header={header}>
        chart
      </ChartContainer>
    </>
  );
};

export default SavingsBondsSoldByTypeChart;
