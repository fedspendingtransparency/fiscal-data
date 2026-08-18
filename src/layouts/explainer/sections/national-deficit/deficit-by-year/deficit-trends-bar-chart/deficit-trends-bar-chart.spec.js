import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { setGlobalFetchResponse } from '../../../../../../utils/mock-utils';
import { mockDeficitTrendsData } from '../../../../explainer-test-helper';
import { DeficitTrendsBarChart } from './deficit-trends-bar-chart';
import { ErrorBoundary } from 'react-error-boundary';

// Recharts needs this and jsdom does not provide it.
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ResponsiveContainer measures its parent, gets 0x0 in jsdom, and renders nothing.
// BarChart already receives explicit width/height, so a passthrough is enough.
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  const ReactModule = require('react');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => ReactModule.createElement('div', null, children),
  };
});

// Mocking the hook with real React state lets each test control inView directly.
// The variable must be prefixed with "mock" to satisfy jest.mock hoisting rules.
let mockSetInView;
jest.mock('react-intersection-observer', () => {
  const ReactModule = require('react');
  return {
    useInView: () => {
      const [inView, setInView] = ReactModule.useState(false);
      mockSetInView = setInView;
      return { ref: () => {}, inView };
    },
  };
});

describe('Deficit Trends Bar Chart', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockDeficitTrendsData);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the trends chart', async () => {
    const { findByTestId } = render(
      <ErrorBoundary>
        <DeficitTrendsBarChart />
      </ErrorBoundary>
    );
    expect(await findByTestId('deficitTrendsChartParent')).toBeInTheDocument();
  });

  it('renders the data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(
      <ErrorBoundary>
        <DeficitTrendsBarChart />
      </ErrorBoundary>
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await findByText('Federal Deficit Trends Over Time, FY 2001-2022')).toBeInTheDocument();
    expect(await findByText('$1.38 T')).toBeInTheDocument();
    expect(await findByText('Last Updated: September 30, 2022')).toBeInTheDocument();
  });

  it('Updates header values while the chart animates when it is scrolled into view', async () => {
    const { findByTestId, getByTestId } = render(
      <ErrorBoundary>
        <DeficitTrendsBarChart />
      </ErrorBoundary>
    );

    // let the fetch resolve on real timers before switching to fake ones
    await findByTestId('deficitTrendsChartParent');
    jest.useFakeTimers();

    // not in view yet, so nothing should be scheduled
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2022');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$1.38 T');

    // scroll into view: the wave starts once the growth animation finishes
    act(() => {
      mockSetInView(true);
    });
    act(() => {
      jest.advanceTimersByTime(1360);
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2001');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$-0.13 T');

    // and settles back on the most recent year
    act(() => {
      jest.advanceTimersByTime(20000);
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2022');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$1.38 T');
  });

  it('Updates header values when mousing over a bar', async () => {
    const { findByTestId, findAllByTestId, getByTestId } = render(
      <ErrorBoundary>
        <DeficitTrendsBarChart />
      </ErrorBoundary>
    );

    await findByTestId('deficitTrendsChartParent');
    act(() => {
      mockSetInView(true);
    });

    const customBars = await findAllByTestId('customBar');
    expect(customBars[0]).toBeInTheDocument();

    // hover is gated on animationsComplete, so run the animation out first
    jest.useFakeTimers();
    act(() => {
      jest.advanceTimersByTime(20000);
    });

    act(() => {
      fireEvent.mouseOver(customBars[0]);
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2001');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$-0.13 T');

    // mouseleave lives on the parent div; mouseleave does not bubble from the bar
    act(() => {
      fireEvent.mouseLeave(getByTestId('deficitTrendsChartParent'));
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2022');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$1.38 T');
  });

  it('Updates header values when tabbing through the bars', async () => {
    const { findByTestId, findAllByTestId, getByTestId } = render(
      <ErrorBoundary>
        <DeficitTrendsBarChart />
      </ErrorBoundary>
    );

    await findByTestId('deficitTrendsChartParent');
    act(() => {
      mockSetInView(true);
    });

    const customBars = await findAllByTestId('customBar');
    expect(customBars[0]).toBeInTheDocument();

    // The keyboard path writes to the DOM directly and is not gated on the animation,
    // so no timer advancing is needed here.
    act(() => {
      fireEvent.focus(customBars[0]);
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2001');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$-0.13 T');

    act(() => {
      fireEvent.focus(customBars[1]);
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2002');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$0.16 T');
  });
});
