import React from 'react';
import { render } from '@testing-library/react';
import InterestExpenseChart from './interest-expense-chart';
import { CustomTooltip } from './interest-expense-chart-helper';
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

const mockColumnConfigArray = ['Record Date', 'FYTD Interest Expense', 'Avg Interest Rate', 'Fiscal Year'];
const mockColumnConfig = [
  { property: 'record_date', name: 'Record Date', type: 'string' },
  { property: 'expense', name: 'FYTD Interest Expense', type: 'string' },
  { property: 'rate', name: 'Avg Interest Rate', type: 'string' },
  { property: 'year', name: 'Fiscal Year', type: 'string' },
];
const updatedMockInsightChartData = [
  { record_date: '2020-09-30', year: 2020, expense: '600000000000', rate: 2.0 },
  { record_date: '2021-09-30', year: 2021, expense: '650000000000', rate: 2.5 },
];

const mockHookReturnValues = {
  startFY: 2010,
  currentFY: 2025,
  chartData: updatedMockInsightChartData,
  chartXAxisValues: updatedMockInsightChartData.map(d => d.year),
  expenseYAxisValues: [0, ...updatedMockInsightChartData.map(d => d.expense)],
  rateYAxisValues: updatedMockInsightChartData.map(d => d.rate),
  latestChartData: updatedMockInsightChartData[updatedMockInsightChartData.length - 1],
  altText: 'Sample alt text',
  chartLoading: false,
  mergedTableData: updatedMockInsightChartData,
  columnConfigArray: mockColumnConfigArray,
  columnConfig: mockColumnConfig,
};

jest.mock('../useGetInterestExpenseData', () => ({
  useGetInterestExpenseData: () => mockHookReturnValues,
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

  it('handles chart mouse events', async () => {
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
    expect(getByText('2020')).toBeInTheDocument();
    userEvent.tab();
    expect(chart).not.toHaveFocus();
    //Chart header resets
    expect(getByText('2021')).toBeInTheDocument();
  });
});
