import React from "react";
import {
  render,
  waitFor
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import {mockSpendingHeroData, mockSpendingHeroData_decrease} from "../../explainer-test-helper";
import FederalSpendingHero from "./federal-spending-hero";

describe('Federal spending Hero', () => {
  beforeAll(() => {
    // include a "current" and a last record from the prior year for testing values
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockSpendingHeroData, {overwriteRoutes: true}, {repeat: 1}
    )
  });

  it("Hero Image section loads with relevant data", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const {getByText} = render(<FederalSpendingHero />);
    expect(fetchSpy).toBeCalled();

    await waitFor(() => getByText("$4.52 trillion", {exact:false}));
    expect(await getByText("in fiscal year 2022", {exact: false})).toBeInTheDocument();
    expect(await getByText("Fiscal Year-to-Date (since October 2021)", {exact: false}))
      .toBeInTheDocument();
    expect(await getByText("Compared to the federal spending of $2.24 trillion", {exact: false}))
      .toBeInTheDocument();
    expect(await getByText("(Oct 2020 - Jun 2021)", {exact: false})).toBeInTheDocument();
    expect(await getByText("federal spending has increased by $2.28 trillion", {exact: false}))
      .toBeInTheDocument();

    global.fetch.mockRestore();
  });
});

describe("Pill data section", () => {
  it("correctly renders the pill data, when spending has increased", async () => {
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockSpendingHeroData, {overwriteRoutes: true}, {repeat: 1}
    )
    const fetchSpy = jest.spyOn(global, 'fetch');

    const {getByText, getByRole} = render(<FederalSpendingHero />);
    expect(fetchSpy).toBeCalled();

    await waitFor(() => getByText("$2.24 T", {exact:false}));
    expect(await getByRole("img", {name: "up arrow"})).toBeInTheDocument();
    expect(await getByText("102%", {exact: false})).toBeInTheDocument();

    global.fetch.mockRestore();
  });

  it("correctly renders the pill data, when spending has decreased", async () => {
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockSpendingHeroData_decrease, {overwriteRoutes: true}, {repeat: 1}
    )
    const fetchSpy = jest.spyOn(global, 'fetch');

    const {getByText, getByRole} = render(<FederalSpendingHero />);
    expect(fetchSpy).toBeCalled();

    await waitFor(() => getByText("$2.24 T", {exact:false}));
    expect(await getByRole("img", {name: "down arrow"})).toBeInTheDocument();
    expect(await getByText("-50%", {exact: false})).toBeInTheDocument();

    global.fetch.mockRestore();
  });
})
