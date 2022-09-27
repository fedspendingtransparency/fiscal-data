import SourcesOfFederalRevenue from "./sources-of-federal-revenue"
import {render, waitFor} from "@testing-library/react"
import React from "react"
import { sourcesOfRevenueMatcher } from
    "../../../explainer-helpers/government-revenue/government-revenue-test-helper";
import {setGlobalFetchMatchingResponse} from "../../../../../utils/mock-utils";

describe("Sources of Federal Revenue", () => {
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, sourcesOfRevenueMatcher);
  });
  afterAll(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it("renders the category sub header", () => {
    const { getByRole } = render(<SourcesOfFederalRevenue />)
    expect(
      getByRole("heading", { name: "Social Security and Medicare Taxes" })
    ).toBeInTheDocument()
  })

  it("render the quote box", () => {
    const { getByTestId, getByRole } = render(<SourcesOfFederalRevenue />)
    expect(getByRole("link", { name: "IRS.gov" })).toBeInTheDocument()
    expect(getByTestId("quote-box")).toBeInTheDocument()
  })

  it("renders the data in the section", async() => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SourcesOfFederalRevenue />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText("So far in FY 2022", {exact:false})).toBeInTheDocument();
    expect(await getByText("54.5%", {exact:false})).toBeInTheDocument();
    expect(await getByText("30.8%", {exact:false})).toBeInTheDocument();
  })

})
