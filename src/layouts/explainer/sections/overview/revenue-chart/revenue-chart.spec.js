import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import RevenueChart from './revenue-chart';
import { revenueTrendsMatcher } from '../../../explainer-helpers/government-revenue/government-revenue-test-helper';

describe('AFG Revenue Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, revenueTrendsMatcher);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const instance = render(<RevenueChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(instance).toBeDefined();
  });

  it('renders legend', async () => {
    const { findByText } = render(<RevenueChart />);
    expect(await findByText('2015 FYTD')).toBeInTheDocument();
    expect(await findByText('2014')).toBeInTheDocument();
    expect(await findByText('5 Year Average (2009-2013)')).toBeInTheDocument();
  });
});
