import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setGlobalFetchResponse } from '../../../../../../utils/mock-utils';
import { mockDeficitTrendsData } from '../../../../explainer-test-helper';
import { DeficitTrendsBarChart, HeaderSync } from './deficit-trends-bar-chart';
import { ErrorBoundary } from 'react-error-boundary';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  const ReactModule = require('react');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => ReactModule.createElement('div', null, children),
  };
});

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

const renderChart = () =>
  render(
    <ErrorBoundary>
      <DeficitTrendsBarChart />
    </ErrorBoundary>
  );

const runChartAnimations = async () => {
  for (let i = 0; i < 4; i++) {
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
  }
};

// usage helps us avoid a hard coded tab count
const tabTo = async (user, target) => {
  for (let i = 0; i < 10; i++) {
    await user.tab();
    if (document.activeElement === target) return;
  }
  throw new Error('never reached the target element while tabbing');
};

describe('Deficit Trends Bar Chart', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockDeficitTrendsData);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the trends chart', async () => {
    const { findByTestId } = renderChart();
    expect(await findByTestId('deficitTrendsChartParent')).toBeInTheDocument();
  });

  it('renders the data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = renderChart();
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await findByText('Federal Deficit Trends Over Time, FY 2001-2022')).toBeInTheDocument();
    expect(await findByText('$1.38 T')).toBeInTheDocument();
    expect(await findByText('Last Updated: September 30, 2022')).toBeInTheDocument();
  });

  it('leaves the header on the most recent year while the entrance animation runs', async () => {
    const { findByTestId, getByTestId } = renderChart();
    await findByTestId('deficitTrendsChartParent');
    jest.useFakeTimers();

    act(() => {
      mockSetInView(true);
    });

    act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2022');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$1.38 T');

    await runChartAnimations();
    expect(getByTestId('deficitFiscalYearHeader').textContent).toContain('2022');
    expect(getByTestId('deficitTotalHeader').textContent).toContain('$1.38 T');
  });

  it('reports the active point to the header', () => {
    const onActivePoint = jest.fn();
    render(<HeaderSync active payload={[{ payload: { year: '2015', deficit: '0.44' } }]} onActivePoint={onActivePoint} />);
    expect(onActivePoint).toHaveBeenCalledWith('2015', '0.44');
  });

  it('handles chart mouse events', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { findByTestId } = renderChart();

    const chartParent = await findByTestId('deficitTrendsChartParent');
    act(() => {
      mockSetInView(true);
    });

    await runChartAnimations();
    expect(chartParent).toHaveStyle({ pointerEvents: 'auto' });

    await user.hover(chartParent);
    await user.unhover(chartParent);
    expect(chartParent).toBeInTheDocument();
  });

  it('confirms the chart is keyboard accessible', async () => {
    const user = userEvent.setup();
    const { findByTestId, getByRole, getByTestId } = renderChart();

    await findByTestId('deficitTrendsChartParent');
    act(() => {
      mockSetInView(true);
    });

    const chart = getByRole('application');
    expect(chart).toHaveAttribute('tabindex', '0');

    await tabTo(user, chart);
    expect(chart).toHaveFocus();

    const yearHeader = getByTestId('deficitFiscalYearHeader');
    const totalHeader = getByTestId('deficitTotalHeader');
    expect(yearHeader.textContent).toContain('2001');
    expect(totalHeader.textContent).toContain('$-0.13 T');

    // arrowing to the right moves to the next year
    await user.keyboard('{ArrowRight}');
    expect(yearHeader.textContent).toContain('2002');
    expect(totalHeader.textContent).toContain('$0.16 T');

    // tabbing out resets the header as the user exits the chart
    await user.tab();
    expect(chart).not.toHaveFocus();
    expect(yearHeader.textContent).toContain('2022');
    expect(totalHeader.textContent).toContain('$1.38 T');
  });
});
