import DeficitChart from './deficit-chart';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import {
  afgOverviewDeficitChart_surplus,
  understandingDeficitMatchers,
} from '../../../explainer-helpers/national-deficit/national-deficit-test-helper';

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({
    ref: jest.fn(),
    inView: false,
  })),
}));

import { useInView } from 'react-intersection-observer';

describe('AFG Deficit Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
    jest.useFakeTimers();
  });

  afterAll(() => {
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

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, afgOverviewDeficitChart_surplus);
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('adds surplus to legend if any surplus years are included', async () => {
    const { findByText } = render(<DeficitChart />);
    const fetchSpy = jest.spyOn(global, 'fetch');
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled);
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

describe('Animation useEffect functionality', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);

    // Mock useInView to return inView: true
    useInView.mockReturnValue({
      ref: jest.fn(),
      inView: true,
    });
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
    jest.clearAllMocks();
  });

  it('executes animation logic', async () => {
    let animationCallback;

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      animationCallback = callback;
      return 1;
    });

    const { findByTestId } = render(<DeficitChart />);
    await findByTestId('chartContainer');
    await waitFor(() => {
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
    if (animationCallback) {
      animationCallback();
    }
    expect(animationCallback).toBeDefined();
  });

  it('executes animation cleanup on unmount', async () => {
    let animationCallback;
    const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      animationCallback = callback;
      return 777;
    });

    const { findByTestId, unmount } = render(<DeficitChart />);
    await findByTestId('chartContainer');

    await waitFor(() => {
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
    unmount();
    expect(cancelSpy).toHaveBeenCalledWith(777);
  });
});
