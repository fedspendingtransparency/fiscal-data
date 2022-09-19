import React from 'react';
import {render, waitFor} from '@testing-library/react';
import FederalRevenueTrendsOverTime from "./federal-revenue-trends-over-time";
import fetchMock from "fetch-mock";

describe('revenue trends over time section', () => {

  const mockData = {
    "data": [{
      "current_fytd_net_rcpt_amt": "22379494649.20",
      "record_calendar_month": "06",
      "record_calendar_year": "2015",
      "record_date": "2015-06-30",
      "record_fiscal_year": "2015"
    }]
  }

  beforeAll(() => {
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
      mockData, {overwriteRoutes: true}, {repeat: 1}
    );
  });

  it('renders the revenue trends line chart', () => {
    const {getByTestId} = render(<FederalRevenueTrendsOverTime />);
    expect(getByTestId('revenueTrendsLineChart')).toBeInTheDocument();
  })

  it('renders data for section', async() => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const {getByText} = render(<FederalRevenueTrendsOverTime />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText("since 2015", {exact:false})).toBeInTheDocument();
  })

})
