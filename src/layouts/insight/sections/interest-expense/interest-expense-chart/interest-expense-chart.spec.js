import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { InterestExpenseChart } from './interest-expense-chart';
import { CustomTooltip } from './interest-expense-chart-helper';
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

describe('Interest Expense Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

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
          { dataKey: 'interestExpense', payload: { year: 2020, interestExpense: '600000000000' } },
          { dataKey: 'avgInterestRate', payload: { year: 2020, avgInterestRate: '2.0' } },
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
    fireEvent.mouseOver(chart);
    fireEvent.mouseLeave(chart);
  });

  it('chart is keyboard accessible', async () => {
    const { getByRole, getByText } = render(<InterestExpenseChart />);
    const chart = getByRole('application');
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
