import React from "react";
import {
  render,
  waitFor
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import NationalDeficitHero from "./national-deficit-hero";


describe('National Deficit Hero', () => {

  beforeEach(() => {
    // include a "current" and a last record from the prior year for testing values
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      {
        "data": [{
          "current_fytd_net_outly_amt": "-515067070149.23",
          "prior_fytd_net_outly_amt": "-2237949464925.20",
          "record_calendar_month": "06",
          "record_calendar_year": "2022",
          "record_date": "2022-06-30",
          "record_fiscal_year": "2022"
        },
        {
          "current_fytd_net_outly_amt":"-2772178788289.42",
          "prior_fytd_net_outly_amt":"-3131917245643.30",
          "record_date":"2021-09-30",
          "record_calendar_month":"09",
          "record_calendar_year":"2021",
          "record_fiscal_year":"2021"
        }]
      })
  });

  it("Hero Image section loads with relevant data", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const {getByText} = render(<NationalDeficitHero />);
    expect(fetchSpy).toBeCalled();
    await waitFor(() => getByText("$2,237,949,464,925", {exact:false}));
    expect(await getByText("$2,237,949,464,925", {exact: false})).toBeInTheDocument();
    expect(await getByText("decreased", {exact: false})).toBeInTheDocument();
    expect(await getByText("down arrow", {exact: false})).toBeInTheDocument();
    expect(await getByText("In fiscal year (FY) 2021", {exact: false})).toBeInTheDocument();
    expect(await getByText("government spent $2.77 trillion", {exact: false})).toBeInTheDocument();
    global.fetch.mockRestore();
  });

});
