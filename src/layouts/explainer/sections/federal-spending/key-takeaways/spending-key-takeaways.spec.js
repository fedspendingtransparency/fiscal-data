import { render, waitFor } from '@testing-library/react';
import React from 'react';
import SpendingKeyTakeaways from './spending-key-takeaways';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse, determineBEANoQ3FetchResponse } from '../../../../../utils/mock-utils';

describe('Spending Key Takeaways evergreen values', () => {
  const mockData = {
    data: [
      {
        current_fytd_net_outly_amt: '4515067070149.23',
        prior_fytd_net_outly_amt: '2237949464925.20',
        record_calendar_month: '06',
        record_calendar_year: '2021',
        record_date: '2021-06-30',
        record_fiscal_year: '2021',
      },
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service
    /v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/
    v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEAFetchResponse(jest, mockData);
  });

  it('renders the data correctly in takeaway 1', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SpendingKeyTakeaways />);

    await waitFor(() => expect(fetchSpy).toBeCalledTimes(3));
    await waitFor(() => getByText('2021, the government spent $4.52 trillion', { exact: false }));
    expect(await getByText('which was less than', { exact: false })).toBeInTheDocument();
    expect(await getByText('resulting in a surplus', { exact: false })).toBeInTheDocument();
  });

  it('renders the data correctly in takeaway 3', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SpendingKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    await waitFor(() => getByText('In FY 2021', { exact: false }));

    await waitFor(() => getByText('$2 out of every', { exact: false }));
  });
});

describe('Spending Key Takeaways GDP no Q3 scenario', () => {
  const mockNoQ3Data = {
    data: [
      {
        current_fytd_net_outly_amt: '4515067070149.23',
        prior_fytd_net_outly_amt: '2237949464925.20',
        record_calendar_month: '09',
        record_calendar_year: '2016',
        record_date: '2016-09-30',
        record_fiscal_year: '2016',
      },
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service
    /v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date`,
      mockNoQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/
    v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt`,
      mockNoQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEANoQ3FetchResponse(jest, mockNoQ3Data);
  });

  it('renders the data correctly in takeaway 3 for calculating with 3 total quarters if Q3 GDP is not in yet but mts data is', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SpendingKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    await waitFor(() => getByText('In FY 2016', { exact: false }));

    await waitFor(() => getByText('$4 out of every', { exact: false }));
  });
});

describe('Spending Key Takeaways GDP with Q3 scenario', () => {
  const mockQ3Data = {
    data: [
      {
        current_fytd_net_outly_amt: '4515067070149.23',
        prior_fytd_net_outly_amt: '2237949464925.20',
        record_calendar_month: '09',
        record_calendar_year: '2015',
        record_date: '2015-09-30',
        record_fiscal_year: '2015',
      },
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service
    /v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date`,
      mockQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/
    v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt`,
      mockQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEANoQ3FetchResponse(jest, mockQ3Data);
  });

  it('renders the data correctly in takeaway 3 for calculating with 4 total quarters if Q3 GDP is in', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SpendingKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    await waitFor(() => getByText('In FY 2015', { exact: false }));

    await waitFor(() => getByText('$4 out of every', { exact: false }));
  });
});
