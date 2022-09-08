import React from "react"
import CompareSection from './compare-section'
import {render} from '@testing-library/react';

describe("Compare Section Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(<CompareSection/>)
    expect(getByTestId("compare-section")).toBeInTheDocument()
  })
})
