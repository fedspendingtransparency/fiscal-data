import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import IBondSalesChart from './i-bond-sales-chart';
import { CustomTooltip } from './i-bond-sales-chart-helper';

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
describe('I Bond Sales Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  it('renders the chart', () => {
    const { getByTestId } = render(<IBondSalesChart />);
    expect(getByTestId('chartParent')).toBeDefined();
  });

  it('formats y axis values', () => {
    const { getByText } = render(<IBondSalesChart />);
    expect(getByText('$15 B')).toBeInTheDocument();
    expect(getByText('$20 B')).toBeInTheDocument();
    expect(getByText('$0')).toBeInTheDocument();
    expect(getByText('4.0%')).toBeInTheDocument();
    expect(getByText('6.0%')).toBeInTheDocument();
    expect(getByText('0.0%')).toBeInTheDocument();
  });

  it('chart mouse events', () => {
    const { getByTestId } = render(<IBondSalesChart />);
    const chartParent = getByTestId('chartParent');
    const chart = chartParent.children[1].children[0];
    expect(chart).toBeInTheDocument();
    fireEvent.mouseOver(chart);
    fireEvent.mouseLeave(chart);
  });

  it('renders the tooltip', () => {
    const setYearSpy = jest.fn();
    const setSalesSpy = jest.fn();
    const setInflationSpy = jest.fn();
    render(
      <CustomTooltip
        payload={[
          { dataKey: 'inflation', payload: { year: 2020, inflation: '6.0' } },
          { dataKey: 'sales', payload: { year: 2020, sales: '2000000000' } },
        ]}
        setYear={setYearSpy}
        setSales={setSalesSpy}
        setInflation={setInflationSpy}
      />
    );
    expect(setYearSpy).toHaveBeenCalledWith(2020);
    expect(setSalesSpy).toHaveBeenCalledWith('2 B');
    expect(setInflationSpy).toHaveBeenCalledWith('6.0');
  });
});
