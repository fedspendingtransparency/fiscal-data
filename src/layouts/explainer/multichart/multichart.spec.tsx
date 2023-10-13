import { act, render } from '@testing-library/react';
import React from 'react';
import Multichart from './multichart';
import { percentageFormatter, trillionsFormatter } from '../sections/national-debt/national-debt';
import { mockInterestRatesData, mockTotalDebtData } from '../explainer-test-helper';
import { fireEvent, waitFor } from '@testing-library/dom';

export const mockChartConfigs = [
  {
    name: 'interest',
    dataSourceUrl: 'mock',
    dateField: 'record_date',
    fields: ['avg_interest_rate_amt'],
    marginLabelFormatter: percentageFormatter,
    options: {
      inverted: false,
      forceHeight: 400,
      maxHeightToWidthRatio: 0.8,
      forceYAxisWidth: 60,
      forceLabelFontSize: '0.875rem',
      format: true,
      showOuterXAxisTicks: true,
      placeInitialMarker: true,
      noTooltip: true,
      noShaders: true,
      noInnerXAxisTicks: false,
      placeInnerXAxisTicksBelowLine: true,
      excludeYAxis: true,
      marginLabelOptions: {
        fontSize: 14,
        fontColor: '#666666',
        fontWeight: 600,
      },
      xAxisTickValues: [
        '2021-12-31T00:00:00.000Z',
        '2020-12-31T00:00:00.000Z',
        '2019-12-31T00:00:00.000Z',
        '2018-12-31T00:00:00.000Z',
        '2017-12-31T00:00:00.000Z',
        '2016-12-31T00:00:00.000Z',
        '2015-12-31T00:00:00.000Z',
        '2014-12-31T00:00:00.000Z',
        '2013-12-31T00:00:00.000Z',
        '2012-12-31T00:00:00.000Z',
      ],
    },
    marginLabelLeft: true,
    marginLabelRight: true,
    zeroMarginLabelLeft: true,
    data: mockInterestRatesData,
  },
  {
    name: 'debt',
    dataSourceUrl: 'mock',
    dateField: 'record_date',
    fields: ['total_mil_amt'],
    marginLabelFormatter: trillionsFormatter,
    options: {
      inverted: true,
      shading: {
        side: 'under',
        color: '#4A0072',
      },
      forceHeight: 400,
      forceYAxisWidth: 60,
      forceLabelFontSize: '0.875rem',
      format: true,
      showOuterXAxisTicks: true,
      placeInitialMarker: true,
      noTooltip: true,
      noShaders: true,
      noInnerXAxisTicks: false,
      placeInnerXAxisTicksBelowLine: true,
      excludeYAxis: true,
      marginLabelOptions: {
        fontSize: 14,
        fontColor: '#666666',
        fontWeight: 600,
      },
      xAxisTickValues: [
        '2021-12-31T00:00:00.000Z',
        '2020-12-31T00:00:00.000Z',
        '2019-12-31T00:00:00.000Z',
        '2018-12-31T00:00:00.000Z',
        '2017-12-31T00:00:00.000Z',
        '2016-12-31T00:00:00.000Z',
        '2015-12-31T00:00:00.000Z',
        '2014-12-31T00:00:00.000Z',
        '2013-12-31T00:00:00.000Z',
        '2012-12-31T00:00:00.000Z',
      ],
    },
    marginLabelLeft: true,
    marginLabelRight: true,
    data: mockTotalDebtData,
  },
];

jest.useFakeTimers();
describe('Multichart', () => {
  it('renders expected chart container element', async () => {
    const { getByTestId } = render(<Multichart chartId="test-multichart" chartConfigs={mockChartConfigs} hoverEffectHandler={jest.fn()} />);
    const chartContainer = getByTestId('multichart');
    expect(chartContainer).toBeInTheDocument();
  });

  it('renders the expected margin labels with string formatting applied', () => {
    const { getByText } = render(<Multichart chartId="test-multichart" chartConfigs={mockChartConfigs} hoverEffectHandler={jest.fn()} />);
    expect(getByText('2.52%')).toBeInTheDocument();
    expect(getByText('1.57%')).toBeInTheDocument();
    expect(getByText('$16.43 T')).toBeInTheDocument();
    expect(getByText('$29.62 T')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
  });
  it('renders a chart for each config', () => {
    const { getAllByTestId } = render(<Multichart chartId="test-multichart" chartConfigs={mockChartConfigs} hoverEffectHandler={jest.fn()} />);
    expect(getAllByTestId('dataviz-line').length).toStrictEqual(2);
  });
  it('renders initial circle markers for each chart', () => {
    const { getByTestId } = render(<Multichart chartId="test-multichart" chartConfigs={mockChartConfigs} hoverEffectHandler={jest.fn()} />);
    expect(getByTestId('debt-marker')).toBeInTheDocument();
    expect(getByTestId('interest-marker')).toBeInTheDocument();
  });

  it(`renders a mouseTracking element on mouseEnter event and
  removes it on mouseOut`, async () => {
    await act(async () => {
      const { queryAllByTestId, getByTestId } = await render(
        <Multichart chartId="testy" chartConfigs={mockChartConfigs} hoverEffectHandler={jest.fn()} />
      );
      jest.runAllTimers();
      const chartContainer = getByTestId('multichart');
      expect(queryAllByTestId('testy-line-chart-hover-effects').length).toStrictEqual(0);
      await fireEvent.mouseOver(chartContainer);
      await waitFor(() => getByTestId('testy-line-chart-hover-effects'));
      expect(queryAllByTestId('testy-line-chart-hover-effects').length).toStrictEqual(1);
      await fireEvent.mouseOut(chartContainer);
      jest.advanceTimersByTime(500);
      expect(queryAllByTestId('testy-line-chart-hover-effects').length).toStrictEqual(0);
    });

    jest.runAllTimers();
  });
});
