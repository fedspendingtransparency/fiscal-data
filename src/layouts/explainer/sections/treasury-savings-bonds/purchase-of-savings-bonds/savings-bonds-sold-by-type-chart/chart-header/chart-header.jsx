import { dataHeader, inflationLabel, inflationToggleContainer, infoTipContainer } from '../savings-bonds-sold-by-type-chart.module.scss';
import ChartToggle from '../../../../../../../components/nivo/chart-toggle/chart-toggle';
import { treasurySavingsBondsExplainerDarkerSecondary } from '../../../treasury-savings-bonds.module.scss';
import InflationToggle from '../inflation-toogle/inflation-toggle';
import InfoTip from '../../../../../../../components/info-tip/info-tip';
import { chartCopy } from '../savings-bonds-sold-by-type-chart-helper';
import React from 'react';
import { analyticsEventHandler } from '../../../../../explainer-helpers/explainer-helpers';
import { ga4DataLayerPush } from '../../../../../../../helpers/google-analytics/google-analytics-helper';

const ChartHeader = ({ selectedChartView, setSelectedChartView, onToggle, isInflationAdjusted }) => {
  const handleTooltipMouseEnter = () => {
    const eventLabel = 'Savings Bonds - Additional Inflation Adjustment Info';
    const eventAction = 'Additional Info Hover';
    analyticsEventHandler(eventLabel, eventAction);
    ga4DataLayerPush({
      event: eventAction,
      eventLabel: eventLabel,
    });
  };

  return (
    <div className={dataHeader}>
      <ChartToggle
        primaryColor={treasurySavingsBondsExplainerDarkerSecondary}
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
        toggleClickHandler={chartView => {
          setSelectedChartView(chartView);
          analyticsEventHandler('Savings Bonds - Savings Bonds Type Descriptions', 'Chart Toggle');
        }}
        chartId={null}
      />
      {selectedChartView === 'amounts' && (
        <div className={inflationToggleContainer}>
          <span className={inflationLabel}>Adjust for Inflation</span>
          <InflationToggle onToggle={onToggle} isInflationAdjusted={isInflationAdjusted} />
          <div className={infoTipContainer}>
            <InfoTip
              hover
              iconStyle={{
                color: '#666666',
                width: '1rem',
                height: '1rem',
              }}
              secondary={false}
              title="adjusting for inflation"
              displayTitle={false}
              clickEvent={handleTooltipMouseEnter}
            >
              {chartCopy.inflationToolTip}
            </InfoTip>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartHeader;
