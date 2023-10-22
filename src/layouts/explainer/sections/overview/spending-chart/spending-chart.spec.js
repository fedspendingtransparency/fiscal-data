import React from 'react';
import { render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import AFGSpendingChart, { TickCount } from './spending-chart';

describe('AFGSpendingChart Component', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  const mockData = {
    data: [
      {
        record_fiscal_year: '2019',
        record_date: '2019-11-15',
        current_month_gross_outly_amt: '11000000000000',
      },
    ],
  };

  beforeEach(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('renders the chart', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const instance = render(<AFGSpendingChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(instance).toBeDefined();
  });

  it('user can see chart title', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const instance = render(<AFGSpendingChart />);
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(instance.getByText('Cumulative Spending by Month in trillions of USD')).toBeInTheDocument();
  });

  it('should render the correct month when month is in monthsDisplayed', () => {
    const { queryByText } = render(
      <svg>
        <TickCount x={10} y={9} payload={{ value: 'Jan' }} />
      </svg>
    );
    expect(queryByText('Jan')).toBeInTheDocument();
  });

  it('should not render the month when month is not in monthsDisplayed', () => {
    const { queryByText } = render(
      <svg>
        <TickCount x={10} y={9} payload={{ value: 'Feb' }} />
      </svg>
    );
    expect(queryByText('Feb')).not.toBeInTheDocument();
  });

});
