import { dataHeader, inflationLabel, inflationToggleContainer, infoTipContainer } from '../savings-bonds-sold-by-type-chart.module.scss';
import ChartToggle from '../../../../../../../components/nivo/chart-toggle/chart-toggle';
import { treasurySavingsBondsExplainerSecondary } from '../../../treasury-savings-bonds.module.scss';
import InflationToggle from '../inflation-toogle/inflation-toggle';
import InfoTip from '../../../../../../../components/info-tip/info-tip';
import { chartCopy } from '../savings-bonds-sold-by-type-chart-helper';
import React from 'react';

const ChartHeader = ({ selectedChartView, setSelectedChartView }) => {
  return (
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
        chartId={null}
      />
      <div className={inflationToggleContainer}>
        <span className={inflationLabel}>Adjust for Inflation</span>
        <InflationToggle />
        <div className={infoTipContainer}>
          <InfoTip
            hover
            iconStyle={{
              color: '#666666',
              width: '1rem',
              height: '1rem',
            }}
            secondary={false}
          >
            {chartCopy.inflationToolTip}
          </InfoTip>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
