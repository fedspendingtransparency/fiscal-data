import {render} from "@testing-library/react";
import React from "react";
import CurrencyExchangeRatesConverter from "./index";

describe('exchange rates converter', () => {
  it('Renders the exchange rates converter page', () => {
    const {getByText, getAllByText, getByRole} = render(
      <CurrencyExchangeRatesConverter />
    )
    expect(getAllByText('Currency Exchange Rates Converter').length).toBeGreaterThan(0);
  })
})
