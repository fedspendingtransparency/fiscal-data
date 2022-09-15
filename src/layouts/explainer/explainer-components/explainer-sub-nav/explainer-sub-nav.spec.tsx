import React from "react"
import ExplainerSubNav from './explainer-sub-nav'
import {render} from '@testing-library/react';

describe("Icon Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(<ExplainerSubNav />)
    expect(getByTestId("explainerSubNav")).toBeInTheDocument()
  })
})