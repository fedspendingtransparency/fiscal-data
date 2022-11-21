import React from "react";
import {
  render,
  waitFor
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import NationalDeficitHero from "./national-deficit-hero";
import {mockDeficitHeroData} from "../../explainer-test-helper";


describe('National Deficit Hero', () => {
  beforeAll(() => {
    // include a "current" and a last record from the prior year for testing values
    // fetch.resetMocks();
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockDeficitHeroData, {overwriteRoutes: true}, {repeat: 1}
    )
  });
  afterAll(() => {
    jest.resetModules();
    global.fetch.mockRestore();
  });

  const glossary = [];
  it("Hero Image section loads with relevant data", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    global.console = {warn: jest.fn()}

    const {getByText, queryByText} = render(<NationalDeficitHero glossary={glossary} />);
    expect(fetchSpy).toBeCalled();
    await waitFor(() => getByText("$2.24 trillion", {exact: false}));
    expect(await getByText("$2.24 trillion", {exact: false})).toBeInTheDocument();
    expect(await queryByText("$2,237,949,464,925.", {exact: false})).not.toBeInTheDocument();
    expect(await getByText("decreased", {exact: false})).toBeInTheDocument();
    expect(await getByText("down arrow", {exact: false})).toBeInTheDocument();
    expect(await getByText("fiscal year (FY)", {exact: false})).toBeInTheDocument();
    expect(await getByText("2022", {exact: false})).toBeInTheDocument();
    expect(await getByText("government has spent $515.07 billion", {exact: false}))
      .toBeInTheDocument();
    expect(await getByText("period last year (Oct 2020 - Jun 2021)", {exact: false}))
      .toBeInTheDocument();
  });
});

