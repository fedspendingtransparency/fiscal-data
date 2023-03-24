import {render} from "@testing-library/react";
import React from "react";
import CurrencyEntryBox from "./currency-entry-box";
describe('Currency entry box', () => {
    const currencyName = 'US Dollar';
  it('Renders the provided currency name', () => {
    const {getByText} = render(
      <CurrencyEntryBox defaultCurrency={currencyName} />
    )
    expect(getByText(currencyName)).toBeInTheDocument();
  })

  it('By default does not render the dropdown icon', () => {
    const {queryByRole} = render(
      <CurrencyEntryBox defaultCurrency={currencyName} />
    )
    expect(queryByRole('img', {hidden: true})).toBeFalsy();
  })
})
