import { render } from '@testing-library/react';
import React from 'react';
import CurrencyEntryBox from './currency-entry-box';
describe('Currency entry box', () => {
  const currencyName = 'U.S. Dollar';
  it('Renders the provided currency name', () => {
    const { getByText } = render(
      <CurrencyEntryBox defaultCurrency={currencyName} />
    );
    expect(getByText(currencyName)).toBeInTheDocument();
  });

  it('renders the input box', () => {
    const { getByRole } = render(
      <CurrencyEntryBox
        selectedCurrency={{ label: 'Euro Zone-Euro' }}
        dropdown={true}
        options={[]}
      />
    );

    expect(
      getByRole('spinbutton', { name: 'Enter Euro Zone-Euro Amount' })
    ).toBeInTheDocument();
  });
});
