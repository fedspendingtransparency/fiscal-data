import DeficitChart from './deficit-chart';
import { fireEvent, render } from '@testing-library/react';
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

  it('renders chart container with mouse events', async () => {
    const { findByTestId } = render(<DeficitChart />);
    const chart = await findByTestId('chartContainer');
    expect(chart).toBeInTheDocument();
    fireEvent.mouseOver(chart);
    fireEvent.mouseLeave(chart);
    fireEvent.focus(chart);
    fireEvent.blur(chart);
  });

  it('renders legend', async () => {
    const { findByText, queryByText } = render(<DeficitChart />);
    expect(await findByText('Spending')).toBeInTheDocument();
    expect(await findByText('Revenue')).toBeInTheDocument();
    expect(await findByText('Deficit')).toBeInTheDocument();
    expect(await queryByText('Surplus')).not.toBeInTheDocument();
  });
});

describe('AFG Deficit Chart with Surplus Year', () => {
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
