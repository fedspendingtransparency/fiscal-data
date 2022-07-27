import React from "react";
import {
  render,
  act, waitFor, screen, waitForElementToBeRemoved
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import NationalDeficitHero from "./national-deficit-hero";


describe('National Deficit Hero', () => {

  beforeEach(() => {
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      {
        "data": [{
          "current_fytd_net_outly_amt": "-515067070149.23",
          "prior_fytd_net_outly_amt": "-2237949464925.20",
          "record_calendar_month": "06",
          "record_calendar_year": "2022",
          "record_date": "2022-06-30",
          "record_fiscal_year": "2022"
        }]
      })
  });

  it("Hero Image section loads with relevant data", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const {getByText} = render(<NationalDeficitHero />);
    expect(fetchSpy).toBeCalled();
    await waitFor(() => getByText("$515,067,070,149", {exact:false}));
    expect(await getByText("$515,067,070,149", {exact: false})).toBeInTheDocument();
    expect(await getByText("decreased", {exact: false})).toBeInTheDocument();
    expect(await getByText("down arrow", {exact: false})).toBeInTheDocument();
    global.fetch.mockRestore();
  });

});
