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

  const mockPriorSngl_FROA = {
    data: [
      {
        current_fytd_rcpt_outly_amt: '12324.20',
      },
    ],
  };

  const mockPriorMulti_FROA = {
    data: [
      {
        current_fytd_rcpt_outly_amt: '465436514.20',
      },
    ],
  };

  const mockCurrentFY_FROA = {
    data: [
      {
        record_fiscal_year: '2025',
      },
    ],
  };

  const mockCurrentSngl_FROA = {
    data: [
      {
        current_fytd_rcpt_outly_amt: '12324.20',
      },
    ],
  };

  const mockCurrentMulti_FROA = {
    data: [
      {
        current_fytd_rcpt_outly_amt: '546435465.20',
      },
    ],
  };

  beforeAll(() => {
    // Prior mocks
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830'
      + ',record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEAFetchResponse(jest, mockData);

    // PRIOR_SINGLE_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120,record_calendar_month:eq:09&sort=-record_date&page[size]=1`,
      mockPriorSngl_FROA,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    // PRIOR_MULTI_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,record_calendar_month:eq:09&sort=-record_date&page[size]=10`,
      mockPriorMulti_FROA,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    // current mocks
    // CURRENT_FY mock
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:eq:1.1&sort=-record_date&page[size]=1`,
      mockCurrentFY_FROA,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    // CURRENT_SINGLE_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1`,
      mockCurrentSngl_FROA,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    // CURRENT_MULTI_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG&sort=-record_date&page[size]=10`,
      mockCurrentMulti_FROA,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
  });

  it('renders the data correctly', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText('0%', { exact: false })).toBeInTheDocument();
    expect(await getByText('22.65 trillion', { exact: false })).toBeInTheDocument();
  });

  it('renders the fiscal year multiple times', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getAllByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getAllByText('In fiscal year 2021', { exact: false })).toHaveLength(2);
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
    const { getByText, getAllByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getAllByText('In fiscal year 2016', { exact: false })).toHaveLength(2);
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
    const { getByText, getAllByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getAllByText('In fiscal year 2015', { exact: false })).toHaveLength(2);
    expect(await getByText('11.09 trillion', { exact: false })).toBeInTheDocument();
  });
});
