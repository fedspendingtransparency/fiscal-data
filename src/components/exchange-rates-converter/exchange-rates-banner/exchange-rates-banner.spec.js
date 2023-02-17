import {render} from "@testing-library/react";
import React from "react";
import ExchangeRatesBanner from "./exchange-rates-banner";
describe('exchange rates banner', () => {
  const title = 'Currency Exchange Rates Converter';

  it('Displays the banner text', () => {
    const {getByText} = render(
      <ExchangeRatesBanner text={title} />
    )
    expect(getByText(title)).toBeInTheDocument();
  })

  it('Displays the social share button', () => {
    const {getByText} = render(
      <ExchangeRatesBanner text={title} />
    )
    expect(getByText('Share')).toBeInTheDocument();
  })
})
