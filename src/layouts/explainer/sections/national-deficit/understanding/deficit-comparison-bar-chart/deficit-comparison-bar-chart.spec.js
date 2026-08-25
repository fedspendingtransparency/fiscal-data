import React from 'react';
import { act, render } from '@testing-library/react';
import DeficitComparisonBarChart, { BarLabel } from './deficit-comparison-bar-chart';
import { nationalDeficitSectionIds } from '../../national-deficit';
import { setGlobalFetchMatchingResponse } from '../../../../../../utils/mock-utils';
import {
  mockDeficitComparisonChartMarkers,
  understandingDeficitMatchers,
  understandingDeficitMatchers_increase,
  understandingDeficitMatchers_noChange,
} from '../../../../explainer-helpers/national-deficit/national-deficit-test-helper';
import { waitFor } from '@testing-library/dom';
import { ErrorBoundary } from 'react-error-boundary';

let mockInView = true;

jest.mock('react-intersection-observer', () => ({
  ...jest.requireActual('react-intersection-observer'),
  useInView: () => ({ ref: jest.fn(), inView: mockInView }),
}));

jest.mock('recharts', () => {
  const actualRecharts = jest.requireActual('recharts');
  const ReactActual = jest.requireActual('react');

  return {
    ...actualRecharts,
    ResponsiveContainer: ({ children, height }) =>
      ReactActual.cloneElement(children, { width: 408, height: typeof height === 'number' ? height : 288 }),
  };
});

describe('Deficit Comparison Bar Chart', () => {
  const sectionId = nationalDeficitSectionIds[1];

  beforeEach(() => {
    jest.useFakeTimers();
    mockInView = true;
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetModules();
    global.fetch.mockReset();
  });

  const renderChart = async () => {
    const utils = render(
      <ErrorBoundary>
        <DeficitComparisonBarChart sectionId={sectionId} />
      </ErrorBoundary>
    );

    await utils.findByTestId('chartParentDiv');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    return utils;
  };

  it('renders the chart $ values and series labels', async () => {
    const { findByText } = await renderChart();

    for (const mockMarker of mockDeficitComparisonChartMarkers) {
      expect(await findByText(mockMarker, { selector: 'text' })).toBeInTheDocument();
    }
  });

  it('anchors the revenue and deficit labels left of the stack and the spending label right', async () => {
    const { getByText, container } = await renderChart();

    const spendingLabel = getByText('Spending', { selector: 'text' });
    const revenueLabel = getByText('Revenue', { selector: 'text' });
    const bars = container.querySelectorAll('.recharts-bar-rectangle path');

    expect(bars.length).toBeGreaterThan(0);
    expect(Number(spendingLabel.getAttribute('x'))).toBeGreaterThan(Number(revenueLabel.getAttribute('x')));
  });

  it('holds the chart back until it scrolls into view', async () => {
    mockInView = false;

    const { findByTestId, queryByText } = render(
      <ErrorBoundary>
        <DeficitComparisonBarChart sectionId={sectionId} />
      </ErrorBoundary>
    );
    await findByTestId('chartParentDiv');

    act(() => {
      jest.runOnlyPendingTimers();
    });

    for (const mockMarker of mockDeficitComparisonChartMarkers) {
      expect(queryByText(mockMarker, { selector: 'text' })).not.toBeInTheDocument();
    }
  });
});

describe('BarLabel', () => {
  const config = {
    labelOffsetLeft: 65,
    labelOffsetRight: 62,
    labelBaselineOffset: -5,
    labelLineHeight: 25,
    labelFontSize: '1rem',
    labelNameWeight: 800,
  };

  const renderLabel = props =>
    render(
      <svg>
        <BarLabel viewBox={{ x: 93, y: 100, width: 92, height: 180 }} value={4220000000000} label="Revenue" config={config} {...props} />
      </svg>
    );

  it('bolds the series name but not the value above it', () => {
    const { getByText } = renderLabel();

    expect(getByText('Revenue')).toHaveStyle({ fontWeight: 800 });
    expect(getByText('$4.22 T')).not.toHaveStyle({ fontWeight: 800 });
  });

  it('sizes both lines from the config', () => {
    const { getByText } = renderLabel();

    expect(getByText('Revenue')).toHaveStyle({ fontSize: '1rem' });
    expect(getByText('$4.22 T')).toHaveStyle({ fontSize: '1rem' });
  });

  it('stacks the series name a line below the value', () => {
    const { getByText } = renderLabel();

    expect(getByText('$4.22 T')).toHaveAttribute('y', '185');
    expect(getByText('Revenue')).toHaveAttribute('y', '210');
  });

  it('sits in the left gutter, or the right gutter when aligned right', () => {
    const { getByText, unmount } = renderLabel();
    expect(getByText('Revenue')).toHaveAttribute('x', '28');
    unmount();

    const { getByText: getRightAligned } = renderLabel({ alignRight: true, label: 'Spending' });
    expect(getRightAligned('Spending')).toHaveAttribute('x', '247');
  });

  it('reads a stacked segment value from its start/end pair', () => {
    const { getByText } = renderLabel({ value: [4220000000000, 6970000000000] });

    expect(getByText('$2.75 T')).toBeInTheDocument();
  });
});

describe('Deficit Comparison Bar Chart Copy', () => {
  const sectionId = nationalDeficitSectionIds[1];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the chart header', async () => {
    const { findByText } = render(
      <ErrorBoundary>
        <DeficitComparisonBarChart sectionId={sectionId} />
      </ErrorBoundary>
    );

    expect(await findByText('U.S. Deficit Compared to Revenue and Spending, FY 2021')).toBeInTheDocument();
  });

  it('renders the chart footer', async () => {
    const { findByText } = render(
      <ErrorBoundary>
        <DeficitComparisonBarChart sectionId={sectionId} />
      </ErrorBoundary>
    );

    expect(await findByText('Last Updated: September 30, 2021')).toBeInTheDocument();
  });
});

describe('Callout text', () => {
  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders correct callout text when the deficit decreased from the prior fiscal year', async () => {
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
    const sectionId = nationalDeficitSectionIds[1];
    const { getByText } = render(
      <ErrorBoundary>
        <DeficitComparisonBarChart sectionId={sectionId} />
      </ErrorBoundary>
    );
    await waitFor(() => {
      expect(getByText('a decrease of', { exact: false })).toBeInTheDocument();
    });
  });

  it('renders correct callout text when the deficit increased from the prior fiscal year', async () => {
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers_increase);
    const sectionId = nationalDeficitSectionIds[1];

    const { getByText } = render(
      <ErrorBoundary>
        <DeficitComparisonBarChart sectionId={sectionId} />
      </ErrorBoundary>
    );
    await waitFor(() => {
      expect(getByText('an increase of', { exact: false })).toBeInTheDocument();
    });
  });

  it('renders correct callout text when the deficit did not change from the prior fiscal year', async () => {
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers_noChange);
    const sectionId = nationalDeficitSectionIds[1];

    const { getByText } = render(
      <ErrorBoundary>
        <DeficitComparisonBarChart sectionId={sectionId} />
      </ErrorBoundary>
    );
    await waitFor(() => {
      expect(getByText('remaining unchanged', { exact: false })).toBeInTheDocument();
    });
  });
});
