import React from "react"
import ExplainerSubNav from './explainer-sub-nav'
import {render} from '@testing-library/react';

describe("ExplainerSubNav Component", () => {
  it("renders the component", () => {
    const { getByTestId } = render(<ExplainerSubNav isShown={true}/>)
    expect(getByTestId("explainerSubNav")).toBeInTheDocument()
  })
})