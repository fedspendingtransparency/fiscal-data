import DebtChart from './debt-chart';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import { understandingDeficitMatchers } from '../../../explainer-helpers/national-deficit/national-deficit-test-helper';
import { mockDebtChartResponseMap, mockEndpointResponseMap } from '../../../explainer-helpers/afg-overview-test-helper';
describe('AFG Debt Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, mockDebtChartResponseMap);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders chart container with mouse events', async () => {
    const { findByTestId } = render(<DebtChart />);
    const chart = await findByTestId('chartContainer');
    expect(chart).toBeInTheDocument();
    fireEvent.mouseOver(chart);
    fireEvent.mouseLeave(chart);
    fireEvent.focus(chart);
    fireEvent.blur(chart);
  });

  it('renders legend', async () => {
    const { findByText } = render(<DebtChart />);
    expect(await findByText('Debt')).toBeInTheDocument();
    expect(await findByText('Deficit')).toBeInTheDocument();
    expect(await findByText('= $1T')).toBeInTheDocument();
  });
});
