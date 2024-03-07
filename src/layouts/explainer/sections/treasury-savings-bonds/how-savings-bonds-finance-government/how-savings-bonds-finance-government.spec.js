import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsFinanceGovernment from './how-savings-bonds-finance-government';

describe('How Savings Bonds Finance The Government Section', () => {
  it('renders the section', () => {
    render(<HowSavingsBondsFinanceGovernment />);
    expect(screen.getByText('Different types of securities earn interest in different ways.', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Savings bonds are the most well-known type of non-marketable security and the only type available for purchase by individuals.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByAltText('A paper Series E Savings Bond')).toBeInTheDocument();
  });
});
