import DebtChart from './debt-chart';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import { mockDebtChartResponseMap } from '../../../explainer-helpers/afg-overview-test-helper';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

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
