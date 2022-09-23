import React from "react"
import AfgHero from './afg-hero'
import {render} from '@testing-library/react';
import {faHandHoldingDollar} from "@fortawesome/free-solid-svg-icons";

describe("AFG Hero Component", () => {
  it("renders the main icon div and icon", () => {
    const { getByTestId } = render(<AfgHero />)
    expect(getByTestId("afg-hero")).toBeInTheDocument()
  })
})
