import React from 'react';
import { dataHeaderContainer } from './total-spending-chart.module.scss';
import { breakpointLg, fontSize_10, fontSize_14, semiBoldWeight } from '../../../../../../variables.module.scss';
import { pxToNumber } from '../../../../../../helpers/styles-helper/styles-helper';
import ChartToggle from '../../../../../../components/nivo/chart-toggle/chart-toggle';
import { spendingExplainerPrimary } from '../../../../../../variables.module.scss';
import { formatCurrency, formatPercentage } from '../../../../explainer-helpers/explainer-charting-helper';
import ChartDataHeader from '../../../../explainer-components/chart-data-header/chart-data-header';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';

const { bls, bea, mtsReceipts } = explainerCitationsMap['federal-spending'];

const footer = (
  <p>
    Visit the {mtsReceipts} dataset to explore and download this data. The GDP data is sourced from the {bea}. The inflation data is sourced from the{' '}
    {bls}.
  </p>
);

export const getChartCopy = (minYear, maxYear, selectedChartView) => {
  return {
    title: `Government Spending and the U.S. Economy (GDP), FY ${minYear} – ${maxYear}`,
    subtitle: `Inflation Adjusted - ${maxYear} Dollars`,
    footer: footer,
    altText:
      selectedChartView === 'percentageGdp'
        ? 'A line graph showing the percentage of GDP.'
        : 'Line graph comparing the total federal spending to the total GDP dollar amount.',
  };
};

export const dataHeader = (chartToggleConfig, headingValues, gaEvent) => {
  if (!chartToggleConfig) return;
  const { setSelectedChartView, selectedChartView } = chartToggleConfig;

  const { fiscalYear, totalSpending, gdp, gdpRatio } = headingValues;

  const toggleClickHandler = selectedChartView => {
    setSelectedChartView(selectedChartView);
    gaEvent('19');
  };

  return (
    <div className={dataHeaderContainer}>
      <ChartToggle
        primaryColor={spendingExplainerPrimary}
        toggleClickHandler={toggleClickHandler}
        leftButtonConfig={{
          leftTitle: 'Total Spending',
          leftId: 'totalSpending',
          leftSelected: selectedChartView === 'totalSpending',
        }}
        rightButtonConfig={{
          rightTitle: 'Percentage of GDP',
          rightId: 'percentageGdp',
          rightSelected: selectedChartView === 'percentageGdp',
        }}
        chartId="spending-chart-toggle"
      />
      <ChartDataHeader
        fiscalYear={fiscalYear}
        right={
          selectedChartView !== 'percentageGdp'
            ? { label: 'Total Spending', value: `$${totalSpending}` }
            : { label: 'GDP Ratio', value: `${gdpRatio}` }
        }
        left={selectedChartView !== 'percentageGdp' ? { label: 'GDP', value: `$${gdp}` } : null}
      />
    </div>
  );
};

const layers = ['grid', 'crosshair', 'markers', 'axes', 'areas', 'lines', 'points'];

export const chartConfigs = {
  layers: layers,
  axisLeftSpending: {
    format: formatCurrency,
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisLeftPercent: {
    format: formatPercentage,
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisBottom: {
    orient: 'bottom',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 7,
  },
};

export const getMarkers = (width, selectedChartView, gdpValue, spendingValue) => {
  const markerStyle = {
    axis: 'y',
    background: '#666666',
    lineStyle: { strokeWidth: 0 },
    textStyle: {
      fontWeight: semiBoldWeight,
      fill: '#666666',
      fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    },
  };
  return selectedChartView === 'percentageGdp'
    ? []
    : [
        {
          ...markerStyle,
          legend: 'GDP',
          value: gdpValue - 3,
        },
        {
          ...markerStyle,
          legend: 'Total Spending',
          value: spendingValue - 3,
          legendOffsetY: -12,
        },
      ];
};
