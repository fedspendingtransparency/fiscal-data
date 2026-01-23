import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import IBondSalesChart from './i-bond-sales-chart';
import { CustomTooltip, chartCopy } from './i-bond-sales-chart-helper';
import { mockSavingsBondFetchResponses } from '../../../../explainer-test-helper';
import userEvent from '@testing-library/user-event';
import Analytics from '../../../../../../utils/analytics/analytics';

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

    const { findByTestId } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await findByTestId('chartParent')).toBeDefined();
  });

  it('formats y axis values', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText, getByText } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await findByText('$16.0 B')).toBeInTheDocument();
    expect(getByText('-$2.0 B')).toBeInTheDocument();
    expect(getByText('$0')).toBeInTheDocument();
    expect(getByText('5.0%')).toBeInTheDocument();
    expect(getByText('7.5%')).toBeInTheDocument();
    expect(getByText('-2.5%')).toBeInTheDocument();
  });

  it('formats y axis values with different CPI data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText, findByText } = render(<IBondSalesChart cpi12MonthPercentChange={mockAltCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await findByText('$18.0 B')).toBeInTheDocument();
    expect(getByText('$16.0 B')).toBeInTheDocument();
    expect(getByText('-$2.0 B')).toBeInTheDocument();
    expect(getByText('$0')).toBeInTheDocument();
    expect(getByText('5.0%')).toBeInTheDocument();
    expect(getByText('7.5%')).toBeInTheDocument();
    expect(getByText('-2.5%')).toBeInTheDocument();
  });

  it('chart mouse events', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByTestId } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const chartParent = await findByTestId('chartParent');
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

  it('chart is keyboard accessible', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByRole, getByText } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const chart = await findByRole('application');
    userEvent.tab();
    expect(chart).toHaveFocus();
    //Chart header updates to first date
    expect(getByText('Oct 2008')).toBeInTheDocument();
    userEvent.tab();
    expect(chart).not.toHaveFocus();
    //Chart header resets
    expect(getByText('Oct 2023')).toBeInTheDocument();
  });

  it('calls chart hover analytics event', async () => {
    jest.useFakeTimers();
    const fetchSpy = jest.spyOn(global, 'fetch');
    const analyticsSpy = jest.spyOn(Analytics, 'event');

    const { findByRole } = render(<IBondSalesChart cpi12MonthPercentChange={mockCPIData} curFy={2024} />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    const chart = await findByRole('application');
    userEvent.hover(chart);
    jest.advanceTimersByTime(3001);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Chart Hover',
      category: 'Explainers',
      label: 'Savings Bonds - Correlation Between Inflation and I Bond Sales',
    });
  });

  it('calls ga events for when the charts footer links are clicked ', async () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<>{chartCopy.footer}</>);

    const estLink = getByRole('link', { name: 'Electronic Securities Transactions' });
    const blsLink = getByRole('link', { name: 'Bureau of Labor Statistics' });

    fireEvent.click(estLink);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Savings Bonds Citation Click',
      category: 'Explainers',
      label: 'Electronics Securities Transactions',
    });

    fireEvent.click(blsLink);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Savings Bonds Citation Click',
      category: 'Explainers',
      label: 'Bureau of Labor Statistics',
    });
  });
});
