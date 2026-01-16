import { SpendingOverview } from './spending-overview';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import fetchMock from 'fetch-mock';

describe('Federal Spending Overview', () => {
  global.console.warn = jest.fn();

  const mockFiscalYearData = {
    data: [
      {
        current_fytd_net_outly_amt: '4515067070149.23',
        prior_fytd_net_outly_amt: '2237949464925.20',
        record_calendar_month: '09',
        record_calendar_year: '2022',
        record_date: '2022-09-30',
        record_fiscal_year: '2022',
      },
    ],
  };

  const mockSurplusData = {
    data: [
      {
        current_fytd_net_outly_amt: '100000000000',
        record_date: '2022-09-30',
        record_calendar_month: '09',
        record_fiscal_year: '2022',
      },
    ],
  };

  const mockDeficitData = {
    data: [
      {
        current_fytd_net_outly_amt: '-100000000000',
        record_date: '2022-09-30',
        record_calendar_month: '09',
        record_fiscal_year: '2022',
      },
    ],
  };

  beforeEach(() => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt`,
      mockFiscalYearData,
      { overwriteRoutes: true }
    );
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date`,
      mockSurplusData,
      { overwriteRoutes: true }
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('renders the deficit link', () => {
    const { getByRole } = render(<SpendingOverview />);
    expect(getByRole('link', { name: 'national deficit' })).toBeInTheDocument();
  });

  it('renders the USA Spending link', () => {
    const { getByRole } = render(<SpendingOverview />);
    expect(getByRole('link', { name: 'USAspending.gov' })).toBeInTheDocument();
  });

  it('renders the quotebox', () => {
    const { getByTestId } = render(<SpendingOverview />);
    expect(getByTestId('quote-box')).toBeInTheDocument();
  });

  it('loads the evergreen data correctly for a surplus', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SpendingOverview />);

    expect(fetchSpy).toHaveBeenCalled();

    await waitFor(() => {
      expect(getByText('In fiscal year (FY) 2022', { exact: false })).toBeInTheDocument();
    });
    expect(getByText('4.52 trillion', { exact: false })).toBeInTheDocument();
    expect(getByText('which was less than', { exact: false })).toBeInTheDocument();
    expect(getByText('resulting in a surplus', { exact: false })).toBeInTheDocument();

    fetchSpy.mockRestore();
  });

  it('loads the evergreen data correctly for a deficit', async () => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date`,
      mockDeficitData,
      { overwriteRoutes: true }
    );

    const { getByText } = render(<SpendingOverview />);

    await waitFor(() => {
      expect(getByText('which was more than', { exact: false })).toBeInTheDocument();
    });
    expect(getByText('resulting in a deficit', { exact: false })).toBeInTheDocument();
  });
});
