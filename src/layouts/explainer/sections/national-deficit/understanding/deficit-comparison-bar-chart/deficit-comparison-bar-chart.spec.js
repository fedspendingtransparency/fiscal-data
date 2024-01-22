import React from 'react';
import { act, render } from '@testing-library/react';
import DeficitComparisonBarChart from './deficit-comparison-bar-chart';
import { nationalDeficitSectionIds } from '../../national-deficit';
import { setGlobalFetchMatchingResponse } from '../../../../../../utils/mock-utils';
import {
  mockDeficitComparisonChartMarkers,
  understandingDeficitMatchers,
  understandingDeficitMatchers_increase,
  understandingDeficitMatchers_noChange,
} from '../../../../explainer-helpers/national-deficit/national-deficit-test-helper';
import { waitFor } from '@testing-library/dom';
import { mockIsIntersecting } from 'react-intersection-observer/test-utils';

describe('Deficit Comparison Bar Chart', () => {
  const sectionId = nationalDeficitSectionIds[1];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders the chart $ values and labels', async () => {
    jest.useFakeTimers();
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { findByText, findByTestId } = render(<DeficitComparisonBarChart sectionId={sectionId} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const chartParent = findByTestId('chartParentDiv');

    mockIsIntersecting(await chartParent, false);
    await act(async () => {
      jest.advanceTimersByTime(2000);
      for (const mockMarker of mockDeficitComparisonChartMarkers) {
        const marker = await findByText(mockMarker);
        expect(marker).toBeInTheDocument();
        expect(marker).toHaveStyle({ opacity: 0 });
      }
    });

    mockIsIntersecting(await chartParent, true);
    await act(async () => {
      jest.runAllTimers();
      for (const mockMarker of mockDeficitComparisonChartMarkers) {
        const marker = await findByText(mockMarker);
        expect(marker).toBeInTheDocument();
        expect(marker).toHaveStyle({ opacity: 1 });
      }
    });
  });

  it('renders the chart header', async () => {
    const { findByText } = render(<DeficitComparisonBarChart sectionId={sectionId} />);

    expect(await findByText('U.S. Deficit Compared to Revenue and Spending, FY 2021')).toBeInTheDocument();
  });

  it('renders the chart footer', async () => {
    const { findByText } = render(<DeficitComparisonBarChart sectionId={sectionId} />);

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

    const { getByText } = render(<DeficitComparisonBarChart sectionId={sectionId} />);
    await act(async () => {
      await waitFor(() => {
        expect(getByText('a decrease of', { exact: false })).toBeInTheDocument();
      });
    });
  });

  it('renders correct callout text when the deficit increased from the prior fiscal year', async () => {
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers_increase);
    const sectionId = nationalDeficitSectionIds[1];

    const { getByText } = render(<DeficitComparisonBarChart sectionId={sectionId} />);
    await act(async () => {
      await waitFor(() => {
        expect(getByText('an increase of', { exact: false })).toBeInTheDocument();
      });
    });
  });

  it('renders correct callout text when the deficit did not change from the prior fiscal year', async () => {
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers_noChange);
    const sectionId = nationalDeficitSectionIds[1];

    const { getByText } = render(<DeficitComparisonBarChart sectionId={sectionId} />);
    await act(async () => {
      await waitFor(() => {
        expect(getByText('remaining unchanged', { exact: false })).toBeInTheDocument();
      });
    });
  });
});
