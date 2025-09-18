import DebtChart from './debt-chart';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { setGlobalFetchMatchingResponse } from '../../../../../utils/mock-utils';
import { mockDebtChartResponseMap } from '../../../explainer-helpers/afg-overview-test-helper';
import userEvent from '@testing-library/user-event';

jest.mock('recharts', () => {
  const RechartsModule = jest.requireActual('recharts');
  return {
    ...RechartsModule,
    ResponsiveContainer: ({ children }) => (
      <RechartsModule.ResponsiveContainer width={100} height={100}>
        {children}
      </RechartsModule.ResponsiveContainer>
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

  it('enables keyboard accessibility on chart', async () => {
    const { findAllByTestId } = render(<DebtChart />);
    const bars = await findAllByTestId('debtBar');
    userEvent.tab();
    userEvent.tab();
    expect(bars[0]).toHaveFocus();
    userEvent.tab();
    expect(bars[1]).toHaveFocus();
  });
});
