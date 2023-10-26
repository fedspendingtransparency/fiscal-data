import React from 'react';
import { render, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import AFGSpendingChart, { TickCount } from './spending-chart';
import { mockSpendingChartData } from '../../../explainer-helpers/afg-overview-test-helper';

describe('AFGSpendingChart Component', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date`,
      mockSpendingChartData,
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

  it('renders legend', async () => {
    const { findByText } = render(<AFGSpendingChart />);
    expect(await findByText('2019 FYTD')).toBeInTheDocument();
    expect(await findByText('2018')).toBeInTheDocument();
    expect(await findByText('5 Year Average (2013-2017)')).toBeInTheDocument();
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
