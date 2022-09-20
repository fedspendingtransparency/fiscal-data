import {render, waitFor} from '@testing-library/react';
import React from "react";
import fetchMock from "fetch-mock";
import {determineBEAFetchResponse} from "../../../../../utils/mock-utils";
import RevenueKeyTakeaways from "./revenue-key-takeaways";


describe('Spending Key Takeaways evergreen values', () => {
  const mockData = {
    "data": [{
      "current_fytd_net_rcpt_amt": "22379494649.20",
      "record_calendar_month": "06",
      "record_calendar_year": "2021",
      "record_date": "2021-06-30",
      "record_fiscal_year": "2021"
    }]
  }

  beforeAll(() => {
    fetchMock.get(`begin:v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830'
      + ',record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockData, {overwriteRoutes: true}, {repeat: 1}
    );
    determineBEAFetchResponse(jest, mockData);
  });

  it('renders the data correctly in takeaway 3', async() => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const {getByText} = render(<RevenueKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText("In fiscal year 2021", {exact:false})).toBeInTheDocument();
    expect(await getByText("9%", {exact:false})).toBeInTheDocument();
    expect(await getByText("0.24 trillion", {exact:false})).toBeInTheDocument();
  });

});
