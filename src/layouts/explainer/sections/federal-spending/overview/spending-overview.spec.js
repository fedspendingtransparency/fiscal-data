import {SpendingOverview} from "./spending-overview";
import {render, waitFor} from '@testing-library/react';
import React from "react";
import fetchMock from "fetch-mock";


describe('Federal Spending Overview', () => {
  global.console.warn = jest.fn();

  it('renders the deficit link', () => {
    const {getByRole} = render(<SpendingOverview />);
    expect(getByRole('link', {name: 'national deficit'})).toBeInTheDocument();
  });

  it('renders the USA Spending link', () => {
    const {getByRole} = render(<SpendingOverview />);
    expect(getByRole('link', {name: 'USAspending.gov'})).toBeInTheDocument();
  });

  it('renders the quotebox', () => {
    const { getByTestId } = render(<SpendingOverview />);
    expect(getByTestId('quote-box')).toBeInTheDocument();
  });

  it('loads the evergreen data correctly for a surplus', async () => {
  const mockData = {
    "data": [{
      "current_fytd_net_outly_amt": "4515067070149.23",
      "prior_fytd_net_outly_amt": "2237949464925.20",
      "record_calendar_month": "06",
      "record_calendar_year": "2022",
      "record_date": "2022-06-30",
      "record_fiscal_year": "2022"
    }]
  }
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockData, {overwriteRoutes: true}, {repeat: 1}
    )
    const fetchSpy = jest.spyOn(global, 'fetch');

    const { getByText } = render(<SpendingOverview />);
    expect(fetchSpy).toBeCalled();
    await waitFor(() => getByText("In fiscal year (FY) 2022", {exact:false}));
    expect(await getByText("4.52 trillion", {exact: false})).toBeInTheDocument();
    expect(await getByText("which was less than", {exact: false})).toBeInTheDocument();
    expect(await getByText("resulting in a surplus", {exact: false})).toBeInTheDocument();
  });

});
