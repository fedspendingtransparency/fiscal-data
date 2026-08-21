import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { nationalDebtSectionIds } from '../../national-debt';
import React from 'react';
import { determineBEAFetchResponse } from '../../../../../../utils/mock-utils';
import { mockBeaGDPData, mockExplainerPageResponse } from '../../../../explainer-test-helper';
import Analytics from '../../../../../../utils/analytics/analytics';
import { DebtTrendsOverTimeChart } from './debt-trends-over-time-chart';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

jest.useFakeTimers();

describe('Debt Trends Over Time Chart', () => {
  const sectionId = nationalDebtSectionIds[3];

  beforeEach(() => {
    determineBEAFetchResponse(jest, mockExplainerPageResponse);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('contains the debt trends line chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(
      <>
        <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
      </>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();
  });

  it('Renders the initial chart point for onScroll animation', async () => {
    const { findByTestId, getByTestId } = render(
      <>
        <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
      </>
    );

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();
    expect(await getByTestId('customPoints')).toBeInTheDocument();
    expect((await getByTestId('customPoints').querySelector('circle')?.length) === 2);
  });

  it('moves between data points with the arrow keys from a single tab stop', async () => {
    const { findByTestId, getByTestId, container } = render(
      <>
        <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
      </>
    );

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();
    await findByTestId('customPoints');

    // keep the chart out of view so the intro sweep doesn't drive the headers during this test
    mockAllIsIntersecting(false);

    // the whole chart is one tab stop rather than one per year
    const chartSurface = container.querySelector('svg.recharts-surface');
    expect(chartSurface).toHaveAttribute('tabindex', '0');
    expect(chartSurface).toHaveAttribute('aria-label', 'Inner chart area');
    expect(container.querySelectorAll('[tabindex="0"]')).toHaveLength(1);

    const expectYear = year => waitFor(() => expect(getByTestId('debtTrendsYearHeader').textContent).toContain(year));

    // the mock GDP fixture runs 2011-2022, so focusing lands on 2011 and each arrow steps one year
    fireEvent.focus(chartSurface);
    await expectYear('2011');

    fireEvent.keyDown(chartSurface, { key: 'ArrowRight' });
    await expectYear('2012');

    fireEvent.keyDown(chartSurface, { key: 'ArrowLeft' });
    await expectYear('2011');

    // leaving the chart returns the headers to the most recent year
    fireEvent.blur(chartSurface);
    await expectYear('2021');
  });

  it('initializes with the earliest data point', async () => {
    const { findAllByText } = render(
      <>
        <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
      </>
    );
    act(() => {
      // explicitly declare that the chart is not scrolled into view
      mockAllIsIntersecting(false);
    });

    const latestDateComponents = await findAllByText('2021');
    expect(latestDateComponents[0]).toBeInTheDocument();

    act(() => {
      mockAllIsIntersecting(true);
    });
    const dateComponents = await findAllByText('2011');
    expect(dateComponents[0]).toBeInTheDocument();
    const valueComponent = await findAllByText('80%');
    expect(valueComponent[0]).toBeInTheDocument();
  });

  it('calls the appropriate analytics event when links are clicked on', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { findByText, findByTestId } = render(
      <>
        <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
      </>
    );

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();

    const historicalDebt = await findByText('Historical Debt Outstanding');
    const bea = await findByText('Bureau of Economic Analysis');

    historicalDebt.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Debt Citation Click`,
      label: 'Historical Debt Outstanding',
    });
    spy.mockClear();

    bea.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Debt Citation Click`,
      label: 'Bureau of Economic Analysis',
    });
    spy.mockClear();
  });

  it('calls the appropriate analytics event when the chart is hovered over', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { findByTestId } = render(
      <>
        <DebtTrendsOverTimeChart beaGDPData={mockBeaGDPData} sectionId={sectionId} />
      </>
    );

    const chart = await findByTestId('debtTrendsChart');
    act(() => {
      fireEvent.mouseOver(chart);
      jest.advanceTimersByTime(5000);
    });
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Chart Hover`,
      label: 'Debt - Federal Debt Trends Over Time',
    });
    jest.runAllTimers();
  });
});
