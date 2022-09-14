import SourcesOfFederalRevenue from "./sources-of-federal-revenue"
import { render } from "@testing-library/react"
import React from "react"

describe("Sources of Federal Revenue", () => {
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
})
