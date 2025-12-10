import { render, waitFor, fireEvent, act } from '@testing-library/react';
import React from 'react';
import SourcesOfRevenueCircleChart from './sources-of-revenue-circle-chart';
import userEvent from '@testing-library/user-event';
import { sourcesOfRevenueCircleChartMatcher } from '../../../../explainer-helpers/government-revenue/government-revenue-test-helper';
import { setGlobalFetchMatchingResponse } from '../../../../../../utils/mock-utils';
import Analytics from '../../../../../../utils/analytics/analytics';

// Mock Analytics to track calls
jest.mock('../../../../../../utils/analytics/analytics', () => ({
  event: jest.fn(),
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('Circle chart', () => {
  window.ResizeObserver = ResizeObserver;

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, sourcesOfRevenueCircleChartMatcher);
  });

  afterAll(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the chart category labels', async () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('Corporate')).toBeInTheDocument());
    expect(await getAllByText('Individual Income Taxes')).toHaveLength(2);
    expect(await getByText('Income Taxes')).toBeInTheDocument();
    expect(await getByText('Social Security')).toBeInTheDocument();
    expect(await getByText('and Medicare Taxes')).toBeInTheDocument();
  });

  it('renders the chart copy', () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />);
    expect(getByText('Revenue Amount')).toBeInTheDocument();
    expect(getByText('% of Total Revenue')).toBeInTheDocument();
  });

  it('renders the data pill', async () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('Total Revenue: $22.38 T', { exact: false })).toBeInTheDocument());
  });

  it('defaults data header to Individual Income Taxes', async () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getAllByText('Individual Income Taxes')).toHaveLength(2));
    expect(await getByText('$2.40 T')).toBeInTheDocument();
    expect(await getByText('65%')).toBeInTheDocument();
  });

  it('updates data header when a new bubble is hovered over', async () => {
    const { getAllByText, getByText, getByRole } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('Corporate')).toBeInTheDocument());
    expect(getByRole('img')).toBeDefined();
    const corporateIncomeTaxesCircle = getByRole('img').children[1].children[1];
    userEvent.hover(corporateIncomeTaxesCircle);
    expect(await getAllByText('Corporate Income Taxes', { exact: false })).toHaveLength(3);
    expect(await getByText('$24 B')).toBeInTheDocument();
    expect(await getByText('1%')).toBeInTheDocument();
  });

  it('renders the callout text', async () => {
    const { getByText } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('In FY 2015', { exact: false })).toBeInTheDocument());
    expect(await getByText('corporate income taxes is $2.43 T', { exact: false })).toBeInTheDocument();
    await waitFor(() => expect(getByText('making up 11%', { exact: false })).toBeInTheDocument());
  });

  it('ignores keyboard interaction if key is not "Enter"', async () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('Corporate')).toBeInTheDocument());

    const labelText = getByText('Corporate').closest('text');
    labelText.focus();

    fireEvent.keyPress(labelText, { key: 'A', code: 'KeyA' });

    expect(await getAllByText('Individual Income Taxes')).toHaveLength(2);
  });

  it('updates the header on keyboard "Enter" interaction with a label', async () => {
    const { getAllByText, getByText } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('Corporate')).toBeInTheDocument());

    const labelText = getByText('Corporate').closest('text');

    labelText.focus();
    fireEvent.keyPress(labelText, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(await getAllByText('Corporate Income Taxes', { exact: false })).toHaveLength(2);
  });

  it('resets the chart to default view when mouse leaves the chart area', async () => {
    const { getAllByText, getByText, getByTestId, getByRole } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('Corporate')).toBeInTheDocument());

    const corporateIncomeTaxesCircle = getByRole('img').children[1].children[1];
    userEvent.hover(corporateIncomeTaxesCircle);
    expect(await getAllByText('Corporate Income Taxes', { exact: false })).toHaveLength(3);

    const chartParent = getByTestId('chartParent');
    userEvent.unhover(chartParent);

    expect(await getAllByText('Individual Income Taxes')).toHaveLength(2);
  });

  it('tracks analytics event on chart hover', async () => {
    jest.useFakeTimers();
    const { getByTestId, getByText } = render(<SourcesOfRevenueCircleChart />);
    await waitFor(() => expect(getByText('Corporate')).toBeInTheDocument());

    const chartParent = getByTestId('chartParent');

    fireEvent.mouseEnter(chartParent);

    act(() => {
      jest.advanceTimersByTime(3100);
    });

    expect(Analytics.event).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Chart Hover',
      label: 'Revenue - Sources of Federal Revenue',
    });

    jest.useRealTimers();
  });
});
