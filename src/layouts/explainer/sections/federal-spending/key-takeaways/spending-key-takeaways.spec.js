import {render, waitFor} from '@testing-library/react';
import React from "react";
import SpendingKeyTakeaways from "./spending-key-takeaways";
import fetchMock from "fetch-mock";
import {determineBEAFetchResponse} from "../../../../../utils/mock-utils";


describe('Spending Key Takeaways evergreen values', () => {
  const mockData = {
    "data": [{
      "current_fytd_net_outly_amt": "4515067070149.23",
      "prior_fytd_net_outly_amt": "2237949464925.20",
      "record_calendar_month": "06",
      "record_calendar_year": "2021",
      "record_date": "2021-06-30",
      "record_fiscal_year": "2021"
    }]
  }

  beforeAll(() => {
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service
    /v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date`,
      mockData, {overwriteRoutes: true}, {repeat: 1}
    );
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/
    v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt`,
      mockData, {overwriteRoutes: true}, {repeat: 1}
    );
    determineBEAFetchResponse(jest, mockData);
  });

  it('renders the data correctly in takeaway 1', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const {getByText} = render(<SpendingKeyTakeaways />);

    await waitFor(() => expect(fetchSpy).toBeCalledTimes(3));
    await waitFor(() => getByText("In fiscal year (FY) 2021", {exact:false}));
    await waitFor(() => getByText("the government spent $4.5 trillion", {exact:false}));
    expect(await getByText("which was less than", {exact: false})).toBeInTheDocument();
    expect(await getByText("resulting in a surplus", {exact: false})).toBeInTheDocument();
  });

  it('renders the data correctly in takeaway 3', async() => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const {getByText} = render(<SpendingKeyTakeaways />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    await waitFor(() => getByText("In FY 2021", {exact:false}));
    await waitFor(() => getByText("$186 out of every", {exact:false}));
  });

});
