import React from "react";
import {
  render,
  waitFor
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import NationalDeficitHero from "./national-deficit-hero";
import {mockDeficitHeroData, mockDeficitHeroDataOct} from "../../explainer-test-helper";


describe('National Deficit Hero', () => {

  beforeEach(() => {
    // include a "current" and a last record from the prior year for testing values
    fetch.resetMocks();
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockDeficitHeroData,
    )
  });
  // afterEach(() => {
  //   jest.resetModules();
  //   fetchMock.restore;
  // });
  const glossary = [];
  it("Hero Image section loads with relevant data", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    global.console = {warn: jest.fn()}

    const {getByText} = render(<NationalDeficitHero glossary={glossary}/>);
    expect(fetchSpy).toBeCalled();
    await waitFor(() => getByText("$2,237,949,464,925", {exact: false}));
    expect(await getByText("$2,237,949,464,925", {exact: false})).toBeInTheDocument();
    expect(await getByText("decreased", {exact: false})).toBeInTheDocument();
    expect(await getByText("down arrow", {exact: false})).toBeInTheDocument();
    expect(await getByText("2021, the federal government", {exact: false})).toBeInTheDocument();
    expect(await getByText("government spent $2.77 trillion", {exact: false})).toBeInTheDocument();
    expect(await getByText("period last year (Oct 2020 - Jun 2021", {exact: false})).toBeInTheDocument();

    global.fetch.mockRestore();
  });


  it('Evergreen 11 month ', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    global.console = {warn: jest.fn()}
    const {getByText} = render(<NationalDeficitHero glossary={glossary}/>)
    expect(fetchSpy).toBeCalled();
    await waitFort(() => getByText("(Oct 2020)", {exact: false})).toBeInTheDocument();
  });
});

describe('National Deficit Hero Oct Date Range', () => {

  beforeEach(() => {
    // include a "current" and a last record from the prior year for testing values

    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockDeficitHeroDataOct,
    )
  });

  const glossary = [];


  it('Evergreen 11 month ', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    global.console = {warn: jest.fn()}
    const {getByText} = render(<NationalDeficitHero glossary={glossary}/>)
    expect(fetchSpy).toBeCalled();
    await waitFort(() => getByText("(Oct 2020)", {exact: false})).toBeInTheDocument();
    global.fetch.mockRestore();
  });
});
