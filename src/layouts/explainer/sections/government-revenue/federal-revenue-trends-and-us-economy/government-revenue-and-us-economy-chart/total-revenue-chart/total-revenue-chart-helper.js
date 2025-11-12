import React from 'react';
import { breakpointLg, fontSize_10, fontSize_14, semiBoldWeight } from '../../../../../../../variables.module.scss';
import { pxToNumber } from '../../../../../../../helpers/styles-helper/styles-helper';
import { formatCurrency, formatPercentage } from '../../../../../explainer-helpers/explainer-charting-helper';
import { revenueExplainerPrimary } from '../../../../../../../variables.module.scss';
import Analytics from '../../../../../../../utils/analytics/analytics';
import ChartToggle from '../../../../../../../components/nivo/chart-toggle/chart-toggle';
import ChartDataHeader from '../../../../../explainer-components/chart-data-header/chart-data-header';
import { explainerCitationsMap } from '../../../../../explainer-helpers/explainer-helpers';

const { mtsReceipts, bls, bea } = explainerCitationsMap['government-revenue'];

const footer = (
  <p>
    {/* eslint-disable-next-line max-len */}
    Visit the {mtsReceipts} dataset to further explore and download this data. The GDP data is sourced from the {bea}. The inflation data is sourced
    from the {bls}.
  </p>
);

export const getChartCopy = (minYear, maxYear, selectedChartView) => {
  return {
    title: `Federal Revenue and the U.S. Economy (GDP), FY ${minYear} – ${maxYear}`,
    subtitle: `Inflation Adjusted - ${maxYear} Dollars`,
    footer: footer,
    altText:
      selectedChartView === 'percentageGdp'
        ? 'Line graph showing revenue as a percentage of GDP.'
        : 'Line graph comparing the total federal revenue to the total GDP dollar amount.',
  };
};

export const dataHeader = (chartToggleConfig, headingValues) => {
  if (!chartToggleConfig) return;
  const { setSelectedChartView, selectedChartView } = chartToggleConfig;
  const { fiscalYear, totalRevenue, gdp, gdpRatio } = headingValues;

  const toggleButtonEvent = () => {
    return Analytics.event({
      category: 'Explainers',
      action: 'Chart Toggle',
      label: 'Revenue - Total Revenue / Revenue Percentage of GDP',
    });
  };

  const toggleClickHandler = selectedChartView => {
    setSelectedChartView(selectedChartView);
    toggleButtonEvent();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <ChartToggle
        primaryColor={revenueExplainerPrimary}
        toggleClickHandler={toggleClickHandler}
        leftButtonConfig={{
          leftTitle: 'Total Revenue',
          leftId: 'totalRevenue',
          leftSelected: selectedChartView === 'totalRevenue',
        }}
        rightButtonConfig={{
          rightTitle: 'Percentage of GDP',
          rightId: 'percentageGdp',
          rightSelected: selectedChartView === 'percentageGdp',
        }}
        chartId="revenue-chart-toggle"
      />
      <ChartDataHeader
        fiscalYear={fiscalYear}
        right={
          selectedChartView !== 'percentageGdp' ? { label: 'Total Revenue', value: `$${totalRevenue}` } : { label: 'GDP Ratio', value: `${gdpRatio}` }
        }
        left={selectedChartView !== 'percentageGdp' ? { label: 'GDP', value: `$${gdp}` } : null}
      />
    </div>
  );
};

const layers = ['grid', 'axes', 'lines', 'crosshair', 'markers', 'points', 'mesh'];

export const chartConfigs = {
  layers: layers,
  axisLeftTotalRevenue: {
    format: formatCurrency,
    orient: 'left',
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    tickValues: 6,
  },
  axisLeftPercentageGDP: {
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

export const getMarkers = (width, selectedChartView, gdpValue, revenueValue) => {
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
          legend: 'Total Revenue',
          value: revenueValue - 3,
        },
      ];
};
