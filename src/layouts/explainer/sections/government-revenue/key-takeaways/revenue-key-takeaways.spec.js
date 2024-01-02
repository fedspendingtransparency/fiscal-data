import { render, waitFor } from '@testing-library/react';
import React from 'react';
import fetchMock from 'fetch-mock';
import { determineBEAFetchResponse, determineBEANoQ3FetchResponse } from '../../../../../utils/mock-utils';
import RevenueKeyTakeaways from './revenue-key-takeaways';

describe('Spending Key Takeaways evergreen values', () => {
  const mockData = {
    data: [
      {
        current_fytd_net_rcpt_amt: '22379494649.20',
        record_calendar_month: '06',
        record_calendar_year: '2021',
        record_date: '2021-06-30',
        record_fiscal_year: '2021',
      },
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830'
      + ',record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEAFetchResponse(jest, mockData);
  });

  it('renders the data correctly in takeaway 3', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText('In fiscal year 2021', { exact: false })).toBeInTheDocument();
    expect(await getByText('0%', { exact: false })).toBeInTheDocument();
    expect(await getByText('22.65 trillion', { exact: false })).toBeInTheDocument();
  });
});

describe('Spending Key Takeaways no GDP Q3 scenario', () => {
  const mockNoQ3Data = {
    data: [
      {
        current_fytd_net_rcpt_amt: '22379494649.20',
        record_calendar_month: '09',
        record_calendar_year: '2016',
        record_date: '2016-09-30',
        record_fiscal_year: '2016',
      },
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830'
      + ',record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockNoQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEANoQ3FetchResponse(jest, mockNoQ3Data);
  });

  it('renders the data correctly in takeaway 3 with 3 total quarters when GDP Q3 is not in but mts 4 is', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText('In fiscal year 2016', { exact: false })).toBeInTheDocument();
    expect(await getByText('11.46 trillion', { exact: false })).toBeInTheDocument();
  });
});

describe('Spending Key Takeaways containing GDP Q3 scenario', () => {
  const mockQ3Data = {
    data: [
      {
        current_fytd_net_rcpt_amt: '22379494649.20',
        record_calendar_month: '09',
        record_calendar_year: '2015',
        record_date: '2015-09-30',
        record_fiscal_year: '2015',
      },
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830'
      + ',record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEANoQ3FetchResponse(jest, mockQ3Data);
  });

  it('renders the data correctly in takeaway 3 with 4 total quarters when GDP Q3 is present', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText('In fiscal year 2015', { exact: false })).toBeInTheDocument();
    expect(await getByText('11.09 trillion', { exact: false })).toBeInTheDocument();
  });
});
