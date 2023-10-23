import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import { understandingDeficitMatchers } from '../../../explainer-helpers/national-deficit/national-deficit-test-helper';
import RevenueChart from './revenue-chart';
describe('AFG Revenue Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
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
    expect(await findByText('2021 FYTD')).toBeInTheDocument();
    expect(await findByText('2020')).toBeInTheDocument();
    expect(await findByText('5 Year Average (2015-2019)')).toBeInTheDocument();
  });
});
