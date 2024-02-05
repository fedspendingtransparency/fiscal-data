import React, { FunctionComponent, useState } from 'react';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import ChartContainer from '../../../../explainer-components/chart-container/chart-container';
import ChartToggle from '../../../../../../components/nivo/chart-toggle/chart-toggle';
import { treasurySavingsBondsExplainerSecondary } from '../../treasury-savings-bonds.module.scss';
import InfoTip from '../../../../../../components/info-tip/info-tip';
import { dataHeader, inflationLabel, inflationToggleContainer, chartStyle } from './savings-bonds-sold-by-type-chart.module.scss';
import InflationToggle from './inflation-toogle/inflation-toggle';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartLegend from './chart-legend/chart-legend';
import { chartCopy, lineMap, mockData, lines } from './savings-bonds-sold-by-type-chart-helper';
import CustomTooltip from './custom-tooltip/custom-tooltip';

const SavingsBondsSoldByTypeChart: FunctionComponent = () => {
  const [selectedChartView, setSelectedChartView] = useState('amounts');
  const [hiddenFields, setHiddenFields] = useState([]);
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
          {chartCopy.inflationToolTip}
        </InfoTip>
      </div>
    </div>
  );

  return (
    <>
      <ChartContainer title={chartCopy.title} altText={chartCopy.altText} date={lastUpdated} footer={footer} header={header}>
        {selectedChartView === 'amounts' && (
          <div className={chartStyle}>
            <ResponsiveContainer height={377} width="99%">
              <AreaChart data={mockData} margin={{ top: 16, bottom: 0, left: -18, right: 16 }}>
                <CartesianGrid vertical={false} stroke="#d9d9d9" />
                <XAxis dataKey="year" type="number" domain={[1935, 2023]} ticks={[1935, 1955, 1975, 1995, 2015, 2023]} minTickGap={3} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={value => `$${value}B`} ticks={[0, 5, 10, 15, 20, 25, 30]} tickCount={7} />
                {lines.map(key => {
                  return (
                    <Area
                      dataKey={key}
                      fillOpacity={0.9}
                      fill={lineMap[key].color}
                      stroke={lineMap[key].color}
                      hide={hiddenFields.includes(key)}
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
            <ChartLegend lines={lines} lineMap={lineMap} setHiddenFields={setHiddenFields} hiddenFields={hiddenFields} />
          </div>
        )}
      </ChartContainer>
    </>
  );
};

export default SavingsBondsSoldByTypeChart;
