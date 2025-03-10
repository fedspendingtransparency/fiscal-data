import React from 'react';
import { render } from '@testing-library/react';
import { InterestExpenseChart } from './interest-expense-chart';
import { CustomTooltip } from './interest-expense-chart-helper';
import { mockInsightChartData } from '../../../insight-test-helper';
import userEvent from '@testing-library/user-event';
import Analytics from '../../../../../utils/analytics/analytics';

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

const mockHookReturnValues = {
  startFY: 2010,
  currentFY: 2025,
  chartData: mockInsightChartData,
  chartXAxisValues: mockInsightChartData.map(element => element.year),
  expenseYAxisValues: mockInsightChartData.map(element => element.expense).unshift(0),
  rateYAxisValues: mockInsightChartData.map(element => element.rate),
  latestChartData: mockInsightChartData[mockInsightChartData.length - 1],
  altText: `Sample alt text`,
  chartLoading: false,
  mergedTableData: mockInsightChartData,
  columnConfigArray: [],
};

jest.mock('../useGetInterestExpenseData', () => ({
  useGetInterestExpenseData: () => {
    return mockHookReturnValues;
  },
}));

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
    const { getAllByText } = render(<InterestExpenseChart />);
    expect(getAllByText('Interest Expense').length).toEqual(2);
    expect(getAllByText('Avg. Interest Rate').length).toEqual(2);
  });

  it('renders chart correctly in mobile screen size', () => {
    window.innerWidth = 360;
    const { getAllByText } = render(<InterestExpenseChart />);
    expect(getAllByText('Interest Expense').length).toEqual(2);
    expect(getAllByText('Avg. Interest Rate').length).toEqual(2);
  });

  it('renders the tooltip', () => {
    const setYearSpy = jest.fn();
    const setExpenseSpy = jest.fn();
    const setRateSpy = jest.fn();
    render(
      <CustomTooltip
        payload={[
          { dataKey: 'expense', payload: { year: 2020, expense: '600000000000' } },
          { dataKey: 'rate', payload: { year: 2020, rate: '2.0' } },
        ]}
        setYear={setYearSpy}
        setExpense={setExpenseSpy}
        setRate={setRateSpy}
      />
    );
    expect(setYearSpy).toHaveBeenCalledWith(2020);
    expect(setExpenseSpy).toHaveBeenCalledWith('600000000000');
    expect(setRateSpy).toHaveBeenCalledWith('2.0');
  });

  it('chart mouse events', async () => {
    const { getByTestId } = render(<InterestExpenseChart />);
    const chartParent = getByTestId('chartParent');
    const chart = chartParent.children[1].children[0];
    expect(chart).toBeInTheDocument();
    userEvent.hover(chart);
    userEvent.unhover(chart);
  });

  it('fires GA event on chart hover', async () => {
    jest.useFakeTimers();
    const analyticsSpy = jest.spyOn(Analytics, 'event');

    const { getByTestId } = render(<InterestExpenseChart />);
    const chartParent = getByTestId('chartParent');
    userEvent.hover(chartParent);
    jest.advanceTimersByTime(4000);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Chart Hover',
      category: 'Interest Expense',
      label: 'Interest Expense and Average Interest Rates on the National Debt',
    });
    jest.clearAllMocks();
  });

  it('cancels GA event on chart hover less than 3 seconds', async () => {
    jest.useFakeTimers();
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(<InterestExpenseChart />);
    const chartParent = getByTestId('chartParent');
    userEvent.hover(chartParent);
    userEvent.unhover(chartParent);
    jest.advanceTimersByTime(4000);
    expect(analyticsSpy).not.toHaveBeenCalled();
    jest.clearAllMocks();
  });

  it('chart is keyboard accessible', async () => {
    const { getByRole, getByText } = render(<InterestExpenseChart />);
    const chart = getByRole('application');
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    expect(chart).toHaveFocus();
    //Chart header updates to first date
    expect(getByText('2010')).toBeInTheDocument();
    userEvent.tab();
    expect(chart).not.toHaveFocus();
    //Chart header resets
    expect(getByText('2024')).toBeInTheDocument();
  });
});
