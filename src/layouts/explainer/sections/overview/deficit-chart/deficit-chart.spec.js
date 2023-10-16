import DeficitChart from './deficit-chart';
import { render, waitFor, act, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import {
  afgOverviewDeficitChart_surplus,
  understandingDeficitMatchers,
} from '../../../explainer-helpers/national-deficit/national-deficit-test-helper';
describe('AFG Deficit Chart', () => {
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

  it('renders legend', async () => {
    const { findByText, queryByText } = render(<DeficitChart />);
    expect(await findByText('Spending')).toBeInTheDocument();
    expect(await findByText('Revenue')).toBeInTheDocument();
    expect(await findByText('Deficit')).toBeInTheDocument();
    expect(await queryByText('Surplus')).not.toBeInTheDocument();
  });

  it('triggers tooltip on hover', async () => {
    const { getByTestId } = render(<DeficitChart />);
    let chart;
    await waitFor(() => {
      chart = getByTestId('chartContainer');
    });
    console.log(chart);
    fireEvent.mouseOver(chart);
    // expect(within(chart).getByTestId('CustomTooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(chart);
  });

  it('removes tooltip on hover', () => {});
});

describe('surplus', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, afgOverviewDeficitChart_surplus);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });
  it('adds surplus to legend if any surplus years are included', async () => {
    const { findByText } = render(<DeficitChart />);
    expect(await findByText('Spending')).toBeInTheDocument();
    expect(await findByText('Revenue')).toBeInTheDocument();
    expect(await findByText('Deficit')).toBeInTheDocument();
    expect(await findByText('Surplus')).toBeInTheDocument();
  });

  it('renders chart title', async () => {
    const { findByText } = render(<DeficitChart />);

    expect(await findByText('Deficit: FYTD 2021', { exact: false })).toBeInTheDocument();
  });
});
