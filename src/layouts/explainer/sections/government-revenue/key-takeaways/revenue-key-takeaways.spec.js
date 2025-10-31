import { render, waitFor } from '@testing-library/react';
import React from 'react';
import fetchMock from 'fetch-mock';
import { determineBEANoQ3FetchResponse } from '../../../../../utils/mock-utils';
import RevenueKeyTakeaways from './revenue-key-takeaways';
import revenueConstants from '../constants';
import { beaResponse } from '../../../../../utils/mock-utils-mock-data';

describe('Revenue Key Takeaways evergreen values', () => {
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
        classification_desc: 'Total',
        current_fytd_rcpt_outly_amt: '4045978858727.41',
      },
    ],
  };

  const mockPriorMulti_FROA = {
    data: [
      {
        classification_desc: 'Individual Income Taxes',
        current_fytd_rcpt_outly_amt: '2044377037669.21',
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
        current_fytd_rcpt_outly_amt: '2151987110619.83',
        classification_desc: 'Individual Income Taxes',
      },
    ],
  };

  const mockCurrentMulti_FROA = {
    data: [
      {
        current_fytd_rcpt_outly_amt: '1114485265535.88',
        classification_desc: 'Individual Income Taxes',
      },
    ],
  };

  const baseUrl = 'https://www.transparency.treasury.gov/services/api/fiscal_service/';
  beforeAll(() => {
    // Prior mocks
    fetchMock.get(baseUrl + revenueConstants.PRIOR_FY, mockData);

    // PRIOR_SINGLE_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(baseUrl + revenueConstants.PRIOR_SINGLE_FYTD_RCPT_OUTLY_AMT, mockPriorSngl_FROA);

    // PRIOR_MULTI_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(baseUrl + revenueConstants.PRIOR_MULTI_FYTD_RCPT_OUTLY_AMT, mockPriorMulti_FROA);

    // current mocks
    // CURRENT_FY mock
    fetchMock.get(baseUrl + revenueConstants.CURRENT_FY, mockCurrentFY_FROA);

    // CURRENT_SINGLE_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(baseUrl + revenueConstants.CURRENT_SINGLE_FYTD_RCPT_OUTLY_AMT, mockCurrentSngl_FROA);

    // CURRENT_MULTI_FYTD_RCPT_OUTLY_AMT
    fetchMock.get(baseUrl + revenueConstants.CURRENT_MULTI_FYTD_RCPT_OUTLY_AMT, mockCurrentMulti_FROA);

    fetchMock.get('begin:https://apps.bea.gov/api/', beaResponse);
  });

  afterAll(() => {
    fetchMock.restore();
  });

  it('renders the data correctly', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await findByText('In fiscal year 2021', { exact: false })).toBeInTheDocument();
    expect(await findByText('0%', { exact: false })).toBeInTheDocument();
    expect(await findByText('22.65 trillion', { exact: false })).toBeInTheDocument();
    expect(await findByText('Individual Income Taxes', { exact: false })).toBeInTheDocument();
    expect(await findByText('50.5%', { exact: false })).toBeInTheDocument(); // prior year's %
    expect(await findByText('51.8%', { exact: false })).toBeInTheDocument(); // current year's %
  });
});

describe('Revenue Key Takeaways no GDP Q3 scenario', () => {
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
      `begin:v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockNoQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEANoQ3FetchResponse(jest, mockNoQ3Data);
  });

  afterAll(() => {
    fetchMock.restore();
  });

  it('renders the data correctly in takeaway 3 with 3 total quarters when GDP Q3 is not in but mts 4 is', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText, findAllByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());

    expect(await findAllByText(/in fiscal year 2016/i)).toHaveLength(1);
    expect(await findByText('11.09 trillion', { exact: false })).toBeInTheDocument();
  });
});

describe('Revenue Key Takeaways containing GDP Q3 scenario', () => {
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
      `begin:v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockQ3Data,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEANoQ3FetchResponse(jest, mockQ3Data);
  });

  afterAll(() => {
    fetchMock.restore();
  });

  it('renders the data correctly in takeaway 3 with 4 total quarters when GDP Q3 is present', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { findByText, findAllByText } = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await findAllByText('In fiscal year 2015', { exact: false })).toHaveLength(2);
    expect(await findByText('11.09 trillion', { exact: false })).toBeInTheDocument();
  });
});
