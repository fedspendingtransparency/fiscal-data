import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StateAndLocalGovernmentSeriesChart from './state-and-local-government-series-chart';
import { CustomTooltip } from './state-and-local-government-series-chart-helper';

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

const mockChartData = [
  { date: '2020-08-30', totalAmount: '650000000000', totalCount: 25000 },
  { date: '2020-09-30', totalAmount: '600000000000', totalCount: 20000 },
];

const mockHookReturnValues = {
  chartData: mockChartData,
  xAxisValues: ['2020-09-30', '2020-08-30'],
};

jest.mock('../useGetStateAndLocalGovernmentSeriesData', () => ({
  useGetStateAndLocalGovernmentSeriesData: () => mockHookReturnValues,
}));

jest.mock('../../../../../components/chart-with-table/chart-table-container/chart-table-container', () => {
  return {
    ChartTableContainer: ({ children, downloadData, ...props }) => (
      <div data-testid="chartTableContainer" data-download={JSON.stringify(downloadData)}>
        {children}
      </div>
    ),
  };
});

describe('Interest Expense Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders chart correctly', () => {
    const { getAllByText } = render(<StateAndLocalGovernmentSeriesChart />);
    expect(getAllByText('Amount').length).toEqual(2);
    expect(getAllByText('Count').length).toEqual(2);
  });

  it('renders chart correctly in mobile screen size', () => {
    window.innerWidth = 360;
    const { getAllByText } = render(<StateAndLocalGovernmentSeriesChart />);
    expect(getAllByText('Amount').length).toEqual(2);
    expect(getAllByText('Count').length).toEqual(2);
  });

  it('renders the tooltip', () => {
    const setDateSpy = jest.fn();
    const setAmountSpy = jest.fn();
    const setCountSpy = jest.fn();
    render(
      <CustomTooltip
        payload={[
          { dataKey: 'totalAmount', payload: { date: '2020-10-31', totalAmount: '600000000000' } },
          { dataKey: 'totalCount', payload: { date: '2020-10-31', totalCount: '20123' } },
        ]}
        setDate={setDateSpy}
        setAmount={setAmountSpy}
        setCount={setCountSpy}
      />
    );
    expect(setDateSpy).toHaveBeenCalledWith('2020-10-31');
    expect(setAmountSpy).toHaveBeenCalledWith('600000000000');
    expect(setCountSpy).toHaveBeenCalledWith('20123');
  });

  it('handles chart mouse events', async () => {
    const { getByTestId } = render(<StateAndLocalGovernmentSeriesChart />);
    const chartParent = getByTestId('chartParent');
    const chart = chartParent.children[0].children[0];
    expect(chart).toBeInTheDocument();
    userEvent.hover(chart);
    userEvent.unhover(chart);
  });

  it('formats axis values', () => {
    const { getByText } = render(<StateAndLocalGovernmentSeriesChart />);
    expect(getByText('27K')).toBeInTheDocument();
    expect(getByText('$900 B')).toBeInTheDocument();
  });

  it('chart is keyboard accessible', async () => {
    const { getByRole, getByText } = render(<StateAndLocalGovernmentSeriesChart />);
    const chart = getByRole('application');
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    expect(chart).toHaveFocus();
    //Chart header updates to first date
    expect(getByText('Aug 2020')).toBeInTheDocument();
    expect(getByText('$600 B')).toBeInTheDocument();
    expect(getByText('25,000')).toBeInTheDocument();
    userEvent.tab();
    expect(chart).not.toHaveFocus();
    //Chart header resets
    expect(getByText('Sep 2020')).toBeInTheDocument();
  });
});
