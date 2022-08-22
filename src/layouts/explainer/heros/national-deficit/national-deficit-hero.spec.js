import React from "react";
import {
  render,
  waitFor
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import NationalDeficitHero from "./national-deficit-hero";
import {mockDeficitHeroData} from "../../explainer-test-helper";


describe('National Deficit Hero', () => {

  beforeEach(() => {
    // include a "current" and a last record from the prior year for testing values
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockDeficitHeroData
      )
  });

  it("Hero Image section loads with relevant data", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const glossary = [];
    global.console = {warn: jest.fn()}

    const {getByText} = render(<NationalDeficitHero glossary={glossary} />);
    expect(fetchSpy).toBeCalled();
    await waitFor(() => getByText("$2,237,949,464,925", {exact:false}));
    expect(await getByText("$2,237,949,464,925", {exact: false})).toBeInTheDocument();
    expect(await getByText("decreased", {exact: false})).toBeInTheDocument();
    expect(await getByText("down arrow", {exact: false})).toBeInTheDocument();
    expect(await getByText("2021, the federal government", {exact: false})).toBeInTheDocument();
    expect(await getByText("government spent $2.77 trillion", {exact: false})).toBeInTheDocument();
    expect(await getByText('period last year (Oct 2021', {exact: false})).toBeInTheDocument();
    global.fetch.mockRestore();
  });


});
