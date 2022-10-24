import HowMuchDoesTheGovtSpend from "./how-much-does-the-govt-spend"
import { render } from "@testing-library/react"
import React from "react"

describe("Federal spending explainer page sections", () => {
  it("renders", () => {
    const instance = render(<HowMuchDoesTheGovtSpend />)
    expect(instance).toBeTruthy()
  })
  it("has the right sections", () => {
    const { getByText } = render(<HowMuchDoesTheGovtSpend />)
    expect(getByText("U.S. Government Spending, FY")).toBeDefined()
    expect(getByText("Top 10 Spending by Category and Agency")).toBeDefined()
  })
})
