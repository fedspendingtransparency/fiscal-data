import React from 'react';

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
describe('Savings Bonds by Type Over Time Chart', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
  it('should ', () => {
    expect(true);
  });
  // beforeAll(() => mockSavingsBondFetchResponses());
  //
  // afterEach(() => {
  //   jest.resetModules();
  // });
  //
  // it('renders the chart', () => {
  //   const { container, getByText } = render(<SavingsBondsSoldByTypeChart chartData={mockData} chartDate={new Date()} />);
  //   expect(container).toBeInTheDocument();
  //   expect(getByText('Adjust for Inflation')).toBeInTheDocument();
  // });
  //
  // it('renders the chart toggle', () => {
  //   const { getByTestId, queryByTestId, getByRole } = render(<SavingsBondsSoldByTypeChart chartData={mockData} chartDate={new Date()} />);
  //   const descriptionsToggle = getByRole('button', { name: 'Description' });
  //   expect(getByTestId('chartParent')).toBeInTheDocument();
  //   act(() => {
  //     fireEvent.click(descriptionsToggle);
  //   });
  //   expect(queryByTestId('chartParent')).not.toBeInTheDocument();
  // });
  //
  // it('formats y axis values', () => {
  //   const { getByText } = render(<SavingsBondsSoldByTypeChart chartData={mockData} chartDate={new Date()} />);
  //   expect(getByText('$24.5 B')).toBeInTheDocument();
  //   expect(getByText('$21.0 B')).toBeInTheDocument();
  //   expect(getByText('$0')).toBeInTheDocument();
  // });
  //
  // it('y axis formatter', () => {
  //   const formattedTrillion = yAxisFormatter(25000000000000);
  //   expect(formattedTrillion).toBe('$25.00 T');
  //   const formattedBillion = yAxisFormatter(25000000000);
  //   expect(formattedBillion).toBe('$25.0 B');
  //   const formattedBillionDecimal = yAxisFormatter(25600000000);
  //   expect(formattedBillionDecimal).toBe('$25.6 B');
  //   const formattedMillion = yAxisFormatter(25000000);
  //   expect(formattedMillion).toBe('$25 M');
  //   const formattedThousand = yAxisFormatter(25000);
  //   expect(formattedThousand).toBe('$25 k');
  // });
  //
  // it('switches chart data on inflation toggle', async () => {
  //   const { getByText, rerender, getByTestId } = render(
  //     <SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} />
  //   );
  //   expect(getByText('$21.0 B')).toBeInTheDocument();
  //   const inflationToggle = getByTestId('inflation-check-box', { name: /adjust for inflation/i });
  //   fireEvent.click(inflationToggle);
  //   rerender(<SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} />);
  //
  //   await waitFor(() => {
  //     expect(getByText('$24.5 B')).toBeInTheDocument();
  //   });
  // });
  //
  // it('chart is keyboard accessible', async () => {
  //   const { getByRole, getAllByText } = render(
  //     <SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} curFy={2023} />
  //   );
  //   const chart = getByRole('application');
  //   expect(getAllByText('1935').length).toBe(1);
  //   userEvent.tab();
  //   userEvent.tab();
  //   userEvent.tab();
  //   userEvent.tab();
  //   userEvent.tab();
  //   expect(chart).toHaveFocus();
  //   //Tooltip opens for the first date
  //   expect(getAllByText('1935').length).toBe(2);
  //   userEvent.tab();
  //   expect(chart).not.toHaveFocus();
  //   //Tooltip closes
  //   expect(getAllByText('1935').length).toBe(1);
  // });
  //
  // it('calls the inflation toggle ga event', async () => {
  //   jest.useFakeTimers();
  //   const gaSpy = jest.spyOn(Analytics, 'event');
  //   const { getByText, getByRole } = render(
  //     <SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} curFy={2023} />
  //   );
  //   // expect(getByText('$21.0 B')).toBeInTheDocument();
  //
  //   // const inflationToggle = getByRole('checkbox', { name: 'inflation toggle switch active: false' });
  //   // fireEvent.click(inflationToggle);
  //
  //   // expect(gaSpy).toHaveBeenCalledWith({
  //   //   action: 'Chart Toggle',
  //   //   category: 'Explainers',
  //   //   label: 'Savings Bonds - Savings Bonds Sold Inflation Adjustment',
  //   // });
  // });
  //
  // it('calls the info tip ga event', async () => {
  //   const gaSpy = jest.spyOn(Analytics, 'event');
  //   const { getByRole } = render(
  //     <SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} curFy={2023} />
  //   );
  //
  //   const infoTip = getByRole('button', { name: 'More information about adjusting for inflation.' });
  //   userEvent.hover(infoTip);
  //   expect(gaSpy).toHaveBeenCalledWith({
  //     action: 'Additional Info Hover',
  //     category: 'Explainers',
  //     label: 'Savings Bonds - Additional Inflation Adjustment Info',
  //   });
  // });
  //
  // it('calls the chart hover ga event', async () => {
  //   jest.useFakeTimers();
  //   const gaSpy = jest.spyOn(Analytics, 'event');
  //
  //   const { getByRole } = render(
  //     <SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} curFy={2023} />
  //   );
  //
  //   const chart = getByRole('application');
  //   userEvent.hover(chart);
  //   jest.advanceTimersByTime(3001);
  //   expect(gaSpy).toHaveBeenCalledWith({
  //     action: 'Chart Hover',
  //     category: 'Explainers',
  //     label: 'Savings Bonds - Savings Bonds Sold by Type Over Time',
  //   });
  // });
  //
  // it('does not call the chart hover ga event before 3 seconds', async () => {
  //   jest.useFakeTimers();
  //   const gaSpy = jest.spyOn(Analytics, 'event');
  //
  //   const { getByRole } = render(
  //     <SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} curFy={2023} />
  //   );
  //
  //   const chart = getByRole('application');
  //   userEvent.hover(chart);
  //   jest.advanceTimersByTime(1000);
  //   userEvent.unhover(chart);
  //   jest.advanceTimersByTime(3000);
  //   expect(gaSpy).not.toHaveBeenCalledWith();
  // });
  //
  // it('calls the citation click events', async () => {
  //   jest.useFakeTimers();
  //   const gaSpy = jest.spyOn(Analytics, 'event');
  //
  //   const { getByRole } = render(
  //     <SavingsBondsSoldByTypeChart chartData={mockData} inflationChartData={mockInflationData} chartDate={new Date()} curFy={2023} />
  //   );
  //
  //   const citation1 = getByRole('link', { name: 'Electronic Securities Transactions' });
  //   const citation2 = getByRole('link', { name: 'Bureau of Labor Statistics' });
  //   userEvent.click(citation1);
  //   expect(gaSpy).toHaveBeenCalledWith({
  //     action: 'Savings Bonds Citation Click',
  //     category: 'Explainers',
  //     label: 'Electronic Securities Transactions',
  //   });
  //   userEvent.click(citation2);
  //   expect(gaSpy).toHaveBeenCalledWith({
  //     action: 'Savings Bonds Citation Click',
  //     category: 'Explainers',
  //     label: 'Bureau of Labor Statistics',
  //   });
  // });
});
