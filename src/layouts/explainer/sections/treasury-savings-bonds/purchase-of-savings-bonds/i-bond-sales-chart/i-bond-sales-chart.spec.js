import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import IBondSalesChart from './i-bond-sales-chart';
import { CustomTooltip } from './i-bond-sales-chart-helper';
import { mockSavingsBondFetchResponses } from '../../../../explainer-test-helper';

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

const mockCPIData = { M102023: 7, M102020: 11, M102017: 2, M102011: -3.1, M102008: -1 };
const mockAltCPIData = { M102023: 7, M102020: 21, M102017: 2, M102011: 3.1, M102008: 1 };
describe('I Bond Sales Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeAll(() => mockSavingsBondFetchResponses());

  afterEach(() => {
    jest.resetModules();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByTestId } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getByTestId('chartParent')).toBeDefined();
  });

  it('formats y axis values', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getByText('$16.0 B')).toBeInTheDocument();
    expect(getByText('-$2.0 B')).toBeInTheDocument();
    expect(getByText('$0')).toBeInTheDocument();
    expect(getByText('5.0%')).toBeInTheDocument();
    expect(getByText('7.5%')).toBeInTheDocument();
    expect(getByText('-2.5%')).toBeInTheDocument();
  });

  it('formats y axis values with different CPI data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<IBondSalesChart cpi12MonthPercentChange={mockAltCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(getByText('$18.0 B')).toBeInTheDocument();
    expect(getByText('$16.0 B')).toBeInTheDocument();
    expect(getByText('-$2.0 B')).toBeInTheDocument();
    expect(getByText('$0')).toBeInTheDocument();
    expect(getByText('5.0%')).toBeInTheDocument();
    expect(getByText('7.5%')).toBeInTheDocument();
    expect(getByText('-2.5%')).toBeInTheDocument();
  });

  it('chart mouse events', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByTestId } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
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
    expect(setSalesSpy).toHaveBeenCalledWith('2000000000');
    expect(setInflationSpy).toHaveBeenCalledWith('6.0');
  });
});
