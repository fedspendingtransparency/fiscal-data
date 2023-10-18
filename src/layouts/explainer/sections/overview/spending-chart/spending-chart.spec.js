
import React from 'react';
import { render, waitFor } from '@testing-library/react'; 
import fetchMock from 'fetch-mock';
import AFGSpendingChart from './spending-chart'; 
import { basicFetch } from '../../../../../utils/api-utils'; 

jest.mock('../../../../../utils/api-utils');

describe('AFGSpendingChart Component', () => {

  const mockCallOutData = {
    data: [
      {
        record_date: "2019-10-30",
        current_month_gross_outly_amt: "12000000000000",
      },
    ],
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    render(<AFGSpendingChart />);
  });

  it('processes data correctly', async () => {
    const mockData = [
      {
        record_date: "2021-11-15",
        current_month_gross_outly_amt: "11000000000000",
      },
    ];

    render(<AFGSpendingChart />);
    await waitFor(() => expect(basicFetch).toHaveBeenCalledTimes(1));
    const expectedProcessedData = [
      {
        month: "Oct",
        "2021": 1.2,
      },
      {
        month: "Nov",
        "2021": 2.3,
      },
    ];
  });


  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date`,
      mockCallOutData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
  });
  it('fetches current fiscal year and sets it', async () => {
    const mockData = [
      {
        record_fiscal_year: "2022",
      },
    ];
    basicFetch.mockResolvedValueOnce({ data: mockData });
    render(<AFGSpendingChart />);
    await waitFor(() => expect(basicFetch).toHaveBeenCalledTimes(1));
  });
});